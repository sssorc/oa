<script setup>
import { ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRouter, useRoute } from 'vue-router';
import NavigationItem from './NavigationItem.vue';

const showNav = ref(false);
const route = useRoute();

// Watch for route changes to close mobile nav
watch(
    () => route.path,
    () => {
        showNav.value = false;
    }
);
</script>

<template>
    <header class="mx-auto w-full max-w-7xl px-5 py-4 lg:pt-8 lg:pb-6">
        <div class="flex items-center justify-end">
            <div class="mr-auto flex items-center gap-3 font-mono text-xl font-bold lg:pt-2">
                <!-- <div class="from-ice-blue to-green h-8 w-10 bg-radial from-10%"></div> -->
                <h1 class="hidden font-normal lg:block">sssorc sports betting tools</h1>
                <h1 class="font-normal lg:hidden">SSBT</h1>
            </div>

            <button type="button" class="z-50 -mr-3 cursor-pointer p-3 sm:hidden" aria-label="Toggle navigation" @click="showNav = !showNav">
                <div class="relative h-4 w-[22px]">
                    <div :class="['absolute h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500', showNav ? 'top-[18px] left-1/2 !w-0' : 'top-0 left-0']"></div>
                    <div :class="['absolute top-[7px] left-0 h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500', showNav ? 'rotate-45' : 'rotate-0']"></div>
                    <div :class="['absolute top-[7px] left-0 h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500', showNav ? '-rotate-45' : 'rotate-0']"></div>
                    <div :class="['absolute h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500', showNav ? 'top-[18px] left-1/2 !w-0' : 'top-[14px] left-0']"></div>
                </div>
            </button>

            <nav :class="{ 'max-sm:hidden': !showNav }" class="z-40 flex gap-2 font-mono max-sm:fixed max-sm:inset-0 max-sm:flex-col max-sm:bg-white max-sm:pt-6">
                <NavigationItem to="/arbitrage">Arbitrage</NavigationItem>
                <NavigationItem to="/bonus-bet">Bonus bet</NavigationItem>
                <NavigationItem to="/risk-free">Risk-free</NavigationItem>
                <NavigationItem to="/devig">Devig</NavigationItem>
            </nav>
        </div>
        <!-- <hr class="border-jet mt-6" /> -->
    </header>
</template>

<style>
header {
    box-shadow: 0 4px 5px -5px #bebebe;
}
</style>
