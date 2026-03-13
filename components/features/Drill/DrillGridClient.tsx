'use client';

import { Section } from '@/components/common/Section';
import { SlidersHorizontalIcon, TagIcon, UsersIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import DrillCard from './DrillCard';
import type { Drill } from '@/lib/types';

export default function DrillGridClient({
  initialDrills,
}: {
  initialDrills: Drill[];
}) {
  // Filters
  const [filterSearch, setFilterSearch] = useState('');
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterPlayers, setFilterPlayers] = useState<number | ''>('');
  const [filterType, setFilterType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const allCategoryOptions = useMemo(() => {
    const set = new Set<string>();
    initialDrills.forEach(d => d.categories?.forEach(c => set.add(c)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [initialDrills]);

  const filteredDrills = useMemo(() => {
    return initialDrills.filter(d => {
      const matchesSearch =
        !filterSearch ||
        d.name.toLowerCase().includes(filterSearch.toLowerCase());

      const matchesType = !filterType || d.type === filterType;

      const matchesCategories =
        filterCategories.length === 0 ||
        filterCategories.some(cat => d.categories.includes(cat));

      const matchesPlayers =
        filterPlayers === '' ||
        (typeof filterPlayers === 'number' &&
          (d.players ?? 0) <= filterPlayers);

      return (
        matchesSearch && matchesType && matchesCategories && matchesPlayers
      );
    });
  }, [
    initialDrills,
    filterSearch,
    filterType,
    filterCategories,
    filterPlayers,
  ]);

  return (
    <Section>
      <div className="flex w-full gap-4 items-end">
        <input
          type="text"
          placeholder="Search..."
          value={filterSearch}
          onChange={e => setFilterSearch(e.target.value)}
          className="shadow-sm border-2 rounded-md w-full p-2 h-[42px] bg-background placeholder:text-foreground hover:bg-accent focus:outline-none"
        />

        <button
          type="button"
          onClick={() => setShowFilters(v => !v)}
          className="px-4 py-2 h-[42px] border-2 rounded-md shadow-sm bg-muted text-foreground flex items-center gap-1"
          aria-expanded={showFilters}
          aria-controls="filters-panel"
        >
          Filters
          <SlidersHorizontalIcon size={16} strokeWidth={1.5} />
        </button>
      </div>

      {showFilters && (
        <div id="filters-panel" className="p-4 rounded-md border-2 bg-muted">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-sm">
                Categories <TagIcon size={12} strokeWidth={1} />
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
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-sm">
                Players <UsersIcon size={12} strokeWidth={1} />
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

            <label className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-sm">Type</div>
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
          filteredDrills.map(d => <DrillCard drill={d} key={d.id} />)
        ) : (
          <li className="col-span-full text-center text-gray-500">
            No drills found
          </li>
        )}
      </ul>
    </Section>
  );
}
