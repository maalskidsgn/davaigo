-- ============================================================
--  EIN TEIL VON ki_nutzung, OHNE DEN REST ZU VERLIEREN
--  (30.10.2026) · Einspielen: Supabase → SQL Editor → Run
--  Mehrfach ausführbar.
-- ============================================================
--
-- Das Problem: Drei Stellen in der App legen etwas in der
-- JSON-Spalte statistik.ki_nutzung ab.
--
--   sync.js       → verlauf           (Kalender und Lernkurve)
--   geraeteSync.js→ geraete           (Einstellungen, Bücher, Belohnt-Listen)
--   videoSync.js  → gemerkte_videos   (die YouTube-Mediathek)
--
-- Alle drei lasen bisher die ganze Spalte, änderten ihren Teil und
-- schrieben das ganze Objekt zurück. Laufen zwei davon dicht
-- hintereinander – und geraeteSync läuft jede Minute –, dann
-- schreibt der Zweite den Stand zurück, den er VOR der ersten
-- Änderung gelesen hat. Der Teil des Ersten ist dann weg.
--
-- In der Praxis heißt das: ein Tag Lernverlauf fehlt, oder ein
-- gemerktes Video kommt nicht auf dem zweiten Gerät an. Still, ohne
-- Fehlermeldung, und kaum nachzuvollziehen.
--
-- Diese Funktion ändert NUR den genannten Schlüssel, in einer
-- einzigen Anweisung. Was die anderen beiden dort abgelegt haben,
-- bleibt unberührt – auch wenn sie im selben Moment schreiben.

create or replace function ki_nutzung_setzen(schluessel text, wert jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  ergebnis jsonb;
begin
  -- Ohne Anmeldung gibt es nichts zu schreiben. Ohne diese Zeile
  -- liefe der insert mit nutzer_id = NULL los und bräche mit einem
  -- Datenbankfehler ab, den niemand deuten kann.
  if auth.uid() is null then
    raise exception 'Nicht angemeldet.';
  end if;

  -- Nur erlaubte Schlüssel. Ohne diese Prüfung könnte ein
  -- veränderter Client beliebige Felder in die Spalte schreiben.
  if schluessel not in ('verlauf', 'geraete', 'gemerkte_videos', 'videos_geloescht') then
    raise exception 'Unbekannter Schluessel: %', schluessel;
  end if;

  -- Die Zeile anlegen, falls es sie noch nicht gibt.
  insert into statistik (nutzer_id, ki_nutzung)
  values (auth.uid(), jsonb_build_object(schluessel, wert))
  on conflict (nutzer_id) do update
    set ki_nutzung = jsonb_set(
          coalesce(statistik.ki_nutzung, '{}'::jsonb),
          array[schluessel],
          wert,
          true
        )
  returning ki_nutzung into ergebnis;

  return ergebnis;
end;
$$;

revoke all on function ki_nutzung_setzen(text, jsonb) from public, anon;
grant execute on function ki_nutzung_setzen(text, jsonb) to authenticated;
