<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <RouterLink
        class="group border-jet hover:ring-ice-blue hover:bg-green/10 dark:hover:bg-ice-blue/20 dark:hover:border-ice-blue rounded border p-6 ring ring-transparent ring-offset-2 ring-offset-transparent transition-all duration-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:ring-transparent"
    >
        <article>
            <h2 class="text-xl font-bold">
                <slot></slot>
            </h2>
        </article>
    </RouterLink>
</template>
