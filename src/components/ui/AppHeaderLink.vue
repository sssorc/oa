<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    to: {
        type: String,
        required: true,
    },
});

const route = useRoute();
const isActive = computed(() => route.path === props.to);
</script>

<template>
    <RouterLink :to="to" :class="{ 'hover:bg-ice-blue/50 dark:hover:bg-ice-blue/20': !isActive }" class="relative px-4 py-3 transition-all duration-100">
        <span :class="isActive ? 'dark:text-jet' : 'dark:text-white/90'" class="text-jet relative z-10">
            <slot></slot>
        </span>
        <div
            :class="{ 'opacity-100 shadow': isActive }"
            class="from-green to-ice-blue dark:from-ice-blue dark:to-pale-blue pointer-events-none absolute inset-0 bg-linear-65 opacity-0 transition-all duration-100"
        ></div>
    </RouterLink>
</template>
