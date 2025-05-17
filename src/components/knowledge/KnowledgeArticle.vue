<template>
    <article class="mx-auto w-full max-w-4xl px-5 py-12">
        <div class="prose">
            <slot></slot>
        </div>
        <router-link
            to="/knowledge"
            class="text-space-gray border-jet decoration-none hover:ring-ice-blue hover:bg-green/10 dark:hover:bg-ice-blue/20 mt-6 inline-flex items-center gap-2 rounded-sm border p-2 text-sm ring ring-transparent ring-offset-2 ring-offset-transparent transition-all duration-100 dark:border-gray-500 dark:text-white/90 dark:ring-offset-gray-900 dark:hover:text-white dark:hover:ring-offset-0"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" viewBox="0 0 24 24">
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m3 12 7-7v4h10.2c.28 0 .42 0 .527.055a.5.5 0 0 1 .218.218C21 9.38 21 9.52 21 9.8v4.4c0 .28 0 .42-.055.527a.5.5 0 0 1-.218.218C20.62 15 20.48 15 20.2 15H10v4l-7-7Z"
                />
            </svg>
            Back to knowledge base
        </router-link>
    </article>
</template>
