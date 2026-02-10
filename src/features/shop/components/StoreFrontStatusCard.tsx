
import {
  CheckCircle2,
  MapPin,
  PackageCheck,
  Eye,
  Share2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const StorefrontStatusCard = () => {
  const router = useRouter()
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm w-full">
      {/* Header: Focused on the "Now" */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <h2 className="text-sm font-bold text-slate-700">Live Storefront Status</h2>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Online</span>
        </div>
      </div>

      <div className="flex-1 p-3 lg:p-5">
        {/* The "Truth" Section - Is the data okay? */}
        <div className="mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-slate-100 p-1">
              <MapPin size={14} className="text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Location Verified</p>
              <p className="text-xs text-slate-500">Your shop is correctly pinned on the local discovery map.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-slate-100 p-1">
              <PackageCheck size={14} className="text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Catalog Health</p>
              <p className="text-xs text-slate-500">All products have the required info to be shown to customers.</p>
            </div>
          </div>
        </div>

        {/* Visibility Audit - Genuine info, no jargon */}
        <div className="rounded-lg bg-blue-50/50 p-3 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-800 mb-1">
            <CheckCircle2 size={14} />
            <span className="text-xs font-bold">Search Ready</span>
          </div>
          <p className="text-[11px] text-blue-700 leading-relaxed">
            Customers can currently find you when searching for products in your area.
          </p>
        </div>
      </div>

      {/* Primary Actions: Actual Utility */}
      <div className="mt-auto border-t border-slate-100 p-3 space-y-2">
        <button
          onClick={() => router.push('/')}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-600 active:scale-[0.98]">
          <Eye size={14} />
          Preview as Customer
        </button>

        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          <Share2 size={14} />
          Share Shop Link
        </button>
      </div>
    </div>
  );
};

export default StorefrontStatusCard;