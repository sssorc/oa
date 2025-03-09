<script setup>
import { computed } from 'vue';
const props = defineProps({
    results: {
        type: Object,
        required: true,
    },
    bankroll: {
        type: Number,
        required: true,
    },
});

const round = (num, wholeNumber) => {
    if (wholeNumber) {
        return Math.round(num);
    } else {
        return Math.round(num * 100) / 100;
    }
};

const formatUSD = (number) => {
    let dollarUS = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return dollarUS.format(number).replace('.00', '');
};

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

const backgroundColor = computed(() => {
    if (props.results.ev >= 0) {
        return 'from-green/40 to-ice-blue/40';
    } else {
        return 'bg-red/10 border-red';
    }
});
</script>

<template>
    <div :class="backgroundColor" class="border-jet border bg-linear-65 p-6 font-mono">
        <div class="flex flex-wrap items-start justify-between gap-6">
            <div class="text-left">
                <div class="text-jet font-mono text-sm">EV</div>
                <div :class="evColor" class="flex items-end text-6xl font-bold">
                    <div>{{ results.ev }}</div>
                    <span class="ml-1 pb-1 text-2xl">% </span>
                </div>
            </div>
            <div v-if="results.ev >= 0" class="text-left">
                <div class="text-jet font-mono text-sm">QK</div>
                <div class="text-3xl font-semibold">{{ round(results.kellyFull / 4) }}u</div>
                <div class="text-right text-2xl">{{ kellyStakeSize }}</div>
            </div>
        </div>

        <div class="mt-4">
            <div class="font-mono text-xs">BB Conversion</div>
            <div class="text-lg font-bold">{{ results.conversionPercentage }}%</div>
        </div>
        <div class="mt-4">
            <div class="font-mono text-xs">Input</div>
            <div class="text-sm">{{ results.inputLegs }}</div>
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
</template>
