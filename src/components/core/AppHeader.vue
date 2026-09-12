<script setup>
import { ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRouter, useRoute } from 'vue-router';
import AppHeaderLink from '@/components/ui/AppHeaderLink.vue';
import AppFooterLink from '@/components/ui/AppFooterLink.vue';
import HedgeCalcLogo from '@/components/ui/HedgeCalcLogo.vue';
import PicksyLogo from '@/components/ui/PicksyLogo.vue';

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
    <header class="relative z-30 w-full bg-white shadow-sm dark:bg-gray-900">
        <div class="bg-gray-100 max-[375px]:hidden dark:bg-gray-950">
            <nav class="mx-auto flex w-full max-w-[88rem] gap-x-3 px-5 py-1.5 text-xs whitespace-nowrap sm:gap-x-6 sm:text-sm">
                <AppFooterLink href="https://ko-fi.com/sssorc" target="_blank">buy me a <span class="font-sans">☕</span></AppFooterLink>
                <AppFooterLink href="/knowledge">knowledge</AppFooterLink>
                <AppFooterLink href="/parlay-buddy">parlay buddy</AppFooterLink>
                <AppFooterLink href="https://picksyprops.com" class="flex items-center gap-2">
                    <PicksyLogo />
                    picksy
                </AppFooterLink>
                <AppFooterLink href="https://discord.com/users/956734805033250826" target="_blank">contact</AppFooterLink>
            </nav>
        </div>
        <div class="mx-auto flex w-full max-w-[88rem] items-center justify-end px-5 py-2">
            <RouterLink to="/" class="mr-auto flex items-center gap-3 font-mono font-bold">
                <HedgeCalcLogo />
                <div class="hidden text-base font-normal min-[400px]:block">HedgeCalc Betting Tools</div>
            </RouterLink>

            <button type="button" class="z-50 -mr-3 cursor-pointer p-3 md:hidden" aria-label="Toggle navigation" @click="showNav = !showNav">
                <div class="relative h-4 w-[22px]">
                    <div :class="['absolute h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500 dark:bg-white', showNav ? 'top-[18px] left-1/2 !w-0' : 'top-0 left-0']"></div>
                    <div :class="['absolute top-[7px] left-0 h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500 dark:bg-white', showNav ? 'rotate-45' : 'rotate-0']"></div>
                    <div :class="['absolute top-[7px] left-0 h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500 dark:bg-white', showNav ? '-rotate-45' : 'rotate-0']"></div>
                    <div
                        :class="['absolute h-[2px] w-full rounded bg-black duration-150 ease-in-out hover:bg-blue-500 dark:bg-white', showNav ? 'top-[18px] left-1/2 !w-0' : 'top-[14px] left-0']"
                    ></div>
                </div>
            </button>

            <nav :class="{ 'max-md:hidden': !showNav, 'dark:bg-gray-900': showNav }" class="z-40 flex gap-2 font-mono max-md:fixed max-md:inset-0 max-md:flex-col max-md:bg-white max-md:pt-16">
                <AppHeaderLink to="/arbitrage-calculator">Arbitrage</AppHeaderLink>
                <AppHeaderLink to="/bonus-bet-calculator">Bonus bet</AppHeaderLink>
                <AppHeaderLink to="/risk-free-bet-calculator">Risk-free</AppHeaderLink>
                <AppHeaderLink to="/devig-calculator">Devig</AppHeaderLink>
            </nav>
        </div>
    </header>
</template>
