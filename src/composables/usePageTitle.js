import { useHead } from '@vueuse/head';

export function usePageTitle(title) {
    const siteName = 'sports betting tools';
    const fullTitle = title ? `${title} - ${siteName}` : siteName;

    console.log('Setting page title to:', fullTitle); // Debug log

    useHead({
        title: fullTitle,
        meta: [
            {
                name: 'title',
                content: fullTitle,
            },
        ],
    });

    return {
        title: fullTitle,
    };
}
