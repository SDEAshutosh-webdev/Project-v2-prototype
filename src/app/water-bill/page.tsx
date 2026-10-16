import Link from 'next/link';

export default function WaterBillPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Water Tax Information System (WTIS)</h1>
      <p className="text-zinc-600 text-sm">
        This domain is isolated in <code>src/modules/water-bill/</code>. It follows the exact same 4-layer clean architecture (domain, infrastructure, application, presentation) without coupling to PTIS.
      </p>
      <Link href="/property-tax/apartment" className="text-blue-600 text-sm underline">
        Back to PTIS Apartment Assessment
      </Link>
    </div>
  );
}
