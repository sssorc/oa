<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <RouterLink
        class="group border-jet hover:ring-ice-blue hover:bg-green/10 dark:hover:bg-ice-blue/20 dark:hover:border-ice-blue rounded border px-6 py-4 ring ring-transparent ring-offset-2 ring-offset-transparent lg:py-6 dark:border-gray-600 dark:bg-gray-800 dark:hover:ring-transparent"
    >
        <article class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-bold lg:text-xl">
                <slot></slot>
            </h2>
            <svg class="rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" viewBox="0 0 24 24">
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m3 12 7-7v4h10.2c.28 0 .42 0 .527.055a.5.5 0 0 1 .218.218C21 9.38 21 9.52 21 9.8v4.4c0 .28 0 .42-.055.527a.5.5 0 0 1-.218.218C20.62 15 20.48 15 20.2 15H10v4l-7-7Z"
                />
            </svg>
        </article>
    </RouterLink>
</template>
