-- ============================================================
--  FREUNDE, PROFILSCHAU UND DIE RANGLISTE NACH WOCHE  (30.10.2026)
--  Einspielen: Supabase → SQL Editor → einfügen → "Run"
--  Setzt supabase-rangliste.sql, -zeitraum und -profilbild voraus.
--  Mehrfach ausführbar.
-- ============================================================
--
-- Drei Dinge in einer Datei, weil sie zusammengehören:
--
--  1. Die Freundschaften selbst – anfragen, annehmen, beenden.
--  2. Die Rangliste lernt "nur Freunde", den Zeitraum "woche" und
--     gibt das Profilbild mit heraus. Die Fassung aus -zeitraum.sql
--     konnte das noch nicht und wird hier ersetzt.
--  3. Das öffentliche Profil, das man aus der Rangliste antippt.
--
-- Warum wieder Funktionen statt offener Leseregeln: profile und
-- statistik bleiben privat. Die Funktionen laufen als SECURITY
-- DEFINER und geben nur heraus, was öffentlich sein soll – kein
-- E-Mail, keine Nutzer-ID.

create extension if not exists pgcrypto;


-- ------------------------------------------------------------
--  1. Die Freundschaften
-- ------------------------------------------------------------
-- Eine Zeile je Paar, Richtung inbegriffen: `von` hat angefragt,
-- `an` wurde gefragt. Solange status 'offen' ist, ist es eine
-- Anfrage; 'angenommen' ist die Freundschaft.
--
-- Die Freundschaft steht NICHT doppelt in der Tabelle. Zwei Zeilen
-- je Paar müssten immer gemeinsam geändert werden, und genau das
-- vergisst man irgendwann.
create table if not exists freunde (
  id          uuid primary key default gen_random_uuid(),
  von         uuid not null references auth.users(id) on delete cascade,
  an          uuid not null references auth.users(id) on delete cascade,
  status      text not null default 'offen' check (status in ('offen', 'angenommen')),
  erstellt_am timestamptz not null default now(),
  constraint freunde_nicht_sich_selbst check (von <> an),
  unique (von, an)
);

create index if not exists idx_freunde_von on freunde (von);
create index if not exists idx_freunde_an  on freunde (an);

alter table freunde enable row level security;

-- Sehen darf eine Zeile, wer daran beteiligt ist.
drop policy if exists "freunde_lesen" on freunde;
create policy "freunde_lesen" on freunde
  for select using (auth.uid() = von or auth.uid() = an);

-- Anlegen geht nur über freund_anfragen() – die Regel hier ist der
-- Riegel dagegen, sich von Hand als Freund einzutragen.
drop policy if exists "freunde_anlegen" on freunde;
create policy "freunde_anlegen" on freunde
  for insert with check (auth.uid() = von and status = 'offen');

-- Annehmen darf nur, wer gefragt wurde. Sonst könnte man die eigene
-- Anfrage selbst bestätigen und stünde in fremden Freundeslisten.
drop policy if exists "freunde_annehmen" on freunde;
create policy "freunde_annehmen" on freunde
  for update using (auth.uid() = an) with check (auth.uid() = an);

-- Ablehnen, zurückziehen, beenden – aus Sicht der Datenbank dasselbe.
drop policy if exists "freunde_beenden" on freunde;
create policy "freunde_beenden" on freunde
  for delete using (auth.uid() = von or auth.uid() = an);


-- ------------------------------------------------------------
--  2. Wer ist mit mir befreundet?
-- ------------------------------------------------------------
-- Als eigene Funktion, weil drei Stellen sie brauchen: die
-- Rangliste, die Suche und die Freundesliste.
create or replace function meine_freunde_ids()
returns table (nutzer_id uuid)
language sql
stable
security definer
set search_path = public
as $$
  select case when f.von = auth.uid() then f.an else f.von end
  from freunde f
  where f.status = 'angenommen'
    and (f.von = auth.uid() or f.an = auth.uid());
$$;


-- ------------------------------------------------------------
--  3. Die Rangliste – mit Woche, Freundesfilter und Bild
-- ------------------------------------------------------------
-- Ersetzt die zweistellige Fassung aus supabase-rangliste-zeitraum.sql.
-- Die muss weg: Stünden beide mit Vorgabewerten da, wäre ein Aufruf
-- mit zwei Angaben zweideutig und Postgres bräche ab.
drop function if exists rangliste_zeitraum(text, int);

