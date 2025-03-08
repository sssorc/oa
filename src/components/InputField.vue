<script setup>
const model = defineModel();
const props = defineProps({
	type: {
		type: String,
		default: 'text',
	},
	error: {
		type: Boolean,
		default: false,
	},
});
</script>
<template>
	<input
		:type="type"
		v-model="model"
		:class="{ 'shadow-error border-red': error }"
		class="h-12 bg-white border border-[#A3B18A] px-4 py-3 leading-[1.5] text-charcoal outline-none transition-colors duration-100 [appearance:textfield] placeholder:text-slate hover:bg-white hover:shadow focus:border-[#344E41] focus:bg-white focus:shadow-md disabled:border-gray/50 disabled:bg-gray/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
	/>
</template>
