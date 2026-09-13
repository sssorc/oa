import sportsbooksData from '@/data/sportsbooks.json';

const lowercaseWords = ['of'];

// "district_of_columbia" -> "District of Columbia"
export const stateName = (key) =>
    key
        .split('_')
        .map((word) => (lowercaseWords.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join(' ');

export const stateSlug = (key) => key.replace(/_/g, '-');
export const stateKey = (slug) => slug.replace(/-/g, '_');

export const states = Object.entries(sportsbooksData).map(([key, data]) => ({
    key,
    name: stateName(key),
    slug: stateSlug(key),
    path: `/sportsbooks/${stateSlug(key)}`,
    ...data,
}));

export const getState = (slug) => states.find((state) => state.slug === slug);

// "2026-05-22" -> "May 2026"
export const monthYear = (date) => new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

// "BetMGM, Caesars, and DraftKings"
export const listNames = (names) => (names.length < 3 ? names.join(' and ') : `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`);
