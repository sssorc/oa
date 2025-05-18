<script setup>
const model = defineModel();
const emit = defineEmits(['change']);

function toggle() {
	model.value = !model.value;
	emit('change');
}
</script>
<template>
	<div :class="model ? 'bg-emerald-700 ring-black/20' : 'bg-slate-900/10 ring-slate-900/5'" class="h-6 w-10 cursor-pointer rounded-full p-1 ring-1 ring-inset ring-black/20 transition duration-150 ease-in-out" @click="toggle">
		<div :class="{ 'translate-x-4': model }" class="h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-150 ease-in-out"></div>
	</div>
</template>
p
