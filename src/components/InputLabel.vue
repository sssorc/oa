<script setup>
defineProps({
    required: {
        type: Boolean,
        default: false,
    },
});
</script>
<template>
    <label class="mb-1 inline-block font-mono text-sm">
        <slot></slot>
        <sup v-if="required" class="text-red ml-[2px]">*</sup>
    </label>
</template>
