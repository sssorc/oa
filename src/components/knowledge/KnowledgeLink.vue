<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <RouterLink class="group border-jet hover:ring-ice-blue hover:bg-green/10 rounded border p-6 ring ring-transparent ring-offset-2 ring-offset-transparent transition-all duration-100">
        <article>
            <h2 class="text-xl font-bold">
                <slot></slot>
            </h2>
        </article>
    </RouterLink>
</template>
