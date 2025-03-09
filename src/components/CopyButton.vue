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
});

const copySuccess = ref(false);

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
        <span v-if="copySuccess" class="flex items-center gap-1">
            copied!
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" class="text-slate">
                <path
                    fill="currentColor"
                    d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"
                />
            </svg>
        </span>
        <span v-else class="flex items-center gap-1">
            {{ label }}
            <svg xmlns="http://www.w3.org/2000/svg" width="17" fill="none" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M19.5 16.5v-12l-.75-.75H9l-.75.75v3h-3l-.75.75v12l.75.75H15l.75-.75v-3h3l.75-.75Zm-3.75-.75v-7.5L15 7.5H9.75V5.25H18v10.5h-2.25ZM6 9h8.25v10.5H6V9Z"
                    clip-rule="evenodd"
                />
            </svg>
        </span>
    </button>
</template>
