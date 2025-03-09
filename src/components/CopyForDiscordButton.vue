<script setup>
import CopyButton from './CopyButton.vue';

defineProps({
    content: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <CopyButton :content="content" label="copy for discord" />
</template>
