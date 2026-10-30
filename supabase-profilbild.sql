-- ============================================================
--  PROFILBILD  (30.10.2026)
-- ============================================================
-- Eine Spalte fuer den Pfad und ein Eimer, in dem die Bilder liegen.
--
-- Warum der Eimer oeffentlich lesbar ist: Das Bild steht in der
-- Rangliste neben dem Benutzernamen, und die sehen alle Angemeldeten.
-- Eine signierte Adresse je Zeile waere ein Aufruf pro Bild und bei
-- jedem Neuladen wieder.
--
-- Geschrieben wird dagegen streng: Jeder darf nur in dem Ordner
-- ablegen, der seine eigene Nutzerkennung traegt. Die Pfade sehen so
-- aus: <nutzer-id>/<zeitstempel>.jpg – der Zeitstempel sorgt dafuer,
-- dass der Browser nach dem Wechseln nicht tagelang das alte Bild aus
-- seinem Zwischenspeicher zeigt.
--
-- Mehrfach ausfuehrbar.

-- 1. Die Spalte -----------------------------------------------------
ALTER TABLE profile ADD COLUMN IF NOT EXISTS bild TEXT;


-- 2. Der Eimer ------------------------------------------------------
-- 2 MB reichen weit: Der Browser verkleinert vorher auf 400x400 und
-- landet damit bei rund 80 KB. Die Grenze ist nur der Riegel gegen
-- jemanden, der die Datei nicht durch unseren Code schickt.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profilbilder', 'profilbilder', true, 2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];


-- 3. Wer darf was ---------------------------------------------------
DROP POLICY IF EXISTS "Profilbilder lesen"    ON storage.objects;
DROP POLICY IF EXISTS "Profilbild ablegen"    ON storage.objects;
DROP POLICY IF EXISTS "Profilbild ersetzen"   ON storage.objects;
DROP POLICY IF EXISTS "Profilbild entfernen"  ON storage.objects;

CREATE POLICY "Profilbilder lesen" ON storage.objects
  FOR SELECT USING (bucket_id = 'profilbilder');

-- storage.foldername() liefert die Pfadteile als Array. Teil 1 ist
-- der Ordner – er muss die eigene Kennung sein.
CREATE POLICY "Profilbild ablegen" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'profilbilder'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Profilbild ersetzen" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'profilbilder'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Profilbild entfernen" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'profilbilder'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
