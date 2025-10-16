'use client';
import { createClient } from '@/lib/supabase/client';
import { Category, drill } from '@/lib/types';
import { PostgrestError } from '@supabase/supabase-js';
import {
  CircleXIcon,
  LoaderIcon,
  TagIcon,
  UsersIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Section } from './section';

export default function DrillsGrid() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [drills, setDrills] = useState<drill[]>([]);

  // Filters
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterPlayers, setFilterPlayers] = useState<number | ''>('');
  const [filterType, setFilterType] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    const supabase = createClient();

    const fetchDrills = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('drills').select(`
          id,
          name,
          type,
          premium,
          description,
          link,
          players,
          categories ( name )
        `);
      if (error) {
        setError(error);
        setDrills([]);
      } else {
        const normalized = (data ?? []).map(d => ({
          ...d,
          categories: Array.isArray(d.categories)
            ? [...new Set(d.categories.map(c => c?.name).filter(Boolean))]
            : [],
        }));
        setDrills(normalized);
        setError(null);
      }
      setLoading(false);
    };

    fetchDrills();
  }, []);

  // Build unique category options from the fetched drills
  const allCategoryOptions = useMemo(() => {
    const set = new Set<string>();
    drills.forEach(d => d.categories?.forEach(c => set.add(c)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [drills]);

  // Apply filters in real-time (client-side)
  const filteredDrills = useMemo(() => {
    return drills.filter(d => {
      const matchesSearch =
        !filterSearch ||
        d.name.toLowerCase().includes(filterSearch.toLowerCase());

      const matchesType = !filterType || d.type === filterType;

      const matchesCategories =
        filterCategories.length === 0 ||
        filterCategories.some(cat => d.categories.includes(cat as Category));

      // players filter interpreted as "max players available":
      // show drills where d.players <= filterPlayers
      const matchesPlayers =
        filterPlayers === '' ||
        (typeof filterPlayers === 'number' &&
          (d.players ?? 0) <= filterPlayers);

      return (
        matchesSearch && matchesType && matchesCategories && matchesPlayers
      );
    });
  }, [drills, filterSearch, filterType, filterCategories, filterPlayers]);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-10 gap-2">
        <LoaderIcon className="animate-spin" />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center mt-10 gap-2 text-center">
        <CircleXIcon />
        <div>
          <div className="font-medium">Error loading drills</div>
          <div className="text-red-500 text-sm">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Section>
        <div className="flex w-full gap-4 items-end">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={filterSearch}
            onChange={e => setFilterSearch(e.target.value)}
            className="shadow-sm border rounded-md w-full p-2 h-[42px] bg-background placeholder:text-foreground hover:bg-accent focus:outline-none"
          />

          {/* Toggle filter menu */}
          <button
            type="button"
            onClick={() => setShowFilters(v => !v)}
            className="px-4 py-2 h-[42px] border rounded-md shadow-sm bg-muted text-foreground flex items-center gap-1"
            aria-expanded={showFilters}
            aria-controls="filters-panel"
          >
            Filters
            <SlidersHorizontalIcon size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Filters menu */}
        {showFilters && (
          <div id="filters-panel" className="p-4 rounded-md border bg-muted">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Categories multi-select */}
              <label className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  Categories
                  <TagIcon size={16} strokeWidth={1.5} />
                </div>
                <select
                  multiple
                  value={filterCategories}
                  onChange={e => {
                    const selected = Array.from(
                      e.target.selectedOptions,
                      opt => opt.value
                    );
                    setFilterCategories(selected);
                  }}
                  className="shadow-sm border rounded-md w-full p-2 bg-background text-foreground text-sm"
                  style={{ minHeight: 90 }}
                >
                  {allCategoryOptions.map(cat => (
                    <option className="text-black" key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <span className="hidden sm:flex text-xs text-muted-foreground">
                  Hold Ctrl/Cmd to select multiple
                </span>
              </label>

              {/* Players (max) */}
              <label className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  Max players
                  <UsersIcon size={16} strokeWidth={1.5} />
                </div>
                <input
                  type="number"
                  min={1}
                  placeholder="Any"
                  value={filterPlayers}
                  onChange={e => {
                    const v = e.target.value;
                    if (v === '') return setFilterPlayers('');
                    const num = parseInt(v, 10);
                    setFilterPlayers(Number.isNaN(num) ? '' : Math.max(1, num));
                  }}
                  className="shadow-sm border rounded-md w-full p-2 h-[42px] bg-background text-foreground placeholder:text-foreground"
                />
              </label>

              {/* Type */}
              <label className="flex flex-col gap-1">
                <div className="flex items-center gap-1">Type</div>
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="shadow-sm border rounded-md w-full p-2 h-[42px] bg-background text-foreground"
                >
                  <option value="">All types</option>
                  <option value="Drill">Drill</option>
                  <option value="Play">Play</option>
                </select>
              </label>
            </div>

            {/* Optional: quick actions */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setFilterCategories([]);
                  setFilterPlayers('');
                  setFilterType('');
                }}
                className="px-3 py-2 border rounded-md text-sm"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredDrills.length > 0 ? (
            filteredDrills.map(d => (
              <li key={d.id} className="flex relative">
                <div className="z-10 absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full border border-brand2 bg-muted px-3 py-1 text-xs text-brand1 shadow">
                  <span className="text-foreground">{d.type}</span>
                </div>
                <Link
                  href={`/drills/${d.id}`}
                  className="relative flex flex-col border rounded-md shadow-sm overflow-hidden"
                >
                  <Image
                    src={`/thumbnails/${d.id}.webp`}
                    alt={`${d.name} preview`}
                    width={600}
                    height={400}
                    className="object-cover w-full h-auto"
                  />
                  <div className="absolute bottom-0 w-full bg-background/60 backdrop-blur-sm p-4 flex flex-col">
                    <h2 className="text-lg font-semibold">{d.name}</h2>
                    <p className="text-sm">{d.categories}</p>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="col-span-full text-center text-gray-500">
              No drills found
            </li>
          )}
        </ul>
      </Section>
    </>
  );
}
