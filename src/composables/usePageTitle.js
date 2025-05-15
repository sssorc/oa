import { useHead } from '@vueuse/head';

export function usePageTitle(title) {
    const siteName = 'HedgeCalc';
    const fullTitle = title ? `${title} - ${siteName}` : siteName;

    console.log('Setting page title to:', fullTitle); // Debug log

    useHead({
        title: fullTitle,
        meta: [
            {
                name: 'title',
                content: fullTitle,
            },
            {
                name: 'description',
                content: 'Free sports betting calculators for arbitrage, bonus bets, risk-free bets, and devigging.',
            },
        ],
    });

    return {
        title: fullTitle,
    };
}
