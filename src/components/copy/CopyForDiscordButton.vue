<script setup>
import CopyButton from '@/components/copy/CopyButton.vue';

defineProps({
    content: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <CopyButton :content="content" label="copy for discord" mobile-label="discord" />
</template>
