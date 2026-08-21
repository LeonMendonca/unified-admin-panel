import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Accordion({ title, action, children, defaultOpen = true }: { title: string; action?: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="w-full flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
        </div>
        <button onClick={() => setOpen((v) => !v)} className="p-1 -mr-1">
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
      </div>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
