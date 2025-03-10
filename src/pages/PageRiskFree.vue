<script setup>
import { ref, computed } from 'vue';
import Navigation from '@/components/Navigation.vue';
import RiskFreeResult from '@/components/RiskFreeResult.vue';
import InputField from '@/components/InputField.vue';
import InputLabel from '@/components/InputLabel.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import _ from 'lodash';
import helpers from '@/mixins/helpers.js';

// Extract helper methods we need
const { getPayout } = helpers.methods;

// State
const viewingBookmark = ref(false);
const oddsA = ref('');
const stakeA = ref('');
const oddsB = ref('');
const conversionPercent = ref(70);
const result = ref(false);
const loading = ref(false);
const hasSearched = ref(false);
const bookmarks = ref([]);

// Computed
const shareUrl = computed(() => {
    const basePath = window.location.hash.split('?')[0] || '/#/risk-free';
    const params = new URLSearchParams();

    if (oddsA.value) params.set('oddsA', oddsA.value);
    if (stakeA.value) params.set('stakeA', stakeA.value);
    if (oddsB.value) params.set('oddsB', oddsB.value);
    if (conversionPercent.value !== 70) params.set('conversion', conversionPercent.value);

    return `${window.location.origin}${basePath}?${params.toString()}`;
});

// Methods
function calculate() {
    if (!oddsA.value || !stakeA.value || !oddsB.value) return;

    const conversion = Number(stakeA.value * (conversionPercent.value / 100));
    const payoutA = getPayout(Number(oddsA.value), Number(stakeA.value));
    const o = (Number(oddsB.value) * -1) / 100;
    let stakeB = Number(((payoutA - conversion) / (1 + 1 / o)).toFixed(2));

    stakeB = Math.round(stakeB);
    const payoutB = Number(getPayout(oddsB.value, stakeB));
    const profitB = Number(payoutB - stakeA.value - stakeB);

    result.value = {
        stakeA: stakeA.value,
        oddsA: oddsA.value,
        payoutA,
        profitA: payoutA - stakeA.value - stakeB,
        stakeB,
        oddsB: oddsB.value,
        payoutB,
        profitB,
        conversion,
        converstionRate: conversionPercent.value,
        profitAfterConversion: Number((profitB + conversion).toFixed(2)),
        conversionRate: conversionPercent.value,
    };
}

function calcFromUrl() {
    // Get the part after the hash and extract the query string
    const hashParts = window.location.hash.split('?');
    const queryString = hashParts.length > 1 ? hashParts[1] : '';
    const params = new URLSearchParams(queryString);

    const a = params.get('oddsA');
    const ax = params.get('stakeA');
    const b = params.get('oddsB');
    const c = params.get('conversion');

    if (a) oddsA.value = a;
    if (ax) stakeA.value = ax;
    if (b) oddsB.value = b;
    if (c) conversionPercent.value = c;

    if (oddsA.value && stakeA.value && oddsB.value) {
        calculate();
    }
}

// Helper functions
function percentOf(a, b) {
    return (b / a) * 100;
}

// Initialize
calcFromUrl();
</script>

<template>
    <section class="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 lg:flex-row lg:items-start lg:justify-between">
        <form @submit.prevent="calculate" class="grid max-w-xl gap-6 md:flex-1">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div class="sm:w-44">
                    <InputLabel for="stakeA" required>Risk-free Stake</InputLabel>
                    <InputField v-model="stakeA" type="text" id="stakeA" addon="$" />
                </div>
                <div class="sm:w-44">
                    <InputLabel for="oddsA" required>Odds</InputLabel>
                    <InputField v-model="oddsA" type="text" id="oddsA" />
                </div>
            </div>

            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div class="sm:w-44">
                    <InputLabel for="oddsB" required>Hedge Odds</InputLabel>
                    <InputField v-model="oddsB" type="text" id="oddsB" />
                </div>
            </div>

            <div class="sm:w-44">
                <InputLabel for="conversionPercent">Assumed Conversion %</InputLabel>
                <InputField v-model="conversionPercent" type="text" id="conversionPercent" addon="%" />
            </div>

            <hr class="border-space/10" />

            <div class="mt-2">
                <SubmitButton :disabled="!oddsA || !stakeA || !oddsB" class="max-sm:w-full" :is-submitting="loading">Calculate Hedge</SubmitButton>
            </div>
        </form>

        <div class="max-w-[500px] md:min-w-[400px] md:flex-1">
            <RiskFreeResult :result="result" />
        </div>
    </section>
</template>
