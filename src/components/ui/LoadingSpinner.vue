<template>
    <div>
        <svg class="spin block" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" preserveAspectRatio="xMidYMid" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-dasharray="94.24777960769379 33.41592653589793" stroke-width="5" transform="rotate(264 50 50)" />
        </svg>
    </div>
</template>
<script>
export default {
    props: {
        size: {
            type: Number,
            default: 32,
        },
    },
};
</script>
<style scoped>
.spin {
    animation-duration: 0.4s;
    animation-name: spin;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
