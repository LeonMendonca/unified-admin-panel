import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function RowActionsMenu({
  onEdit,
  onToggleDisabled,
  disabled,
}: {
  onEdit: () => void;
  onToggleDisabled: () => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button onClick={() => setOpen((v) => !v)} className="p-1 rounded hover:bg-gray-100 text-gray-500">
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1">
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => { setOpen(false); onToggleDisabled(); }}
            className="w-full text-left px-3 py-1.5 text-sm text-rose-600 hover:bg-gray-50"
          >
            {disabled ? 'Activate' : 'Deactivate'}
          </button>
        </div>
      )}
    </div>
  );
}