create or replace function rangliste_zeitraum(
  zeitraum text default 'gesamt',
  anzahl int default 10,
  nur_freunde boolean default false
)
returns table (platz bigint, benutzername text, xp int, ich boolean, bild text)
language sql
stable
security definer
set search_path = public
as $$
  with grenze as (
    select case lower(zeitraum)
             when 'woche' then date_trunc('week',  current_date)::date
             when 'monat' then date_trunc('month', current_date)::date
             when 'jahr'  then date_trunc('year',  current_date)::date
             else null                       -- gesamt: keine Grenze
           end as ab
  ),
  kreis as (
    -- Bei "nur Freunde" zählen die Freunde und man selbst. Ohne
    -- sich selbst wüsste man nicht, wo man steht.
    select nutzer_id from meine_freunde_ids()
    union select auth.uid()
  ),
  punkte as (
    select
      p.id,
      p.benutzername,
      p.bild,
      p.erstellt_am,
      case
        when (select ab from grenze) is null
          then coalesce(s.xp, 0)
        else coalesce((
          select sum(t.xp) from xp_tage t
          where t.nutzer_id = p.id and t.tag >= (select ab from grenze)
        ), 0)
      end::int as xp
    from profile p
    left join statistik s on s.nutzer_id = p.id
    where p.benutzername is not null
      and (not nur_freunde or p.id in (select nutzer_id from kreis))
  ),
  liste as (
    select
      row_number() over (order by xp desc, erstellt_am asc) as platz,
      benutzername,
      bild,
      xp,
      coalesce(id = auth.uid(), false) as ich
    from punkte
    -- Bei Woche/Monat/Jahr nur zeigen, wer in dem Zeitraum etwas
    -- getan hat. Man selbst bleibt immer sichtbar, sonst wirkt es
    -- wie ein Fehler.
    where (select ab from grenze) is null or xp > 0 or id = auth.uid()
  )
  select platz, benutzername, xp, ich, bild
  from liste
  where platz <= least(greatest(anzahl, 1), 50) or ich
  order by platz;
$$;

revoke all on function rangliste_zeitraum(text, int, boolean) from public, anon;
grant execute on function rangliste_zeitraum(text, int, boolean) to authenticated;


-- ------------------------------------------------------------
--  4. Das öffentliche Profil
-- ------------------------------------------------------------
-- Was hier nicht herauskommt, kann auch niemand abfangen: keine
-- E-Mail, keine Nutzer-ID, kein Anzeigename aus der Anmeldung.
create or replace function profil_oeffentlich(name text)
returns table (
  benutzername text, bild text, platz bigint, xp int,
  serie int, xp_woche int, xp_monat int, dabei_seit date
)
language sql
stable
security definer
set search_path = public
as $$
  with wer as (
    select p.id, p.benutzername, p.bild, p.erstellt_am
    from profile p
    where lower(p.benutzername) = lower(name)
  ),
  rang as (
    select count(*) + 1 as platz
    from profile p2
    left join statistik s2 on s2.nutzer_id = p2.id
    where p2.benutzername is not null
      and coalesce(s2.xp, 0) > coalesce(
        (select s3.xp from statistik s3 where s3.nutzer_id = (select id from wer)), 0
      )
  )
  select
    w.benutzername,
    w.bild,
    (select platz from rang),
    coalesce(s.xp, 0)::int,
    coalesce(s.serie, 0)::int,
    coalesce((select sum(t.xp) from xp_tage t
              where t.nutzer_id = w.id
                and t.tag >= date_trunc('week', current_date)::date), 0)::int,
    coalesce((select sum(t.xp) from xp_tage t
              where t.nutzer_id = w.id
                and t.tag >= date_trunc('month', current_date)::date), 0)::int,
    w.erstellt_am::date
  from wer w
  left join statistik s on s.nutzer_id = w.id;
$$;

revoke all on function profil_oeffentlich(text) from public, anon;
grant execute on function profil_oeffentlich(text) to authenticated;


