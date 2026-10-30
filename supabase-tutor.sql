-- ============================================================
--  SPRECHEN MIT DASCHA – das Tageskontingent  (30.10.2026)
--  Einspielen: Supabase → SQL Editor → einfügen → "Run"
--  Mehrfach ausführbar.
-- ============================================================
--
-- Eine Zeile je Nutzer und Tag. Mehr braucht der Tutor nicht: Das
-- Kontingent gilt pro Tag, und was gestern war, interessiert
-- niemanden mehr.
--
-- WARUM DAS NICHT OPTIONAL IST: Fehlt die Tabelle, liefert die
-- Abfrage 0 zurück, und der Server lässt jede Anfrage durch. Der
-- Tutor funktioniert dann – aber ohne jedes Limit, und jede Nachricht
-- kostet OpenAI-Geld. Ohne diese Datei ist Dascha ein offenes Fass.

create table if not exists tutor_nutzung (
  nutzer_id uuid not null references auth.users(id) on delete cascade,
  tag       date not null,
  anzahl    int  not null default 0,
  primary key (nutzer_id, tag)
);

create index if not exists idx_tutor_nutzung_tag on tutor_nutzung (tag);

alter table tutor_nutzung enable row level security;

-- Jeder sieht nur seine eigenen Zeilen. Geschrieben wird ohnehin nur
-- vom Server mit dem Dienstschlüssel, der an dieser Regel vorbeiläuft –
-- die Regel ist der Riegel dagegen, dass jemand sein eigenes
-- Kontingent im Browser zurücksetzt.
drop policy if exists "eigene_tutor_nutzung" on tutor_nutzung;
create policy "eigene_tutor_nutzung" on tutor_nutzung
  for select using (auth.uid() = nutzer_id);


-- Alte Zeilen wegräumen: Nach dreißig Tagen sagt eine Zeile nichts
-- mehr, und die Tabelle soll nicht mit jedem Nutzertag wachsen.
-- Aufrufen lässt sich das über einen Zeitplan (pg_cron) oder
-- gelegentlich von Hand.
create or replace function tutor_nutzung_aufraeumen()
returns void
language sql
security definer
set search_path = public
as $$
  delete from tutor_nutzung where tag < current_date - 30;
$$;
