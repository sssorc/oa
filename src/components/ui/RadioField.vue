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
            <div
                class="peer-checked:border-slate dark:peer-checked:border-ice-blue flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-300 lg:h-5 lg:w-5 dark:border-gray-400"
                type="button"
            >
                <div
                    :class="{ 'opacity-100': model == value, 'opacity-0 group-hover:opacity-60': model !== value }"
                    class="bg-slate dark:bg-ice-blue h-[7px] w-[7px] rounded-full opacity-0 lg:h-[10px] lg:w-[10px]"
                ></div>
            </div>
        </div>
        <div class="text-sm">
            <slot></slot>
        </div>
    </label>
</template>
