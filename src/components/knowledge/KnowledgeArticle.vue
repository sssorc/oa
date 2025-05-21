<script setup>
import BackButton from '@/components/ui/BackButton.vue';
import { onMounted } from 'vue';

onMounted(() => {
    window.scrollTo(0, 0);
});
</script>
<template>
    <article class="mx-auto w-full max-w-4xl px-5 py-12">
        <div class="prose">
            <slot></slot>
        </div>
        <BackButton to="/knowledge" class="mt-10">Back to knowledge base</BackButton>
    </article>
</template>
