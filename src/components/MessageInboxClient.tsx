'use client';

import React, { useState } from 'react';
import type { ContactMessage } from '@/lib/db';

function timeAgo(dateStr?: string) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function MessageInboxClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const unreadCount = messages.filter(m => !m.is_read).length;

  const handleMarkRead = async (id: number) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        credentials: 'include'
      });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
      if (selected?.id === id) {
        setSelected(prev => prev ? { ...prev, is_read: true } : null);
      }
    } catch (e) {
      console.error('Failed to mark message read:', e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this message permanently?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      console.error('Failed to delete message:', e);
    } finally {
      setDeleting(null);
    }
  };

  const handleSelect = (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.is_read) {
      handleMarkRead(msg.id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-0 border border-white/10 min-h-[500px]">
      {/* Message List */}
      <div className="border-r border-white/10 bg-surface-container-low/20 overflow-y-auto max-h-[70vh]">
        {/* Header bar */}
        <div className="sticky top-0 bg-surface-container-low/80 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center justify-between z-10">
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest">
            {messages.length} MESSAGE{messages.length !== 1 ? 'S' : ''}
          </span>
          {unreadCount > 0 && (
            <span className="bg-primary-container text-black font-label-caps text-[9px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} NEW
            </span>
          )}
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3">inbox</span>
            <p className="font-label-caps text-xs text-on-surface-variant/50">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => handleSelect(msg)}
              className={`w-full text-left px-4 py-4 border-b border-white/5 transition-colors cursor-pointer ${
                selected?.id === msg.id
                  ? 'bg-primary-container/10 border-l-2 border-l-primary-container'
                  : 'hover:bg-white/5'
              } ${!msg.is_read ? 'bg-white/[0.02]' : ''}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {!msg.is_read && (
                    <div className="w-2 h-2 rounded-full bg-primary-container shrink-0"></div>
                  )}
                  <span className={`font-headline-md text-sm uppercase truncate ${!msg.is_read ? 'text-primary' : 'text-on-surface-variant/70'}`}>
                    {msg.name}
                  </span>
                </div>
                <span className="font-label-caps text-[8px] text-on-surface-variant/40 tracking-widest shrink-0">
                  {timeAgo(msg.created_at)}
                </span>
              </div>
              <p className={`text-xs truncate ${!msg.is_read ? 'text-primary/80 font-semibold' : 'text-on-surface-variant/50'}`}>
                {msg.subject}
              </p>
              <p className="text-[11px] text-on-surface-variant/40 truncate mt-0.5">
                {msg.message}
              </p>
            </button>
          ))
        )}
      </div>

      {/* Message Detail */}
      <div className="bg-surface-container-low/10 overflow-y-auto max-h-[70vh]">
        {selected ? (
          <div className="p-6 md:p-8">
            {/* Detail header */}
            <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-white/10">
              <div>
                <h2 className="font-headline-md text-2xl uppercase italic text-primary leading-none">
                  {selected.subject}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-label-caps text-[10px] text-on-surface-variant/60 tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">person</span>
                    {selected.name}
                  </span>
                  <span className="font-label-caps text-[10px] text-on-surface-variant/60 tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">mail</span>
                    {selected.email}
                  </span>
                  <span className="font-label-caps text-[10px] text-on-surface-variant/40 tracking-widest">
                    {selected.created_at ? new Date(selected.created_at).toLocaleString() : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!selected.is_read && (
                  <button
                    onClick={() => handleMarkRead(selected.id)}
                    className="flex items-center gap-1.5 border border-white/10 px-3 py-2 font-label-caps text-[9px] text-on-surface-variant hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">mark_email_read</span>
                    MARK READ
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selected.id)}
                  disabled={deleting === selected.id}
                  className="flex items-center gap-1.5 border border-red-500/30 px-3 py-2 font-label-caps text-[9px] text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  DELETE
                </button>
              </div>
            </div>

            {/* Message body */}
            <div className="font-body-md text-sm text-on-surface-variant/90 leading-relaxed whitespace-pre-wrap">
              {selected.message}
            </div>

            {/* Quick reply link */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="inline-flex items-center gap-2 bg-primary-container text-black px-6 py-3 font-label-caps text-[10px] font-bold transition-all hover:brightness-110 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">reply</span>
                REPLY VIA EMAIL
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4">mark_email_unread</span>
            <p className="font-headline-md text-xl uppercase italic text-on-surface-variant/30">Select a message</p>
            <p className="font-body-md text-xs text-on-surface-variant/30 mt-2">
              Click on a message from the list to view its contents
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
