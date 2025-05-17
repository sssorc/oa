<script setup>
import AppFooterLink from '@/components/ui/AppFooterLink.vue';
</script>
<template>
    <footer class="mx-auto mt-auto w-full max-w-7xl px-5 pt-20 pb-10">
        <div class="border-jet relative mx-auto flex justify-end gap-6 border-t pt-3 font-mono text-sm">
            <div class="bg-pale-blue absolute inset-x-0 top-[2px] h-[1px]"></div>
            <AppFooterLink href="https://ko-fi.com/sssorc" target="_blank">support</AppFooterLink>
            <AppFooterLink href="/knowledge" target="_blank">knowledge</AppFooterLink>
            <AppFooterLink href="https://chromewebstore.google.com/detail/cno-parlay-buddy/hcpaaidgaenjoobhlbacpfnolcebefef?hl=en-US&utm_source=ext_sidebar" target="_blank"
                >parlay buddy</AppFooterLink
            >
            <AppFooterLink href="https://discord.com/users/956734805033250826" target="_blank">contact</AppFooterLink>
        </div>
    </footer>
</template>
