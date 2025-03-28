<script setup>
import { computed, nextTick, ref, watch, onMounted } from 'vue';
import CopyUrlButton from './CopyUrlButton.vue';
const emit = defineEmits(['toggle-bookmark']);
import CopyForDiscordButton from './CopyForDiscordButton.vue';

const props = defineProps({
    results: {
        type: [Object, Boolean],
        required: true,
        validator(value) {
            if (value === false) return true;
            return value.inputData && typeof value.inputData === 'object';
        },
    },
    bankroll: {
        type: Number,
        required: true,
    },
    isBookmarked: {
        type: Boolean,
        default: false,
    },
});

const resultsContainer = ref(null);
const isAnimating = ref(false);
const isDoneAnimating = ref(false);

const backgroundColor = computed(() => {
    if (props.results.ev >= 0) {
        return 'from-green/40 to-ice-blue/40';
    } else {
        return 'bg-red/10 border-red';
    }
});

const shareUrl = computed(() => {
    if (!props.results || !props.results.inputData) return window.location.href;

    const baseUrl = window.location.origin + window.location.pathname;
    const { finalOdds, legOdds, boost, correlation, freeBetType, freeBetPercentage, conversionRate } = props.results.inputData;

    const params = new URLSearchParams();
    if (finalOdds) params.set('finalOdds', finalOdds);
    if (legOdds) params.set('legOdds', legOdds);
    if (boost) params.set('boost', boost);
    if (correlation) params.set('correlation', correlation);
    if (freeBetType) params.set('freeBetType', freeBetType);
    if (freeBetPercentage) params.set('freeBetPercentage', freeBetPercentage);
    if (conversionRate) params.set('conversionRate', conversionRate);

    return `${baseUrl}#/devig?${params.toString()}`;
});

const discordText = computed(() => {
    if (!props.results) return '';

    return `Odds: ${props.results.finalOdds}; **EV: ${props.results.ev}%**\n\n\`${props.results.inputLegs}\` (${props.results.juice}% juice)\n\nFV: ${props.results.fairOdds}; Method: worst-case (${props.results.wcMethod}); (QK = ${round(props.results.kellyFull / 4)}u, FB = ${props.results.conversionPercentage}%)\n\n[View/Edit Devig](${shareUrl.value})`;
});

const kellyStakeSize = computed(() => {
    if (!props.results) return '';

    const unit = props.bankroll / 100;
    const amount = unit * props.results.kellyFull * 0.25;

    return formatUSD(amount);
});

const evColor = computed(() => {
    if (props.results.ev >= 0) {
        return 'text-jet';
    } else {
        return 'text-red';
    }
});

const evDollars = computed(() => {
    if (!props.results) return '';

    const unit = props.bankroll / 100;
    const amount = unit * (props.results.kellyFull * 0.25) * (props.results.ev / 100);

    return formatUSD(amount);
});

function round(num, wholeNumber) {
    if (wholeNumber) {
        return Math.round(num);
    } else {
        return Math.round(num * 100) / 100;
    }
}

function formatUSD(number) {
    let dollarUS = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return dollarUS.format(number).replace('.00', '');
}

