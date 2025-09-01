import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

export const useUIStore = create((set, get) => ({
    modals: {
        pokemonSelector: { isOpen: false, data: null },
        teamPreview: { isOpen: false, data: null },
        battleResults: { isOpen: false, data: null },
        confirmDialog: { isOpen: false, data: null },
        pokemonDetails: { isOpen: false, data: null },
    },
    activeScreen: "home", // 'home', 'teams', 'battle',

    navigationHistory: [],
    canGoBack: false,

    openModal: (modalName, data = null) =>
        set((state) => ({
            modals: {
                ...state.modals,
                [modalName]: { isOpen: true, data },
            },
        })),

    closeModal: (modalName) =>
        set((state) => ({
            modals: {
                ...state.modals,
                [modalName]: { isOpen: false, data: null },
            },
        })),

    closeAllModals: () =>
        set((state) => {
            const closedModals = {};
            Object.keys(state.modals).forEach((modalName) => {
                closedModals[modalName] = { isOpen: false, data: null };
            });
            return { modals: closedModals };
        }),

    setActiveScreen: (screen) =>
        set((state) => ({
            activeScreen: screen,
            navigationHistory: [...state.navigationHistory, state.activeScreen],
            canGoBack: true,
        })),

    goBack: () =>
        set((state) => {
            if (state.navigationHistory.length === 0) return state;

            const previousScreen =
                state.navigationHistory[state.navigationHistory.length - 1];
            const newHistory = state.navigationHistory.slice(0, -1);

            return {
                activeScreen: previousScreen,
                navigationHistory: newHistory,
                canGoBack: newHistory.length > 0,
            };
        }),

    navigateToEditor: () =>
        set((state) => ({
            activeScreen: "editor",
            navigationHistory: [...state.navigationHistory, state.activeScreen],
            canGoBack: true,
        })),

    navigateToBattle: () =>
        set((state) => ({
            activeScreen: "battle",
            navigationHistory: [...state.navigationHistory, state.activeScreen],
            canGoBack: true,
        })),

    navigateToResults: () =>
        set((state) => ({
            activeScreen: "results",
            navigationHistory: [...state.navigationHistory, state.activeScreen],
            canGoBack: true,
        })),

    setComponentLoading: (componentName, isLoading) =>
        set((state) => ({
            componentLoading: {
                ...state.componentLoading,
                [componentName]: isLoading,
            },
        })),

    getComponentLoading: (componentName) => {
        return get().componentLoading[componentName] || false;
    },

    globalLoading: false,
    setGlobalLoading: (isLoading) => set({ globalLoading: isLoading }),

    notifications: [],

    addNotification: (notification) =>
        set((state) => {
            const newNotification = {
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                type: "info", // 'info', 'success', 'warning', 'error'
                autoClose: true,
                duration: 5000,
                ...notification,
            };

            return {
                notifications: [...state.notifications, newNotification],
            };
        }),

    removeNotification: (notificationId) =>
        set((state) => ({
            notifications: state.notifications.filter(
                (n) => n.id !== notificationId,
            ),
        })),

    clearNotifications: () => set({ notifications: [] }),

    userPreferences: {
        autoSaveDrafts: true,
        showAnimations: true,
        soundEnabled: false,
        language: "es",
    },

    updateUserPreferences: (preferences) =>
        set((state) => ({
            userPreferences: { ...state.userPreferences, ...preferences },
        })),

    appVersion: "1.0.0",
    isOnline: true,

    setOnlineStatus: (isOnline) => set({ isOnline }),

    lastError: null,
    setLastError: (error) => set({ lastError: error }),
    clearLastError: () => set({ lastError: null }),

    isModalOpen: (modalName) => {
        return get().modals[modalName]?.isOpen || false;
    },

    getModalData: (modalName) => {
        return get().modals[modalName]?.data || null;
    },

    componentLoading: {},

    reset: () =>
        set({
            modals: {
                pokemonSelector: { isOpen: false, data: null },
                teamPreview: { isOpen: false, data: null },
                battleResults: { isOpen: false, data: null },
                confirmDialog: { isOpen: false, data: null },
                pokemonDetails: { isOpen: false, data: null },
            },
            activeScreen: "home",
            navigationHistory: [],
            canGoBack: false,
            globalLoading: false,
            notifications: [],
            componentLoading: {},
        }),
}));

if (process.env.NODE_ENV === "development") {
    mountStoreDevtool("uiStore", useUIStore);
}
