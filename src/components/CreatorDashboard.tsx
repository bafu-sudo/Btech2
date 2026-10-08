import React from 'react';

interface CreatorDashboardProps {
isOpen: boolean;
onClose: () => void;
}

export function CreatorDashboard({
isOpen,
onClose,
}: CreatorDashboardProps) {
if (!isOpen) {
return null;
}

return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"> <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">


    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-bold text-amber-400">
        Creator Dashboard
      </h2>

      <button
        type="button"
        onClick={onClose}
        className="rounded-lg px-3 py-1 text-slate-400 hover:bg-slate-800 hover:text-white"
      >
        X
      </button>
    </div>

    <div className="space-y-4">

      <div className="rounded-xl bg-slate-800 p-4">
        <p className="text-sm text-slate-400">
          Creator
        </p>

        <p className="font-semibold text-white">
          Nokuvimba Bafu
        </p>
      </div>

      <div className="rounded-xl bg-slate-800 p-4">
        <p className="text-sm text-slate-400">
          Project
        </p>

        <p className="font-semibold text-amber-300">
          Btech2
        </p>
      </div>

      <p className="text-sm leading-6 text-slate-400">
        Creator analytics and management tools will appear here.
      </p>

    </div>

    <button
      type="button"
      onClick={onClose}
      className="mt-6 w-full rounded-xl bg-amber-500 px-4 py-3 font-bold text-slate-950 hover:bg-amber-400"
    >
      Close
    </button>

  </div>
</div>


);
}

