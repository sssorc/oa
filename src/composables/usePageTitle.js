import { useHead, useSeoMeta } from '@unhead/vue';

const defaultDescription = 'Free sports betting calculators for arbitrage, bonus bets, risk-free bets, and devigging.';
const siteUrl = 'https://hedgecalc.com';

export function usePageTitle(title, description = defaultDescription) {
    const siteName = 'HedgeCalc';
    const fullTitle = title ? `${title}` : 'HedgeCalc Betting Tools';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : siteUrl;

    // Set title with template
    useHead({
        title: fullTitle,
        titleTemplate: '%s | HedgeCalc',
    });

    // Set SEO meta tags
    useSeoMeta({
        title: fullTitle,
        description: description,
        ogTitle: fullTitle,
        ogDescription: description,
        ogUrl: currentUrl,
        ogType: 'website',
        ogSiteName: siteName,
        twitterCard: 'summary_large_image',
        twitterTitle: fullTitle,
        twitterDescription: description,
        robots: 'index, follow',
        keywords: 'sports betting, calculator, arbitrage, hedge, hedging, bonus bets, free bets, risk-free bets, devigging, devigger, devig',
    });

    return {
        title: fullTitle,
    };
}
