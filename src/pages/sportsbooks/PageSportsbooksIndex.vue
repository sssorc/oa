<script setup>
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';
import BackButton from '@/components/ui/BackButton.vue';
import { usePageTitle, absoluteUrl } from '@/composables/usePageTitle';
import { states, monthYear } from '@/utils/states';

const legalStates = states.filter((state) => state.legal);
const illegalStates = states.filter((state) => !state.legal);
const legalCount = legalStates.filter((state) => state.key !== 'district_of_columbia').length;
const hasDC = legalStates.length !== legalCount;
const lastUpdated = states
    .map((state) => state.updatedAt)
    .sort()
    .at(-1);

const title = `Legal Sportsbooks by State (${monthYear(lastUpdated)})`;
const description = `Online sports betting is legal in ${legalCount} states${hasDC ? ' and Washington, D.C.' : '.'} Pick your state to see every legal sportsbook and betting app available there.`;

usePageTitle(title, description, {
    breadcrumbs: [{ name: 'Sportsbooks by State', path: '/sportsbooks' }],
    schema: {
        '@type': 'WebPage',
        name: title,
        description,
        url: absoluteUrl('/sportsbooks'),
        dateModified: lastUpdated,
        mainEntity: {
            '@type': 'ItemList',
            name: 'States with legal online sports betting',
            numberOfItems: legalStates.length,
            itemListElement: legalStates.map((state, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: `${state.name} Sportsbooks`,
                url: absoluteUrl(state.path),
            })),
        },
    },
});
</script>

<template>
    <article class="mx-auto w-full max-w-4xl px-5 py-12">
        <div class="prose">
            <KnowledgeHeader>Legal Online Sportsbooks by State</KnowledgeHeader>

            <p>
                Online sports betting is legal in {{ legalCount }} states<template v-if="hasDC"> and Washington, D.C</template>. Select your state to see the legal sportsbooks and daily fantasy sites
                available there.
            </p>
            <ul class="gap-8 sm:columns-2 lg:columns-3">
                <li v-for="state in legalStates" :key="state.key">
                    <RouterLink :to="state.path">{{ state.name }}</RouterLink>
                </li>
            </ul>

            <h2>States where sports betting is not yet legal</h2>
            <ul class="gap-8 sm:columns-2 lg:columns-3">
                <li v-for="state in illegalStates" :key="state.key">
                    <RouterLink :to="state.path">{{ state.name }}</RouterLink>
                </li>
            </ul>
        </div>
        <BackButton to="/knowledge" class="mt-10">Back to knowledge base</BackButton>
    </article>
</template>
