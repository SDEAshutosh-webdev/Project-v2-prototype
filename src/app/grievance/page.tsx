import Link from 'next/link';

export default function GrievancePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Citizen Grievance Redressal (GRV)</h1>
      <p className="text-zinc-600 text-sm">
        This domain is isolated in <code>src/modules/grievance/</code>. It has its own SLA escalation hooks and workflow state.
      </p>
      <Link href="/property-tax/apartment" className="text-blue-600 text-sm underline">
        Back to PTIS Apartment Assessment
      </Link>
    </div>
  );
}
