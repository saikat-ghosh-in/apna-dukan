import { useEffect } from "react";
import { MdClose, MdWarning } from "react-icons/md";

export const DeleteModal = ({ open, setOpen, title, onDeleteHandler, loader }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !loader && setOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 z-10">
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          disabled={loader}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors"
        >
          <MdClose size={20} />
        </button>

        {/* Icon + title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 shrink-0">
            <MdWarning size={20} className="text-red-500" />
          </div>
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>

        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Are you sure you want to delete this? This action is{" "}
          <span className="font-semibold text-red-500">permanent and irreversible</span>.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setOpen(false)}
            disabled={loader}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onDeleteHandler}
            disabled={loader}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 active:scale-[0.98] rounded-xl transition-all disabled:opacity-50"
          >
            {loader ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Deleting...
              </span>
            ) : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};