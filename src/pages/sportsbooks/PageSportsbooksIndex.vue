<script setup>
import { computed } from 'vue';
import { useHead, useSeoMeta } from '@unhead/vue';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';
import sportsbooksData from '@/data/sportsbooks.json';

// Get list of states with data, separated by legal status
const availableStates = computed(() => {
    return Object.entries(sportsbooksData)
        .filter(([_, data]) => data.legal)
        .map(([key, data]) => ({
            code: key,
            name: key
                .replace(/_/g, ' ')
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
            updatedAt: data.updatedAt,
        }));
});

const illegalStates = computed(() => {
    return Object.entries(sportsbooksData)
        .filter(([_, data]) => !data.legal)
        .map(([key]) => ({
            code: key,
            name: key
                .replace(/_/g, ' ')
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
        }));
});

// Set page title and meta description
useHead({
    title: 'Legal Sportsbooks by State - Online Sports Betting Sites',
});

// Set SEO meta tags
useSeoMeta({
    description: 'Find legal sportsbooks and daily fantasy sports sites available in your state. Comprehensive list of online sports betting options by state.',
    ogTitle: 'Legal Sportsbooks by State - Online Sports Betting Sites',
    ogDescription: 'Find legal sportsbooks and daily fantasy sports sites available in your state. Comprehensive list of online sports betting options by state.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Legal Sportsbooks by State - Online Sports Betting Sites',
    twitterDescription: 'Find legal sportsbooks and daily fantasy sports sites available in your state. Comprehensive list of online sports betting options by state.',
});

// Add structured data using Schema.org
useHead({
    script: [
        {
            type: 'application/ld+json',
            children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: 'Legal Sportsbooks by State - Online Sports Betting Sites',
                description: 'Find legal sportsbooks and daily fantasy sports sites available in your state. Comprehensive list of online sports betting options by state.',
                mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: availableStates.value.map((state, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        item: {
                            '@type': 'WebPage',
                            name: `${state.name} Sportsbooks`,
                            url: `/sportsbooks/${state.code}`,
                            dateModified: state.updatedAt,
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
        <KnowledgeHeader>Legal Sportsbooks by State</KnowledgeHeader>

        <p>Select your state to view available legal sportsbooks and daily fantasy sports sites:</p>
        <ul class="gap-8 sm:columns-2 lg:columns-3">
            <li v-for="state in availableStates" :key="state.code">
                <router-link :to="'/sportsbooks/' + state.code.replace(/_/g, '-')">
                    {{ state.name }}
                </router-link>
            </li>
        </ul>

        <h2>States where sports betting is not yet legal</h2>
        <ul class="gap-8 sm:columns-2 lg:columns-3">
            <li v-for="state in illegalStates" :key="state.code">
                {{ state.name }}
            </li>
        </ul>
    </article>
</template>
