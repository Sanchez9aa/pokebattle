import { useEffect } from "react";

export const useInfiniteScroll = (
    loadMore,
    hasMore,
    loadingMore,
    isLoadingDebounced,
) => {
    useEffect(() => {
        let scrollTimeout;

        const handleScroll = () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            scrollTimeout = setTimeout(() => {
                const container = document.querySelector(
                    ".pokemon-list-container",
                );
                if (container && !isLoadingDebounced) {
                    const scrollTop = container.scrollTop;
                    const scrollHeight = container.scrollHeight;
                    const clientHeight = container.clientHeight;

                    if (
                        scrollTop + clientHeight >= scrollHeight - 200 &&
                        !loadingMore &&
                        hasMore
                    ) {
                        loadMore();
                    }
                }
            }, 150); // Throttle scroll events
        };

        const container = document.querySelector(".pokemon-list-container");
        if (container) {
            container.addEventListener("scroll", handleScroll, {
                passive: true,
            });
            return () => {
                container.removeEventListener("scroll", handleScroll);
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
            };
        }
    }, [loadMore, hasMore, loadingMore, isLoadingDebounced]);
};