-- ------------------------------------------------------------
--  5. Nach Leuten suchen
-- ------------------------------------------------------------
-- Jeder Treffer sagt mit, wie man zueinander steht – sonst wüsste
-- die App nicht, ob sie "Anfragen", "Annehmen" oder "Angefragt"
-- anbieten soll.
create or replace function nutzer_suchen(was text)
returns table (benutzername text, xp int, bild text, stand text)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.benutzername,
    coalesce(s.xp, 0)::int,
    p.bild,
    case
      when p.id = auth.uid() then 'ich'
      when exists (select 1 from freunde f
                   where f.status = 'angenommen'
                     and ((f.von = auth.uid() and f.an = p.id)
                       or (f.an = auth.uid() and f.von = p.id))) then 'freund'
      when exists (select 1 from freunde f
                   where f.status = 'offen' and f.von = auth.uid() and f.an = p.id) then 'gesendet'
      when exists (select 1 from freunde f
                   where f.status = 'offen' and f.an = auth.uid() and f.von = p.id) then 'wartet'
      else 'fremd'
    end
  from profile p
  left join statistik s on s.nutzer_id = p.id
  where p.benutzername is not null
    and p.benutzername ilike '%' || trim(was) || '%'
    and length(trim(was)) >= 2
  order by
    -- Wer genau so heißt, steht oben; danach die kürzeren Namen,
    -- weil der Treffer bei ihnen mehr vom Namen ausmacht.
    (lower(p.benutzername) = lower(trim(was))) desc,
    length(p.benutzername) asc,
    coalesce(s.xp, 0) desc
  limit 20;
$$;

revoke all on function nutzer_suchen(text) from public, anon;
grant execute on function nutzer_suchen(text) to authenticated;


-- ------------------------------------------------------------
--  6. Die eigene Freundesliste (mit offenen Anfragen)
-- ------------------------------------------------------------
-- Freunde und Anfragen in EINER Liste: In der App stehen sie
-- untereinander, und zwei Abfragen für eine Ansicht wären zwei
-- Gelegenheiten, aus dem Tritt zu geraten.
create or replace function meine_freunde()
returns table (benutzername text, xp int, bild text, stand text, anfrage_id uuid)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.benutzername,
    coalesce(s.xp, 0)::int,
    p.bild,
    case
      when f.status = 'angenommen' then 'freund'
      when f.von = auth.uid()      then 'gesendet'
      else 'wartet'
    end,
    f.id
  from freunde f
  join profile p
    on p.id = case when f.von = auth.uid() then f.an else f.von end
  left join statistik s on s.nutzer_id = p.id
  where (f.von = auth.uid() or f.an = auth.uid())
    and p.benutzername is not null
  order by
    -- Offene Anfragen an mich zuerst: Da kann ich etwas tun.
    (f.status = 'offen' and f.an = auth.uid()) desc,
    (f.status = 'angenommen') desc,
    coalesce(s.xp, 0) desc;
$$;

revoke all on function meine_freunde() from public, anon;
grant execute on function meine_freunde() to authenticated;


-- ------------------------------------------------------------
--  7. Freundschaft anfragen
-- ------------------------------------------------------------
-- Hatte die andere Seite schon angefragt, ist die Freundschaft
-- sofort geschlossen. Sonst müssten beide auf den Knopf des anderen
-- warten, und genau da bricht so etwas ab.
create or replace function freund_anfragen(name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  andere uuid;
  vorhanden freunde%rowtype;
begin
  select id into andere from profile where lower(benutzername) = lower(trim(name));
  if andere is null then return 'unbekannt'; end if;
  if andere = auth.uid() then return 'ich'; end if;

  select * into vorhanden from freunde
  where (von = auth.uid() and an = andere) or (von = andere and an = auth.uid());

  if found then
    if vorhanden.status = 'angenommen' then return 'freund'; end if;
    -- Die andere Seite hat zuerst gefragt: annehmen statt gegenfragen.
    if vorhanden.an = auth.uid() then
      update freunde set status = 'angenommen' where id = vorhanden.id;
      return 'freund';
    end if;
    return 'gesendet';   -- läuft schon, nichts zu tun
  end if;

  insert into freunde (von, an) values (auth.uid(), andere);
  return 'gesendet';
end;
$$;

revoke all on function freund_anfragen(text) from public, anon;
grant execute on function freund_anfragen(text) to authenticated;
