import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: '대시보드', icon: '📊' },
    { path: '/buy', label: '매수 계산', icon: '📈' },
    { path: '/sell-by-shares', label: '매도-주수', icon: '📉' },
    { path: '/sell-by-amount', label: '매도-금액', icon: '💰' },
    { path: '/portfolio', label: '포트폴리오', icon: '💼' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📈</span>
            <h1 className="text-xl font-bold text-gray-900">주식 계산기</h1>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            to="/settings"
            className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg"
          >
            ⚙️
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden border-t border-gray-200 pb-3">
          <div className="flex overflow-x-auto gap-2 py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