watch(
    () => props.results,
    async (newVal) => {
        if (!newVal) return;

        setTimeout(() => {
            isAnimating.value = true;
        }, 1);

        setTimeout(() => {
            isDoneAnimating.value = true;
            isAnimating.value = false;
        }, 400);

        // Wait for the next tick to ensure the component is rendered
        await nextTick();
        // Scroll the results into view with smooth behavior
        if (resultsContainer.value) {
            resultsContainer.value.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    },
    { immediate: true, deep: true }
);
</script>

<template>
    <div v-if="results" ref="resultsContainer">
        <div class="border-jet relative border font-mono shadow-md">
            <input type="hidden" ref="discordText" />
            <div
                class="outline-green pointer-events-none absolute inset-0 z-10 opacity-100 outline-0 transition-all duration-400"
                :class="{
                    '-top-2 -right-2 -bottom-2 -left-2 !opacity-0 outline-8': isAnimating,
                    hidden: isDoneAnimating,
                }"
            ></div>
            <div :class="backgroundColor" class="relative z-20 bg-linear-65 p-6">
                <div class="flex flex-wrap items-start justify-between gap-6">
                    <div class="text-left">
                        <div class="text-jet font-mono text-sm">EV</div>
                        <div :class="evColor" class="flex items-end text-6xl font-bold">
                            <div class="font-numbers tracking-tight">{{ results.ev }}</div>
                            <span class="ml-1 pb-1 text-2xl">%</span>
                        </div>
                        <div :class="evColor" class="flex items-end text-lg font-bold">
                            <div class="font-numbers tracking-tight">{{ evDollars }}</div>
                        </div>
                    </div>
                    <div v-if="results.ev >= 0" class="flex flex-col items-end">
                        <div class="text-left">
                            <div class="text-jet font-mono text-sm">QK</div>
                            <div class="font-numbers text-3xl font-semibold">{{ round(results.kellyFull / 4) }}u</div>
                        </div>
                        <div class="font-numbers text-right text-2xl">{{ kellyStakeSize }}</div>
                    </div>
                </div>

                <div class="mt-4">
                    <div class="font-mono text-xs">BB Conversion</div>
                    <div class="font-numbers text-lg font-bold">{{ results.conversionPercentage }}%</div>
                </div>
                <div class="mt-4 flex flex-wrap items-start gap-x-8 gap-y-4">
                    <div v-if="results.inputData.sharp">
                        <div class="font-mono text-xs">Devigged To</div>
                        <div class="font-mono text-sm leading-normal font-bold">{{ results.inputData.sharp }}</div>
                    </div>
                    <div>
                        <div class="font-mono text-xs tracking-tight">Input Legs</div>
                        <div class="font-mono text-sm leading-normal font-bold break-all">{{ results.inputLegs }}</div>
                    </div>
                </div>
                <div class="mt-8 flex flex-wrap justify-between gap-4">
                    <div class="text-left">
                        <div class="font-numbers font-bold">{{ results.finalOdds }}</div>
                        <div class="font-mono text-xs tracking-tight">Final Odds</div>
                    </div>
                    <div class="text-left">
                        <div class="font-numbers font-bold">{{ results.fairOdds }}</div>
                        <div class="font-mono text-xs tracking-tight">Fair Odds</div>
                    </div>
                    <div class="text-left">
                        <div class="font-numbers font-bold">{{ round(results.hitPercentage) }}%</div>
                        <div class="font-mono text-xs tracking-tight">Hit %</div>
                    </div>
                    <div class="text-left">
                        <div class="font-numbers font-bold">{{ results.juice }}%</div>
                        <div class="font-mono text-xs tracking-tight">Juice</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-2 flex justify-between gap-4">
            <CopyUrlButton :content="shareUrl" />
            <CopyForDiscordButton :content="discordText" />
            <button
                @click="emit('toggle-bookmark')"
                type="button"
                class="group hover:decoration-pale-blue flex cursor-pointer items-center gap-1 p-1 font-mono text-sm tracking-tighter underline decoration-transparent decoration-2 underline-offset-2 transition-colors duration-100"
            >
                bookmark
                <svg v-if="!isBookmarked" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
                    <path d="M6.01 2c-1.096 0-2 .903-2 1.998L4 22l8-3 8 3V4c0-1.093-.907-2-2-2H6.01zm0 2H18v15.113l-6-2.25-5.998 2.25L6.01 4z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
                    <path d="M6 2a2.002 2.002 0 0 0-2 2v18l8-3 8 3V4a2.003 2.003 0 0 0-2-2H6z" fill="currentColor" />
                </svg>
            </button>
        </div>
    </div>
</template>
