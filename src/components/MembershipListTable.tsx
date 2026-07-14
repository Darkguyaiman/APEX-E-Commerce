'use client';

import React, { useState } from 'react';
import { MembershipApplication } from '@/lib/db';

interface MembershipListTableProps {
  initialMemberships: MembershipApplication[];
}

export default function MembershipListTable({ initialMemberships }: MembershipListTableProps) {
  const [memberships, setMemberships] = useState(initialMemberships);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the membership application for "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/membership/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not delete membership');
      }

      setMemberships(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      alert(err.message || 'Could not delete membership');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMemberships = memberships.filter(m => {
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.member_id.toLowerCase().includes(q) ||
      m.position.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Filter Toolbar */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full max-w-xs">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface-container border border-white/10 pl-11 pr-4 py-2.5 text-xs font-label-caps tracking-widest text-primary placeholder-on-surface-variant/30 focus:border-primary-container focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-white/10 bg-surface-container-low">
        <table className="w-full border-collapse text-left text-sm text-on-surface">
          <thead>
            <tr className="border-b border-white/10 bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Cleat Size</th>
              <th className="px-6 py-4">Member ID</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredMemberships.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant">
                  No membership applications found.
                </td>
              </tr>
            ) : (
              filteredMemberships.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant/50">
                    {m.id}
                  </td>
                  <td className="px-6 py-4">
                    <span className="block font-headline-md text-xl uppercase italic leading-none text-primary">
                      {m.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant font-mono">
                    {m.email}
                  </td>
                  <td className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant">
                    {m.position}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-primary-container">
                    US {m.size}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-primary-container">
                    {m.member_id}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      disabled={deletingId === m.id}
                      onClick={() => handleDelete(m.id, m.name)}
                      className="inline-flex items-center justify-center border border-secondary-container p-2 text-secondary transition-colors hover:bg-secondary/10 disabled:opacity-50 cursor-pointer"
                      title={deletingId === m.id ? 'Deleting...' : 'Delete Application'}
                    >
                      <span className="material-symbols-outlined text-sm block">delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
