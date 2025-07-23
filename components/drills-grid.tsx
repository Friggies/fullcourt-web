'use client';
import { createClient } from '@/lib/supabase/client';
import { drill } from '@/lib/types';
import { PostgrestError } from '@supabase/supabase-js';
import { CircleXIcon, LoaderIcon, SearchIcon, TagIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

export default function DrillsGrid() {
  const [loading, setLoading] = useState<boolean>(true);
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [drills, setDrills] = useState<drill[]>([]);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchDrills = async () => {
      const { data, error } = await supabase.from('drills').select('*');
      if (error) {
        setError(error);
      } else {
        setDrills(data || []);
      }
      setLoading(false);
    };
    fetchDrills();
  }, []);

  const filteredDrills = useMemo(() => {
    return drills.filter(drill => {
      const matchesSearch =
        filterSearch === '' ||
        drill.name.toLowerCase().includes(filterSearch.toLowerCase());
      const matchesCategory =
        filterCategory === '' || drill.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [drills, filterSearch, filterCategory]);

  if (loading) {
    return (
      <div className="flex flex-col justify- items-center mt-10 gap-2">
        <LoaderIcon className="animate-spin" />
        Loading
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify- items-center mt-10 gap-2">
        <CircleXIcon />
        Error loading drills
        <br />
        {error.message}
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4">
        <label className="flex flex-col flex-1 gap-1">
          <div className="flex items-center gap-1">
            Search
            <SearchIcon size={16} strokeWidth={1.5} />
          </div>
          <input
            type="text"
            placeholder="Type here..."
            value={filterSearch}
            onChange={e => setFilterSearch(e.target.value)}
            className="shadow-sm border rounded-md w-full p-2 h-[42px] hover:bg-accent duration-300 cursor-pointer bg-background placeholder:text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            Category
            <TagIcon size={16} strokeWidth={1.5} />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="shadow-sm border rounded-md w-full p-2 h-[42px] hover:bg-accent duration-300 cursor-pointer bg-background text-base text-foreground"
          >
            <option value="">All</option>
            <option value="Offensive">Offensive</option>
            <option value="Warm-up">Warm-up</option>
          </select>
        </label>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredDrills.length > 0 ? (
          filteredDrills.map(drill => (
            <li key={drill.id}>
              <Link
                href={`/drills/${drill.id}`}
                className="flex flex-col border rounded-md shadow-sm overflow-hidden"
              >
                <Image
                  src={`/thumbnails/${drill.id}.webp`}
                  alt={`${drill.name} preview`}
                  width={600}
                  height={1067}
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{drill.name}</h2>
                  <p className="text-sm text-gray-500">{drill.category}</p>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <li className="col-span-full text-center text-gray-500">
            No drills found.
          </li>
        )}
      </ul>
    </>
  );
}
