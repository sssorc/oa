<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
	to: {
		type: String,
		required: true,
	},
	borderColor: {
		type: String,
		required: true,
	},
});

const route = useRoute();
const isActive = computed(() => route.fullPath === props.to);
</script>

<template>
	<RouterLink :to="to" :class="{ 'hover:bg-ice-blue/30': !isActive }" class="py-3 px-4 relative transition-all duration-600 bg-linear-65" to="/devig">
		<span class="relative z-10 text-jet"><slot></slot></span>
		<div :class="{ 'opacity-100': isActive }" class="pointer-events-none opacity-0 absolute inset-0 bg-linear-65 from-green to-ice-blue transition-all duration-400"></div>
	</RouterLink>
</template>
