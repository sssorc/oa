<script setup></script>

<template>
    <button
        type="submit"
        class="from-pale-blue to-ice-blue text-jet cursor-pointer bg-linear-65 from-40% px-8 py-3 font-mono tracking-wide shadow transition-all duration-100 hover:from-10% active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:translate-none disabled:cursor-not-allowed disabled:from-[#CFDDE8] disabled:to-[#C4E3E0] disabled:text-gray-500 disabled:shadow"
        :style="{ minWidth: '170px' }"
    >
        <slot>Submit</slot>
    </button>
</template>
