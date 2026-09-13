<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';
import BackButton from '@/components/ui/BackButton.vue';
import { usePageTitle, absoluteUrl } from '@/composables/usePageTitle';
import { getState, monthYear, listNames } from '@/utils/states';

const route = useRoute();
const router = useRouter();

// Pages are rendered one per state, so this doesn't need to react to route changes
const state = getState(route.params.state);
const name = state?.name ?? '';
const active = state?.active ?? [];
const inactive = state?.inactive ?? [];
const updated = state ? monthYear(state.updatedAt) : '';
const count = active.length;

function formatUpdatedAt(date) {
    // Fixed locale and time zone so the prerendered date matches hydration in every browser
    return new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' });
}

function formatDate(date) {
    if (date.length === 4) {
        return date; // Just return the year if it's in YYYY format
    }
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });
}

// Redirect if state data doesn't exist
onMounted(() => {
    if (!state) {
        router.push('/sportsbooks');
    }
});

const title = state?.legal ? `Legal ${name} Sportsbooks (${updated})` : `Is Sports Betting Legal in ${name}?`;
const description = state?.legal
    ? `${name} has ${count} legal online sportsbooks and betting apps, including ${listNames(active.slice(0, 3).map((book) => book.name))}. See the full list and which books have left. Updated ${updated}.`
    : `Online sports betting is not legal in ${name} as of ${updated}. See which states have legal sportsbooks and which betting apps operate there.`;

usePageTitle(title, description, {
    breadcrumbs: [
        { name: 'Sportsbooks by State', path: '/sportsbooks' },
        { name: `${name} Sportsbooks`, path: route.path },
    ],
    schema: {
        '@type': 'WebPage',
        name: title,
        description,
        url: absoluteUrl(route.path),
        dateModified: state?.updatedAt,
        ...(count && {
            mainEntity: {
                '@type': 'ItemList',
                name: `Legal online sportsbooks in ${name}`,
                numberOfItems: count,
                itemListElement: active.map((book, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: book.name,
                })),
            },
        }),
    },
});
</script>

<template>
    <article class="mx-auto w-full max-w-4xl px-5 py-12">
        <div class="prose">
            <template v-if="state?.legal">
                <KnowledgeHeader>Legal Sportsbooks in {{ name }}</KnowledgeHeader>
                <section class="mb-12">
                    <p>
                        Online sports betting is legal in {{ name }}. These {{ count }} sportsbooks and daily fantasy apps are currently active.
                        <span class="text-sm italic">(Updated {{ formatUpdatedAt(state.updatedAt) }})</span>
                    </p>
                    <ul>
                        <li v-for="book in active" :key="book.name">{{ book.name }}</li>
                    </ul>
                </section>
            </template>
            <template v-else>
                <KnowledgeHeader>Is Sports Betting Legal in {{ name }}?</KnowledgeHeader>
                <section>
                    <p>
                        Not yet. Online sports betting is not legal in {{ name }}. <span class="text-sm italic">(Updated {{ formatUpdatedAt(state?.updatedAt ?? '') }})</span>
                    </p>
                    <p>See the <RouterLink to="/sportsbooks">states where sports betting is legal</RouterLink> and which sportsbooks operate in each.</p>
                </section>
            </template>

            <section v-if="inactive.length > 0">
                <h2>Former Online {{ name }} Sportsbooks</h2>
                <ul>
                    <li v-for="book in inactive" :key="book.name">
                        {{ book.name }} - {{ book.status }} <span v-if="book.date"> ({{ formatDate(book.date) }})</span>
                    </li>
                </ul>
            </section>
        </div>
        <BackButton to="/sportsbooks" class="mt-10">Back to all states</BackButton>
    </article>
</template>
