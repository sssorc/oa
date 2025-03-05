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
	<RouterLink
		:to="to"
		class="text-primary flex items-center justify-center h-10 flex-1 no-underline uppercase text-[13px] tracking-[0.5px] font-medium font-roboto transition-colors relative group"
		:class="{ 'text-primary': isActive }"
		:style="{
			'--border-color': borderColor,
		}"
	>
		<slot />
		<div :class="{ '!opacity-100': isActive }" :style="`background-color: ${borderColor}`" class="absolute bottom-[-5px] inset-x-0 h-[5px] opacity-0 group-hover:opacity-30"></div>
	</RouterLink>
</template>
