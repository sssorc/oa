export default {
    namespaced: true,
    state: {
        theme: localStorage.theme || 'system',
    },
    mutations: {
        setTheme(state, theme) {
            state.theme = theme;
            localStorage.theme = theme;

            // Update the document class
            if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
    },
    actions: {
        initTheme({ commit }) {
            const theme = localStorage.theme || 'system';
            commit('setTheme', theme);

            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (localStorage.theme === 'system') {
                    commit('setTheme', 'system');
                }
            });
        },
    },
};
