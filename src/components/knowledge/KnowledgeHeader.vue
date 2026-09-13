<script setup>
defineProps({
    publishedAt: {
        type: String,
        default: '',
    },
    updatedAt: {
        type: String,
        default: '',
    },
});

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}
</script>

<template>
    <header class="relative mb-10">
        <h1 class="relative z-2">
            <slot></slot>
        </h1>
        <p v-if="publishedAt && updatedAt" class="relative z-2 text-sm text-gray-500 dark:text-gray-400">
            By HedgeCalc · Published <time :datetime="publishedAt">{{ formatDate(publishedAt) }}</time> · Updated <time :datetime="updatedAt">{{ formatDate(updatedAt) }}</time>
        </p>
        <div class="from-pale-blue to-ice-blue absolute inset-x-0 bottom-0 z-1 h-1 bg-linear-65 dark:opacity-50"></div>
    </header>
</template>
