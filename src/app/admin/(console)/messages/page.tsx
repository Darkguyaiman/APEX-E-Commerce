import { getContactMessages } from '@/lib/db';
import MessageInboxClient from '@/components/MessageInboxClient';

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div className="px-margin-mobile py-10 md:px-10">
      <div className="mb-8 border-b border-white/10 pb-8">
        <p className="font-label-caps text-xs text-primary-container tracking-widest">MESSAGES</p>
        <h1 className="mt-2 font-headline-lg text-5xl uppercase italic leading-none text-primary md:text-6xl">
          Contact Inbox
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Customer messages submitted through the contact form. Mark as read or delete when handled.
        </p>
      </div>
      <MessageInboxClient initialMessages={messages} />
    </div>
  );
}
