import React from 'react';

interface DownloadThankYouModalProps {
isOpen: boolean;
onClose: () => void;
downloadedItemName: string;
onOpenGroupChat: () => void;
}

export function DownloadThankYouModal({
isOpen,
onClose,
downloadedItemName,
onOpenGroupChat,
}: DownloadThankYouModalProps) {
if (!isOpen) {
return null;
}

const handleGroupChat = () => {
onClose();
onOpenGroupChat();
};

return ( <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">


  <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-slate-900 p-6 text-center shadow-2xl">

    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-2xl text-slate-950">
      ✓
    </div>

    <h2 className="text-2xl font-bold text-white">
      Thank You!
    </h2>

    <p className="mt-3 text-slate-300">
      Thank you for downloading
    </p>

    <p className="mt-1 font-semibold text-amber-400">
      {downloadedItemName}
    </p>

    <p className="mt-4 text-sm leading-6 text-slate-400">
      We hope Btech2 helps you learn, practise,
      conduct and perform with confidence.
    </p>

    <div className="mt-6 space-y-3">

      <button
        type="button"
        onClick={handleGroupChat}
        className="w-full rounded-xl bg-amber-500 px-4 py-3 font-bold text-slate-950 hover:bg-amber-400"
      >
        Open Band Group Chat
      </button>

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-300 hover:bg-slate-800"
      >
        Continue Learning
      </button>

    </div>

  </div>
</div>


);
}


