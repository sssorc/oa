<script setup>
import AppFooterLink from '@/components/ui/AppFooterLink.vue';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';
</script>
<template>
    <footer class="mx-auto mt-auto w-full max-w-7xl px-5 pt-10 pb-8 sm:pb-10 md:pt-20">
        <div class="border-jet relative mx-auto border-t pt-3 font-mono text-sm sm:justify-end dark:border-gray-400 dark:text-white">
            <div class="bg-pale-blue dark:bg-pale-blue/60 absolute inset-x-0 top-[2px] h-[1px]"></div>
            <div class="flex flex-col gap-y-8 sm:flex-row sm:items-center sm:justify-between">
                <nav class="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:order-2">
                    <AppFooterLink href="https://ko-fi.com/sssorc" target="_blank">buy me a <span class="font-sans">☕</span></AppFooterLink>
                    <AppFooterLink href="/knowledge">knowledge</AppFooterLink>
                    <AppFooterLink href="/parlay-buddy">parlay buddy</AppFooterLink>
                    <AppFooterLink href="https://picksyprops.com" class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="" fill="none" viewBox="0 0 143 223" style="height: auto">
                            <path
                                :fill="`url(#${uid}-paint0_linear_16_23)`"
                                stroke="#B91D49"
                                d="M74 87a4 4 0 0 1 4-4h62.961c.574 0 1.039.465 1.039 1.039C142 120.468 112.468 150 76.039 150h-.985A1.054 1.054 0 0 1 74 148.946z"
                            />
                            <rect width="63" height="222" x=".5" y=".5" :fill="`url(#${uid}-paint1_linear_16_23)`" stroke="#000" rx="31.5" />
                            <rect width="67" height="67" x="74" y="6" :fill="`url(#${uid}-paint2_linear_16_23)`" stroke="#006094" rx="4" />
                            <defs>
                                <linearGradient :id="`${uid}-paint0_linear_16_23`" x1="142" x2="74.746" y1="150" y2="82.26" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#DD2257" />
                                    <stop offset="1" stop-color="#B91D49" />
                                </linearGradient>
                                <linearGradient :id="`${uid}-paint1_linear_16_23`" x1="1.483" x2="119.042" y1="0" y2="35.236" gradientUnits="userSpaceOnUse">
                                    <stop />
                                    <stop offset="1" stop-color="#4D4D4D" />
                                </linearGradient>
                                <linearGradient :id="`${uid}-paint2_linear_16_23`" x1="75.552" x2="139.707" y1="6" y2="73" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#0075B3" />
                                    <stop offset="1" stop-color="#0090DB" />
                                </linearGradient>
                            </defs>
                        </svg>
                        picksy
                    </AppFooterLink>
                    <AppFooterLink href="https://discord.com/users/956734805033250826" target="_blank">contact</AppFooterLink>
                </nav>
                <ThemeToggle class="ml-auto sm:order-1 sm:ml-0" />
            </div>
        </div>
    </footer>
</template>
