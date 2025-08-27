<script setup>
import { ref } from 'vue';

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    mobileLabel: {
        type: String,
        required: false,
        default: '',
    },
});

const copySuccess = ref(false);

const visibleClasses = '!opacity-100 !scale-100';
const hiddenClasses = '!scale-[50%] !opacity-0';

async function copyContent() {
    if (copySuccess.value) return;

    try {
        await navigator.clipboard.writeText(props.content);
        copySuccess.value = true;

        setTimeout(() => {
            copySuccess.value = false;
        }, 1000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}
</script>

<template>
    <button
        @click="copyContent"
        type="button"
        :class="{ 'hover:decoration-pale-blue cursor-pointer': !copySuccess }"
        class="p-1 font-mono text-sm tracking-tighter underline decoration-transparent decoration-2 underline-offset-2 transition-colors duration-100"
    >
        <span class="flex scale-100 items-center gap-1">
            <span class="hidden sm:inline">{{ label }}</span>
            <span class="sm:hidden">{{ mobileLabel || label }}</span>
            <div class="relative">
                <svg
                    :class="copySuccess ? hiddenClasses : ''"
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="col-start-1 row-start-1 scale-100 opacity-100 transition-[opacity,scale] duration-200 ease-in-out"
                >
                    <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M19.5 16.5v-12l-.75-.75H9l-.75.75v3h-3l-.75.75v12l.75.75H15l.75-.75v-3h3l.75-.75Zm-3.75-.75v-7.5L15 7.5H9.75V5.25H18v10.5h-2.25ZM6 9h8.25v10.5H6V9Z"
                        clip-rule="evenodd"
                    />
                </svg>
                <svg
                    :class="copySuccess ? visibleClasses : ''"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="13"
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[50%] opacity-0 transition-[opacity,scale] duration-200 ease-in-out"
                >
                    <path
                        fill="currentColor"
                        d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"
                    />
                </svg>
            </div>
        </span>
    </button>
</template>
