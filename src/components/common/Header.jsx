import { Link, useLocation } from "react-router-dom";

export function Header() {
    const location = useLocation();

    const navigationItems = [
        { key: "teams", label: "Equipos", path: "/" },
        { key: "editor", label: "Nuevo Equipo", path: "/team/new" },
        { key: "battle", label: "Combate", path: "/battle" },
    ];

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white rounded-md px-2 py-1"
                            aria-label="Ir a inicio - Pokémon Battle"
                        >
                            Pokémon Battle
                        </Link>
                    </div>

                    <nav
                        className="hidden md:block"
                        aria-label="Navegación principal"
                    >
                        <ul className="flex space-x-1">
                            {navigationItems.map((item) => (
                                <li key={item.key}>
                                    <Link
                                        to={item.path}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white ${
                                            isActive(item.path)
                                                ? "bg-primary-50 text-primary-700 shadow-sm border border-primary-200"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                        aria-current={
                                            isActive(item.path)
                                                ? "page"
                                                : undefined
                                        }
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav className="md:hidden" aria-label="Navegación móvil">
                        <select
                            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                            value={location.pathname}
                            onChange={(e) => {
                                window.location.href = e.target.value;
                            }}
                            aria-label="Seleccionar página"
                        >
                            {navigationItems.map((item) => (
                                <option key={item.key} value={item.path}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </nav>
                </div>
            </div>
        </header>
    );
}
