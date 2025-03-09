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
    addon: {
        type: String,
        default: '',
    },
});
</script>
<template>
    <div class="relative">
        <input
            :type="type"
            v-model="model"
            :class="{ 'border-red': error, 'pr-12': addon }"
            class="text-jet placeholder:text-slate disabled:border-gray/50 disabled:bg-gray/20 border-jet/30 focus:border-jet h-11 w-full border bg-white px-4 py-3 text-base leading-[1.5] transition-colors duration-100 outline-none focus:shadow-sm"
        />
        <div v-if="addon" class="bg-pale-blue/50 absolute inset-y-[1px] right-[1px] flex w-10 items-center justify-center text-center text-sm font-semibold">
            {{ addon }}
        </div>
    </div>
</template>
