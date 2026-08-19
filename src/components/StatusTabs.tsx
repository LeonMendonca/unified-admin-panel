export default function StatusTabs({
  active,
  onChange,
  counts,
}: {
  active: 'Registered' | 'Pending' | 'Disabled';
  onChange: (s: 'Registered' | 'Pending' | 'Disabled') => void;
  counts: { Registered: number; Pending: number; Disabled: number };
}) {
  const tabs: ('Registered' | 'Pending' | 'Disabled')[] = ['Registered', 'Pending', 'Disabled'];
  return (
    <div className="flex items-center gap-6 border-b border-gray-200">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`flex items-center gap-2 pb-2.5 text-sm font-medium border-b-2 transition-colors ${
            active === t ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t}
          <span className={`text-xs rounded-full px-1.5 py-0.5 ${active === t ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
            {counts[t]}
          </span>
        </button>
      ))}
    </div>
  );
}
