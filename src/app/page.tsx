import Link from 'next/link';
import { Building2, Droplets, FileWarning, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-extrabold text-zinc-900">NTIS 2.0 Enterprise Architecture Prototype</h1>
        <p className="text-zinc-600 max-w-2xl mx-auto text-sm">
          Demonstration of Next.js 15 App Router Server-Side Rendering (SSR) + TanStack Hydration with Clean Vertical Slices and Table Virtualization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-zinc-900">Property Tax (PTIS)</h3>
            <p className="text-xs text-zinc-500">
              Apartment assessment register featuring SSR prefetch, HydrationBoundary, and 60 FPS row virtualization.
            </p>
          </div>
          <Link
            href="/property-tax/apartment"
            className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            Launch PTIS Workbench <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between opacity-80">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-zinc-900">Water Tax (WTIS)</h3>
            <p className="text-xs text-zinc-500">
              Consumer meter billing, slab tariff workbench, and tap size master domain slice.
            </p>
          </div>
          <Link
            href="/water-bill"
            className="mt-6 inline-flex items-center text-sm font-semibold text-cyan-600 hover:text-cyan-800"
          >
            View Module <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between opacity-80">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <FileWarning className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-zinc-900">Grievance & SLAs</h3>
            <p className="text-xs text-zinc-500">
              Citizen complaint tracking, departmental routing, and escalation ladders.
            </p>
          </div>
          <Link
            href="/grievance"
            className="mt-6 inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-800"
          >
            View Module <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
