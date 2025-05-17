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
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 180 180" fill="none">
                    <g clip-path="url(#a)"><path fill="url(#b)" d="M0 0h180v180H0V0Z" /></g>
                    <path fill="#fff" d="M63.875 146V52.875H83.5v38.438h39.938V52.874h19.687V146h-19.687v-38.5H83.5V146H63.875Z" />
                    <path fill="#B8E1FF" d="M56.875 140V46.875H76.5v38.438h39.938V46.874h19.687V140h-19.687v-38.5H76.5V140H56.875Z" />
                    <path fill="#000" d="M49.875 134V40.875H69.5v38.438h39.938V40.874h19.687V134h-19.687V95.5H69.5V134H49.875Z" />
                    <defs>
                        <linearGradient id="b" x1="180" x2="0" y1="46.962" y2="113.416" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#A9FFF7" />
                            <stop offset="1" stop-color="#94FBAB" />
                        </linearGradient>
                        <clipPath id="a"><path fill="#fff" d="M0 0h180v180H0z" /></clipPath>
                    </defs>
                </svg>
                <div class="hidden text-base font-normal min-[400px]:block">HedgeCalc Betting Tools</div>
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
