<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead, useSeoMeta } from '@unhead/vue';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';
import sportsbooksData from '@/data/sportsbooks.json';

const route = useRoute();
const router = useRouter();
const state = computed(() => route.params.state);

// Redirect if state data doesn't exist
onMounted(() => {
    const stateKey = state.value.replace(/-/g, '_');
    if (!sportsbooksData[stateKey]) {
        router.push('/sportsbooks');
    }
});

// Format state name for display (e.g., "virginia" -> "Virginia")
const formattedState = computed(() => {
    return state.value
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
});

// Set page title and meta description
useHead({
    title: `${formattedState.value} Sportsbooks - Legal Online Sports Betting Sites`,
    titleTemplate: '%s | HedgeCalc',
});

// Set SEO meta tags
useSeoMeta({
    description: `Complete list of legal sportsbooks available in ${formattedState.value}. Find the best online sports betting sites, current promotions, and betting options.`,
    ogTitle: `${formattedState.value} Sportsbooks - Legal Online Sports Betting Sites`,
    ogDescription: `Complete list of legal sportsbooks available in ${formattedState.value}. Find the best online sports betting sites, current promotions, and betting options.`,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: `${formattedState.value} Sportsbooks - Legal Online Sports Betting Sites`,
    twitterDescription: `Complete list of legal sportsbooks available in ${formattedState.value}. Find the best online sports betting sites, current promotions, and betting options.`,
});

const stateData = computed(() => {
    const stateKey = state.value.replace(/-/g, '_');
    return sportsbooksData[stateKey] || { active: [], inactive: [] };
});

// Add structured data using Schema.org
useHead({
    script: [
        {
            type: 'application/ld+json',
            children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: `${formattedState.value} Sportsbooks - Legal Online Sports Betting Sites`,
                description: `Complete list of legal sportsbooks available in ${formattedState.value}. Find the best online sports betting sites, current promotions, and betting options.`,
                mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: stateData.value.active.map((book, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        item: {
                            '@type': 'Service',
                            name: book.name,
                            description: `Online sports betting service available in ${formattedState.value}`,
                        },
                    })),
                },
            }),
        },
    ],
});
</script>

<template>
    <article class="prose mx-auto w-full max-w-4xl px-5 py-12">
        <KnowledgeHeader>{{ formattedState }} Sportsbooks</KnowledgeHeader>

        <section v-if="stateData.legal" class="mb-12">
            <p>
                The following sportsbooks and daily fantasy sites are legal and active in {{ formattedState }}.
                <span class="text-sm italic">(Updated {{ new Date(stateData.updatedAt).toLocaleDateString() }})</span>
            </p>
            <ul>
                <li v-for="book in stateData.active" :key="book.name">{{ book.name }}</li>
            </ul>
        </section>
        <section v-else>
            <p>
                Sports betting is not yet legal in {{ formattedState }}. <span class="text-sm italic">(Updated {{ new Date(stateData.updatedAt).toLocaleDateString() }})</span>
            </p>
        </section>

        <section v-if="stateData.inactive.length > 0">
            <h2>Former Sportsbooks</h2>
            <ul>
                <li v-for="book in stateData.inactive" :key="book.name">
                    {{ book.name }} - {{ book.status }} <span v-if="book.date"> ({{ book.date }})</span>
                </li>
            </ul>
        </section>
    </article>
</template>
