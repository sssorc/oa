<script setup>
import { useId } from 'vue';

const uid = useId();
</script>

<template>
    <svg class="dark:hidden" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 180 180" fill="none">
        <path :fill="`url(#${uid}-light)`" d="M0 0h180v180H0V0Z" />
        <path fill="#fff" d="M58.875 146V52.875H78.5v38.438h39.938V52.874h19.687V146h-19.687v-38.5H78.5V146H58.875Z" />
        <path fill="#B8E1FF" d="M51.875 140V46.875H71.5v38.438h39.938V46.874h19.687V140h-19.687v-38.5H71.5V140H51.875Z" />
        <path fill="#000" d="M44.875 134V40.875H64.5v38.438h39.938V40.874h19.687V134h-19.687V95.5H64.5V134H44.875Z" />
        <defs>
            <linearGradient :id="`${uid}-light`" x1="180" x2="0" y1="46.962" y2="113.416" gradientUnits="userSpaceOnUse">
                <stop stop-color="#A9FFF7" />
                <stop offset="1" stop-color="#94FBAB" />
            </linearGradient>
        </defs>
    </svg>
    <svg class="hidden dark:block" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 180 180" fill="none">
        <path :fill="`url(#${uid}-dark)`" d="M0 0h180v180H0V0Z" />
        <path fill="#243c5a" d="M58.875 146V52.875H78.5v38.438h39.938V52.874h19.687V146h-19.687v-38.5H78.5V146H58.875Z" />
        <path fill="#82aba1" d="M51.875 140V46.875H71.5v38.438h39.938V46.874h19.687V140h-19.687v-38.5H71.5V140H51.875Z" />
        <path fill="#000" d="M44.875 134V40.875H64.5v38.438h39.938V40.874h19.687V134h-19.687V95.5H64.5V134H44.875Z" />
        <defs>
            <linearGradient :id="`${uid}-dark`" x1="180" x2="0" y1="46.962" y2="113.416" gradientUnits="userSpaceOnUse">
                <stop stop-color="#A9FFF7" />
                <stop offset="1" stop-color="#94FBAB" />
            </linearGradient>
        </defs>
    </svg>
</template>
