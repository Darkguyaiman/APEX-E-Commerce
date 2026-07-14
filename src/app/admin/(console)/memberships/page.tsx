import MembershipListTable from '@/components/MembershipListTable';
import { getMembershipApplications } from '@/lib/db';

export default async function AdminMembershipsPage() {
  const memberships = await getMembershipApplications();

  return (
    <div className="px-margin-mobile py-10 md:px-10">
      <div className="mb-8 border-b border-white/10 pb-8">
        <p className="font-label-caps text-xs text-primary-container tracking-widest">MEMBERSHIPS</p>
        <h1 className="mt-2 font-headline-lg text-5xl uppercase italic leading-none text-primary md:text-6xl">
          Club Members
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Review and audit Apex Club membership credential holders. Access telemetry info or reject applications by deleting them.
        </p>
      </div>
      <MembershipListTable initialMemberships={memberships} />
    </div>
  );
}
