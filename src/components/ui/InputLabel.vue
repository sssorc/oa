<script setup>
defineProps({
    required: {
        type: Boolean,
        default: false,
    },
});
</script>
<template>
    <label class="mb-2 inline-block font-mono text-sm">
        <slot></slot>
        <sup v-if="required" class="text-red dark:text-ice-blue ml-[2px]">*</sup>
    </label>
</template>
