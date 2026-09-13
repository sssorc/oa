import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useHead, useSeoMeta } from '@unhead/vue';

export const siteUrl = 'https://hedgecalc.com';
const siteName = 'HedgeCalc';
const defaultDescription = 'Free sports betting calculators for hedging, arbitrage, bonus bets, risk-free bets, and devigging.';
const organization = { '@type': 'Organization', name: siteName, url: `${siteUrl}/` };

export const absoluteUrl = (path) => `${siteUrl}${path}`;

/**
 * Sets title, description, canonical, social tags, and JSON-LD for a page.
 *
 * @param {string} title
 * @param {string} [description]
 * @param {object} [options]
 * @param {Array<{name: string, path: string}>} [options.breadcrumbs] Trail after Home, ending with the current page
 * @param {object|object[]} [options.schema] Extra schema.org nodes for this page
 * @param {boolean} [options.fullTitle] Use the title as-is, without the "| HedgeCalc" suffix
 */
export function usePageTitle(title, description = defaultDescription, options = {}) {
    const route = useRoute();
    // Built from the route path (no query string) so it's identical at build time and in the browser
    const canonical = computed(() => absoluteUrl(route.path));

    const schema = [].concat(options.schema || []);
    if (options.breadcrumbs?.length) {
        schema.push({
            '@type': 'BreadcrumbList',
            itemListElement: [{ name: 'Home', path: '/' }, ...options.breadcrumbs].map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.name,
                item: absoluteUrl(crumb.path),
            })),
        });
    }

    useHead({
        title,
        titleTemplate: options.fullTitle ? '%s' : `%s | ${siteName}`,
        link: [{ rel: 'canonical', href: canonical }],
        script: schema.length
            ? [
                  {
                      type: 'application/ld+json',
                      key: 'page-schema',
                      innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': schema }),
                  },
              ]
            : [],
    });

    useSeoMeta({
        description,
        ogTitle: title,
        ogDescription: description,
        ogUrl: canonical,
        ogType: 'website',
        ogSiteName: siteName,
        ogImage: absoluteUrl('/apple-touch-icon.png'),
        twitterCard: 'summary',
        twitterTitle: title,
        twitterDescription: description,
    });

    return { title };
}

// Schema for a calculator page
export function calculatorSchema(name, description, path) {
    return {
        '@type': 'WebApplication',
        name,
        description,
        url: absoluteUrl(path),
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: organization,
    };
}

// Schema for a knowledge base article
export function articleSchema(headline, description, path) {
    return {
        '@type': 'Article',
        headline,
        description,
        url: absoluteUrl(path),
        mainEntityOfPage: absoluteUrl(path),
        author: organization,
        publisher: organization,
    };
}

export { organization };
