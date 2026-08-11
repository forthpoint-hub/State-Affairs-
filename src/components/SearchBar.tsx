'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className="flex gap-2"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search articles, authors, topics..."
        className="flex-1 border border-line rounded-md px-4 py-3 text-base focus:outline-none focus:border-accent"
        autoFocus
      />
      <button
        type="submit"
        className="bg-ink text-paper px-5 rounded-md text-sm font-medium"
      >
        Search
      </button>
    </form>
  );
}
