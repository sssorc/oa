<script setup>
import Navigation from '@/components/Navigation.vue';
</script>

<template>
    <div>
        <Navigation />
        <RouterView />
        <footer class="mx-auto mt-20 max-w-7xl px-5 pb-10">
            <footer class="border-jet mx-auto flex justify-end gap-6 border-t pt-3 font-mono text-sm">
                <a href="https://crazyninjaodds.com/" target="_blank" class="hover:decoration-pale-blue underline decoration-transparent decoration-2 underline-offset-2 transition-colors duration-100"
                    >crazyninjaodds.com</a
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
