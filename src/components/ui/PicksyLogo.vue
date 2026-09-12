<script setup>
import { useId } from 'vue';

const uid = useId();
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12.5" fill="none" viewBox="0 0 143 223">
        <path :fill="`url(#${uid}-paint0)`" stroke="#B91D49" d="M74 87a4 4 0 0 1 4-4h62.961c.574 0 1.039.465 1.039 1.039C142 120.468 112.468 150 76.039 150h-.985A1.054 1.054 0 0 1 74 148.946z" />
        <rect width="63" height="222" x=".5" y=".5" :fill="`url(#${uid}-paint1)`" stroke="#000" rx="31.5" />
        <rect width="67" height="67" x="74" y="6" :fill="`url(#${uid}-paint2)`" stroke="#006094" rx="4" />
        <defs>
            <linearGradient :id="`${uid}-paint0`" x1="142" x2="74.746" y1="150" y2="82.26" gradientUnits="userSpaceOnUse">
                <stop stop-color="#DD2257" />
                <stop offset="1" stop-color="#B91D49" />
            </linearGradient>
            <linearGradient :id="`${uid}-paint1`" x1="1.483" x2="119.042" y1="0" y2="35.236" gradientUnits="userSpaceOnUse">
                <stop />
                <stop offset="1" stop-color="#4D4D4D" />
            </linearGradient>
            <linearGradient :id="`${uid}-paint2`" x1="75.552" x2="139.707" y1="6" y2="73" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0075B3" />
                <stop offset="1" stop-color="#0090DB" />
            </linearGradient>
        </defs>
    </svg>
</template>
