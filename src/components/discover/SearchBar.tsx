"use client";

import { useEffect, useState } from "react";

interface Props {
  initial?: string;
  onSearch: (val: string) => void;
}

export default function SearchBar({ initial = "", onSearch }: Props) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const id = setTimeout(() => {
      onSearch(value.trim());
    }, 400); // 400ms debounce
    return () => clearTimeout(id);
  }, [value, onSearch]);

  return (
    <div className="w-full">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search classics, authors, languages..."
        className="w-full rounded-lg p-3 bg-zinc-800 border border-zinc-700 text-white placeholder:zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-300"
      />
    </div>
  );
}
