<script setup>
import { ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRouter, useRoute } from 'vue-router';
import AppHeaderLink from '@/components/ui/AppHeaderLink.vue';

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
    <header class="border-pale-blue mx-auto w-full max-w-7xl border-b px-5 py-4 lg:pt-8 lg:pb-6" style="box-shadow: 0 4px 5px -5px #bebebe">
        <div class="flex items-center justify-end">
            <RouterLink to="/" class="mr-auto flex items-center gap-3 font-mono font-bold lg:pt-2">
                <div class="block text-base font-normal lg:block">HedgeCalc Betting Tools</div>
            </RouterLink>

            <button type="button" class="z-50 -mr-3 cursor-pointer p-3 md:hidden" aria-label="Toggle navigation" @click="showNav = !showNav">
                <div class="relative h-4 w-[22px]">
                    <div :class="['absolute h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500', showNav ? 'top-[18px] left-1/2 !w-0' : 'top-0 left-0']"></div>
                    <div :class="['absolute top-[7px] left-0 h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500', showNav ? 'rotate-45' : 'rotate-0']"></div>
                    <div :class="['absolute top-[7px] left-0 h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500', showNav ? '-rotate-45' : 'rotate-0']"></div>
                    <div :class="['absolute h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500', showNav ? 'top-[18px] left-1/2 !w-0' : 'top-[14px] left-0']"></div>
                </div>
            </button>

            <nav :class="{ 'max-md:hidden': !showNav }" class="z-40 flex gap-2 font-mono max-md:fixed max-md:inset-0 max-md:flex-col max-md:bg-white max-md:pt-16">
                <AppHeaderLink to="/arbitrage">Arbitrage</AppHeaderLink>
                <AppHeaderLink to="/bonus-bet">Bonus bet</AppHeaderLink>
                <AppHeaderLink to="/risk-free">Risk-free</AppHeaderLink>
                <AppHeaderLink to="/devig">Devig</AppHeaderLink>
            </nav>
        </div>
        <!-- <hr class="border-jet mt-6" /> -->
    </header>
</template>
