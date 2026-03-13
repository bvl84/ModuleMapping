'use client';

interface HeaderProps {
  name: string;
  temperature: number;
  date: string;
}

export function Header({ name, temperature, date }: HeaderProps) {
  return (
    <header className="flex items-start justify-between mb-6">
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 mt-1">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 4C14 4 8 10 8 18c0 5 3 9 6 12 2 2 4 4 6 6 2-2 4-4 6-6 3-3 6-7 6-12 0-8-6-14-12-14z" fill="#4F8F73" opacity="0.3"/>
            <path d="M20 8c-4 0-8 5-8 10 0 3 2 6 4 8l4 4 4-4c2-2 4-5 4-8 0-5-4-10-8-10z" fill="#4F8F73" opacity="0.5"/>
            <path d="M20 12c-2.5 0-5 3-5 6.5 0 2 1.2 4 2.5 5.5l2.5 2.5 2.5-2.5c1.3-1.5 2.5-3.5 2.5-5.5 0-3.5-2.5-6.5-5-6.5z" fill="#4F8F73"/>
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500">Welcome,</p>
          <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-amber-500">
              <circle cx="8" cy="8" r="3" fill="currentColor"/>
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">{temperature}°</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{date}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-amber-600 overflow-hidden flex items-center justify-center text-white font-medium text-sm">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
    </header>
  );
}
