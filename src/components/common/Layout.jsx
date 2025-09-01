import { Header } from "@/components/common/Header";

export function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 transition-colors">
            <Header />

            <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-2">
                {children}
            </main>
        </div>
    );
}
