import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 minutes
                        gcTime: 1000 * 60 * 30, // 30 minutes
                        retry: 2,
                        retryDelay: (attemptIndex) =>
                            Math.min(1000 * 2 ** attemptIndex, 30000),
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: false,
                        networkMode: "online",
                    },
                    mutations: {
                        retry: 1,
                        networkMode: "online",
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
