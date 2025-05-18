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
                    <AppFooterLink href="https://ko-fi.com/sssorc" target="_blank">support</AppFooterLink>
                    <AppFooterLink href="/knowledge">knowledge</AppFooterLink>
                    <AppFooterLink href="https://chromewebstore.google.com/detail/cno-parlay-buddy/hcpaaidgaenjoobhlbacpfnolcebefef?hl=en-US&utm_source=ext_sidebar" target="_blank"
                        >parlay buddy</AppFooterLink
                    >
                    <AppFooterLink href="https://discord.com/users/956734805033250826" target="_blank">contact</AppFooterLink>
                </nav>
                <ThemeToggle class="ml-auto sm:order-1 sm:ml-0" />
            </div>
        </div>
    </footer>
</template>
