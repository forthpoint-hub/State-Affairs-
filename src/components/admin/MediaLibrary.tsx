'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface MediaItem {
  id: string;
  storage_path: string;
  url: string;
  caption: string | null;
}

export default function MediaLibrary({ initialMedia }: { initialMedia: MediaItem[] }) {
  const supabase = createClient();
  const [items, setItems] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const path = `library/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('media').upload(path, file);
      if (!error) {
        const { data: pub } = supabase.storage.from('media').getPublicUrl(path);
        const { data: inserted } = await supabase
          .from('media')
          .insert({ storage_path: path, url: pub.publicUrl })
          .select('*')
          .single();
        if (inserted) setItems((prev) => [inserted as MediaItem, ...prev]);
      }
    }
    setUploading(false);
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm('Delete this image?')) return;
    await supabase.storage.from('media').remove([item.storage_path]);
    await supabase.from('media').delete().eq('id', item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard may be unavailable; ignore
    }
  }

  return (
    <div>
      <label className="block border-2 border-dashed border-line rounded-lg p-6 text-center text-sm text-muted mb-6">
        {uploading ? 'Uploading...' : 'Tap to upload images'}
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="border border-line rounded-lg overflow-hidden">
            <img src={item.url} alt="" className="w-full h-28 object-cover" />
            <div className="p-2 flex justify-between items-center">
              <button onClick={() => copyUrl(item.url)} className="text-xs underline">
                Copy URL
              </button>
              <button onClick={() => handleDelete(item)} className="text-xs text-accent">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-sm text-muted text-center">No images uploaded yet.</p>}
    </div>
  );
}
