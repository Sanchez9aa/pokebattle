import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { QueryProvider } from "@/app/QueryProvider";
import { ErrorBoundaryWithStore } from "@/components/common/ErrorBoundary";
import { Layout } from "@/components/common/Layout";

const TeamsPage = lazy(() => import("@/features/teams/components/TeamsPage"));
const TeamEditorPage = lazy(
    () => import("@/features/teams/components/TeamEditorPage/TeamEditorPage"),
);
const BattlePage = lazy(
    () => import("@/features/battle/components/BattlePage"),
);

function App() {
    return (
            <QueryProvider>
                <Router>
                    <Layout>
                        <Suspense
                            fallback={
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            }
                        >
                            <Routes>
                                <Route path="/" element={<TeamsPage />} />
                                <Route
                                    path="/team/new"
                                    element={<TeamEditorPage />}
                                />
                                <Route
                                    path="/team/edit/:id"
                                    element={<TeamEditorPage />}
                                />
                                <Route
                                    path="/battle"
                                    element={<BattlePage />}
                                />
                            </Routes>
                        </Suspense>
                    </Layout>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: "#363636",
                                color: "#fff",
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: "#10b981",
                                    secondary: "#fff",
                                },
                            },
                            error: {
                                duration: 5000,
                                iconTheme: {
                                    primary: "#ef4444",
                                    secondary: "#fff",
                                },
                            },
                        }}
                    />
                </Router>
            </QueryProvider>
    );
}

export default App;
