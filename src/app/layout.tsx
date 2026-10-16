import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/shared/providers/QueryProvider';
import Link from 'next/link';
import { Building2, Droplets, FileWarning, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'NTIS 2.0 - Municipal Enterprise Platform',
  description: 'Property Tax, Water Bill, Asset Management & Grievance ERP',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900 min-h-screen antialiased flex flex-col">
        <QueryProvider>
          <header className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                N
              </div>
              <div>
                <span className="font-bold text-zinc-900 tracking-tight">NTIS 2.0</span>
                <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-800 rounded font-semibold uppercase">
                  SSR + Clean Architecture
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-1 text-sm font-medium">
              <Link
                href="/property-tax/apartment"
                className="px-3 py-1.5 rounded-md hover:bg-zinc-100 flex items-center gap-1.5 text-blue-700 bg-blue-50"
              >
                <Building2 className="w-4 h-4" /> PTIS
              </Link>
              <Link
                href="/water-bill"
                className="px-3 py-1.5 rounded-md hover:bg-zinc-100 flex items-center gap-1.5 text-zinc-600"
              >
                <Droplets className="w-4 h-4" /> WTIS
              </Link>
              <Link
                href="/grievance"
                className="px-3 py-1.5 rounded-md hover:bg-zinc-100 flex items-center gap-1.5 text-zinc-600"
              >
                <FileWarning className="w-4 h-4" /> Grievance
              </Link>
            </nav>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Single Deployment (Tenant: ULB-101)
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
