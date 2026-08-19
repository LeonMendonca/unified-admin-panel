import type { ReactNode } from 'react';

export function Badge({ children, tone = 'gray' }: { children: ReactNode; tone?: 'gray' | 'green' | 'yellow' | 'red' | 'blue' | 'purple' }) {
  const tones: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-700 ring-gray-300',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-300',
    yellow: 'bg-amber-50 text-amber-700 ring-amber-300',
    red: 'bg-rose-50 text-rose-700 ring-rose-300',
    blue: 'bg-blue-50 text-blue-700 ring-blue-300',
    purple: 'bg-purple-50 text-purple-700 ring-purple-300',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function statusTone(status: string): 'green' | 'yellow' | 'red' | 'gray' | 'blue' {
  switch (status) {
    case 'Registered':
    case 'Active':
    case 'Approved':
    case 'Public':
    case 'Sent':
      return 'green';
    case 'Pending':
    case 'Pending review':
    case 'Sending':
      return 'yellow';
    case 'Disabled':
    case 'Suspended':
    case 'Rejected':
    case 'Archived':
    case 'Failed':
      return 'red';
    case 'Draft':
    case 'Not requested':
      return 'gray';
    default:
      return 'blue';
  }
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-gray-800">{children}</h3>
      {action}
    </div>
  );
}

export function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="border-b border-gray-200 flex gap-6 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`whitespace-nowrap py-2.5 text-sm font-medium border-b-2 transition-colors ${
            active === t
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
            {headers.map((h) => (
              <th key={h} className="py-2 px-3 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
}) {
  const variants: Record<string, string> = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };
  const sizes: Record<string, string> = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-sm',
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-md font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Avatar({ name, src }: { name: string; src?: string }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  if (src) {
    return <img src={src} alt={name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />;
  }
  return (
    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-sm">
      {initials}
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return <div className="text-sm text-gray-400 text-center py-8">{label}</div>;
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`rounded-full transition-colors relative shrink-0 ${checked ? 'bg-purple-600' : 'bg-gray-200'}`}
      style={{ width: '40px', height: '22px', flexShrink: 0 }}
    >
      <span
        className="absolute rounded-full bg-white transition-transform"
        style={{ width: '16px', height: '16px', top: '3px', left: '3px', transform: checked ? 'translateX(18px)' : 'translateX(0)' }}
      />
    </button>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
