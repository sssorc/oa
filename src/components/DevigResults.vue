<script setup>
import { computed, nextTick, ref, watch, onMounted } from 'vue';

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
});

const emit = defineEmits(['update-inputs']);

const isAnimating = ref(false);
const isDoneAnimating = ref(false);
const copySuccess = ref(false);

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

    return `Odds: ${props.results.finalOdds}; **EV: ${props.results.ev}%**\n\n\`${props.results.inputLegs}\` (${props.results.juice}% juice)\n\nFV: ${props.results.fairOdds}; Method: worst-case (${props.results.wcMethod}); (FB = ${props.results.conversionPercentage}%)\n\n[View/Edit Devig](${shareUrl.value})`;
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

async function copyForDiscord() {
    if (copySuccess.value == 'discord') return;
    try {
        await navigator.clipboard.writeText(discordText.value);
        copySuccess.value = 'discord';

        setTimeout(() => {
            copySuccess.value = false;
        }, 1000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

async function copyUrl() {
    if (copySuccess.value == 'url') return;

    try {
        await navigator.clipboard.writeText(shareUrl.value);
        copySuccess.value = 'url';

        setTimeout(() => {
            copySuccess.value = false;
        }, 1000);
    } catch (err) {
        console.error('Failed to copy URL: ', err);
    }
}

watch(
    () => props.results,
    (newVal) => {
        if (!newVal) return;

        setTimeout(() => {
            isAnimating.value = true;
        }, 1);

        setTimeout(() => {
            isDoneAnimating.value = true;
            isAnimating.value = false;
        }, 400);
    },
    { immediate: true, deep: true }
);

// Parse URL parameters on mount
onMounted(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const inputData = {
        finalOdds: params.get('finalOdds'),
        legOdds: params.get('legOdds'),
        boost: params.get('boost'),
        correlation: params.get('correlation'),
        freeBetType: params.get('freeBetType'),
        freeBetPercentage: params.get('freeBetPercentage'),
        conversionRate: params.get('conversionRate'),
    };

    // Only emit if we have at least one parameter
    if (Object.values(inputData).some((value) => value !== null)) {
        // Clean up the object by removing null values
        const cleanInputData = Object.fromEntries(Object.entries(inputData).filter(([_, value]) => value !== null));
        emit('update-inputs', cleanInputData);
    }
});
</script>

<template>
    <div v-if="results">
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
                            <div class="tracking-tight">{{ results.ev }}</div>
                            <span class="ml-1 pb-1 text-2xl">% </span>
                        </div>
                    </div>
                    <div v-if="results.ev >= 0" class="flex flex-col items-end">
                        <div class="text-left">
                            <div class="text-jet font-mono text-sm">QK</div>
                            <div class="text-3xl font-semibold">{{ round(results.kellyFull / 4) }}u</div>
                        </div>
                        <div class="text-right text-2xl">{{ kellyStakeSize }}</div>
                    </div>
                </div>

                <div class="mt-4">
                    <div class="font-mono text-xs">BB Conversion</div>
                    <div class="text-lg font-bold">{{ results.conversionPercentage }}%</div>
                </div>
                <div class="mt-4">
                    <div class="font-mono text-xs">Input Legs</div>
                    <div class="font-mono text-sm leading-normal font-bold break-words">{{ results.inputLegs }}</div>
                </div>
                <div class="mt-8 flex flex-wrap justify-between gap-4">
                    <div class="text-left">
                        <div class="font-bold">{{ results.finalOdds }}</div>
                        <div class="font-mono text-xs tracking-tight">Final Odds</div>
                    </div>
                    <div class="text-left">
                        <div class="font-bold">{{ results.fairOdds }}</div>
                        <div class="font-mono text-xs tracking-tight">Fair Odds</div>
                    </div>
                    <div class="text-left">
                        <div class="font-bold">{{ round(results.hitPercentage) }}%</div>
                        <div class="font-mono text-xs tracking-tight">Hit %</div>
                    </div>
                    <div class="text-left">
                        <div class="font-bold">{{ results.juice }}%</div>
                        <div class="font-mono text-xs tracking-tight">Juice</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-2 flex justify-between gap-4">
            <button
                @click="copyUrl"
                type="button"
                :class="{ 'hover:decoration-pale-blue cursor-pointer': copySuccess !== 'url' }"
                class="p-1 font-mono text-sm tracking-tighter underline decoration-transparent decoration-2 underline-offset-2 transition-colors duration-100"
            >
                <span v-if="copySuccess == 'url'" class="flex items-center gap-1">
                    copied!
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" class="text-slate">
                        <path
                            fill="currentColor"
                            d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"
                        />
                    </svg>
                </span>
                <span v-else>copy url </span>
            </button>
            <button
                @click="copyForDiscord"
                type="button"
                :class="{ 'hover:decoration-pale-blue cursor-pointer': copySuccess !== 'discord' }"
                class="p-1 font-mono text-sm tracking-tighter underline decoration-transparent decoration-2 underline-offset-2 transition-colors duration-100"
            >
                <span v-if="copySuccess === 'discord'" class="flex items-center gap-1">
                    copied!
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" class="text-slate">
                        <path
                            fill="currentColor"
                            d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"
                        />
                    </svg>
                </span>
                <span v-else>copy output</span>
            </button>
        </div>
    </div>
</template>
