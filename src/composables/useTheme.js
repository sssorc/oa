import { ref, watch } from 'vue';
import { trackThemeChange } from '@/utils/analytics';

export function useTheme() {
    const theme = ref(localStorage.theme || 'system');

    const setTheme = (newTheme) => {
        theme.value = newTheme;
        localStorage.theme = newTheme;
        trackThemeChange(newTheme);

        // Update the document class
        if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Initialize theme
    setTheme(theme.value);

    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        if (theme.value === 'system') {
            setTheme('system');
        }
    });

    return {
        theme,
        setTheme,
    };
}
