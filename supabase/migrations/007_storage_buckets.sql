-- Créer les buckets pour les ressources des créateurs

-- Bucket pour les vignettes (carrées)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resource-previews', 'resource-previews', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour les images principales (3:5)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resource-images', 'resource-images', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour les galeries
INSERT INTO storage.buckets (id, name, public)
VALUES ('resource-gallery', 'resource-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Policies pour permettre aux créateurs approuvés d'uploader

-- resource-previews
CREATE POLICY "Creators can upload previews"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resource-previews'
  AND auth.uid() IN (SELECT user_id FROM creators WHERE is_approved = true)
);

CREATE POLICY "Public can view previews"
ON storage.objects FOR SELECT
USING (bucket_id = 'resource-previews');

CREATE POLICY "Creators can update own previews"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resource-previews'
  AND auth.uid() IN (SELECT user_id FROM creators WHERE is_approved = true)
);

CREATE POLICY "Creators can delete own previews"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resource-previews'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- resource-images
CREATE POLICY "Creators can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resource-images'
  AND auth.uid() IN (SELECT user_id FROM creators WHERE is_approved = true)
);

CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'resource-images');

CREATE POLICY "Creators can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resource-images'
  AND auth.uid() IN (SELECT user_id FROM creators WHERE is_approved = true)
);

CREATE POLICY "Creators can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resource-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- resource-gallery
CREATE POLICY "Creators can upload gallery"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resource-gallery'
  AND auth.uid() IN (SELECT user_id FROM creators WHERE is_approved = true)
);

CREATE POLICY "Public can view gallery"
ON storage.objects FOR SELECT
USING (bucket_id = 'resource-gallery');

CREATE POLICY "Creators can update own gallery"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resource-gallery'
  AND auth.uid() IN (SELECT user_id FROM creators WHERE is_approved = true)
);

CREATE POLICY "Creators can delete own gallery"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resource-gallery'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
