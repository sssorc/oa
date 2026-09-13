import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useTheme() {
    // Start as 'system' so the prerendered HTML matches the first client render;
    // the stored preference is applied after hydration. The inline script in
    // index.html sets the `dark` class before paint to avoid a flash.
    const theme = ref('system');

    const setTheme = (newTheme) => {
        theme.value = newTheme;
        localStorage.theme = newTheme;

        // Update the document class
        if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Watch for system theme changes
    let mediaQuery;
    const onSystemChange = () => {
        if (theme.value === 'system') {
            setTheme('system');
        }
    };

    onMounted(() => {
        setTheme(localStorage.theme || 'system');
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', onSystemChange);
    });

    onBeforeUnmount(() => {
        mediaQuery?.removeEventListener('change', onSystemChange);
    });

    return {
        theme,
        setTheme,
    };
}
