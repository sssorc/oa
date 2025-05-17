import { useHead } from '@vueuse/head';

const defaultDescription = 'Free sports betting calculators for arbitrage, bonus bets, risk-free bets, and devigging.';
const siteUrl = 'https://hedgecalc.com';

export function usePageTitle(title, description = defaultDescription) {
    const siteName = 'HedgeCalc';
    const fullTitle = title ? `${title} - ${siteName}` : siteName;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : siteUrl;

    console.log('Setting page title to:', fullTitle); // Debug log

    useHead({
        title: fullTitle,
        meta: [
            // Basic meta tags
            {
                name: 'title',
                content: fullTitle,
            },
            {
                name: 'description',
                content: description,
            },
            // Open Graph tags
            {
                property: 'og:title',
                content: fullTitle,
            },
            {
                property: 'og:description',
                content: description,
            },
            {
                property: 'og:url',
                content: currentUrl,
            },
            {
                property: 'og:type',
                content: 'website',
            },
            {
                property: 'og:site_name',
                content: siteName,
            },
            // Twitter Card tags
            {
                name: 'twitter:card',
                content: 'summary_large_image',
            },
            {
                name: 'twitter:title',
                content: fullTitle,
            },
            {
                name: 'twitter:description',
                content: description,
            },
            // Additional SEO meta tags
            {
                name: 'robots',
                content: 'index, follow',
            },
            {
                name: 'keywords',
                content: 'sports betting, calculator, arbitrage, hedge, hedging, bonus bets, free bets, risk-free bets, devigging, devigger, devig',
            },
        ],
    });

    return {
        title: fullTitle,
    };
}
