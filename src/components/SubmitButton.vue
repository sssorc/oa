<script setup>
import LoadingSpinner from './LoadingSpinner.vue';

defineProps({
    isSubmitting: {
        type: Boolean,
        default: true,
    },
});
</script>

<template>
    <button
        type="submit"
        :class="{ 'from-pale-blue to-ice-blue pointer-events-none from-10%': isSubmitting }"
        class="from-pale-blue to-ice-blue text-jet relative cursor-pointer bg-linear-65 from-40% px-8 py-3 font-mono tracking-wide shadow transition-all duration-100 hover:from-10% active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:translate-none disabled:cursor-not-allowed disabled:from-[#CFDDE8] disabled:to-[#C4E3E0] disabled:text-gray-500 disabled:shadow"
        :style="{ minWidth: '170px' }"
    >
        <LoadingSpinner v-if="isSubmitting" size="24" class="text-jet absolute inset-0 flex items-center justify-center" />
        <span :class="{ 'opacity-0': isSubmitting }">
            <slot>Submit</slot>
        </span>
    </button>
</template>
