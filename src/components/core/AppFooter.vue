<script setup>
import HedgeCalcLogo from '@/components/ui/HedgeCalcLogo.vue';
import AppFooterLink from '@/components/ui/AppFooterLink.vue';
import PicksyLogo from '@/components/ui/PicksyLogo.vue';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';
</script>
<template>
    <footer class="mt-auto w-full pt-10 md:pt-20">
        <div class="bg-gray-100 dark:bg-gray-950">
            <div class="mx-auto grid w-full max-w-[88rem] gap-10 px-5 py-12 font-mono text-sm sm:grid-cols-[auto_1fr] md:py-16 dark:text-white">
                <div class="grid grid-cols-2 gap-8 sm:order-2 sm:justify-end sm:gap-x-12 md:grid-cols-[repeat(4,max-content)] lg:gap-x-20">
                    <div class="grid content-start gap-3">
                        <h2 class="text-xs text-gray-500 uppercase dark:text-gray-400">Calculators</h2>
                        <ul class="grid gap-2 font-sans">
                            <li><AppFooterLink href="/hedge-calculator">hedge</AppFooterLink></li>
                            <li><AppFooterLink href="/arbitrage-calculator">arbitrage</AppFooterLink></li>
                            <li><AppFooterLink href="/bonus-bet-calculator">bonus / free bet</AppFooterLink></li>
                            <li><AppFooterLink href="/risk-free-bet-calculator">risk-free bet</AppFooterLink></li>
                            <li><AppFooterLink href="/devig-calculator">devig</AppFooterLink></li>
                        </ul>
                    </div>
                    <div class="grid content-start gap-3">
                        <h2 class="text-xs text-gray-500 uppercase dark:text-gray-400">Resources</h2>
                        <ul class="grid gap-2 font-sans">
                            <li><AppFooterLink href="/knowledge">knowledge center</AppFooterLink></li>
                            <li><AppFooterLink href="/kotez">king of the end zone</AppFooterLink></li>
                            <li><AppFooterLink href="/slatebreaker">slatebreaker</AppFooterLink></li>
                            <li><AppFooterLink href="/sportsbooks">sportsbooks by state</AppFooterLink></li>
                        </ul>
                    </div>
                    <div class="grid content-start gap-3">
                        <h2 class="text-xs text-gray-500 uppercase dark:text-gray-400">Other stuff</h2>
                        <ul class="grid gap-2 font-sans">
                            <li><AppFooterLink href="/parlay-buddy">parlay buddy</AppFooterLink></li>
                            <li>
                                <AppFooterLink href="https://picksyprops.com" class="inline-flex items-center gap-2">
                                    <PicksyLogo />
                                    picksy
                                </AppFooterLink>
                            </li>
                        </ul>
                    </div>
                    <div class="grid content-start gap-3">
                        <h2 class="text-xs text-gray-500 uppercase dark:text-gray-400">Reach out</h2>
                        <ul class="grid gap-2 font-sans">
                            <li><AppFooterLink href="https://discord.com/users/956734805033250826" target="_blank">contact</AppFooterLink></li>
                            <li>
                                <AppFooterLink href="https://ko-fi.com/sssorc" target="_blank">buy me a <span class="font-sans">☕</span></AppFooterLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="grid content-between justify-items-start gap-6 sm:order-1">
                    <RouterLink to="/" class="flex items-center gap-3 text-base">
                        <HedgeCalcLogo />
                        HedgeCalc Betting Tools
                    </RouterLink>
                    <ThemeToggle class="-ml-2" />
                </div>
            </div>
        </div>
    </footer>
</template>
