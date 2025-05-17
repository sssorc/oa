<template>
    <RouterLink
        class="group border-space ring-pale-blue transition-scale linear-65 hover:from-green hover:to-ice-blue dark:hover:from-ice-blue dark:hover:to-pale-blue dark:hover:text-jet dark:hover:ring-ice-blue relative flex scale-100 items-center justify-center rounded border-3 bg-linear-65 from-white to-white px-4 py-8 text-center ring-2 ring-offset-2 duration-100 hover:scale-101 hover:ring-4 hover:ring-offset-0 sm:min-h-[200px] sm:py-4 md:py-16 dark:border-gray-500 dark:from-gray-700 dark:to-gray-700 dark:ring-white/80 dark:ring-offset-gray-900 dark:hover:ring-2"
    >
        <div class="z-2 flex items-center justify-center">
            <slot></slot>
        </div>
    </RouterLink>
</template>
