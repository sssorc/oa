<script setup>
import Navigation from '@/components/Navigation.vue';
import { usePageTitle } from '@/composables/usePageTitle';

// Set default title
usePageTitle();
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <Navigation />
        <RouterView />
        <footer class="mx-auto mt-auto w-full max-w-7xl px-5 pt-20 pb-10">
            <footer class="border-jet mx-auto flex justify-end gap-6 border-t pt-3 font-mono text-sm">
                <a href="https://ko-fi.com/sssorc" target="_blank" class="hover:decoration-pale-blue underline decoration-transparent decoration-2 underline-offset-2 transition-colors duration-100"
                    >support</a
                >
                <a
                    href="https://chromewebstore.google.com/detail/cno-parlay-buddy/hcpaaidgaenjoobhlbacpfnolcebefef?hl=en-US&utm_source=ext_sidebar"
                    target="_blank"
                    class="hover:decoration-pale-blue underline decoration-transparent decoration-2 underline-offset-2 transition-colors duration-100"
                    >parlay buddy</a
                >
                <a
                    href="https://discord.com/users/956734805033250826"
                    target="_blank"
                    class="hover:decoration-pale-blue underline decoration-transparent decoration-2 underline-offset-2 transition-colors duration-100"
                    >contact</a
                >
            </footer>
        </footer>
    </div>
</template>
