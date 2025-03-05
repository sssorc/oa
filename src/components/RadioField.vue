<script setup>
const model = defineModel();
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	value: {
		required: true,
	},
	required: {
		type: Boolean,
	},
});
</script>
<template>
	<label :for="id" class="group inline-flex cursor-pointer items-start gap-2">
		<div class="relative">
			<input type="radio" :id="id" v-model="model" :value="value" class="peer pointer-events-none absolute inset-1 z-20 opacity-0 lg:inset-1.5" :required="required" />
			<div class="flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-300 transition-colors group-hover:border-yellow peer-checked:border-yellow lg:h-5 lg:w-5" type="button">
				<div v-if="model == value" class="h-[7px] w-[7px] rounded-full bg-yellow lg:h-[10px] lg:w-[10px]"></div>
			</div>
		</div>
		<div class="font-normal">
			<slot></slot>
		</div>
	</label>
</template>
