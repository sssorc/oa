<script setup>
import { ref, onMounted } from 'vue';
import RiskFreeResult from '@/components/RiskFreeResult.vue';
import InputField from '@/components/InputField.vue';
import InputLabel from '@/components/InputLabel.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import _ from 'lodash';
import helpers from '@/mixins/helpers.js';
import { usePageTitle } from '@/composables/usePageTitle';
import { trackCalculatorSubmit } from '@/utils/analytics';

// Extract helper methods we need
const { getPayout } = helpers.methods;

// Set page title immediately
usePageTitle(
    'Risk-Free Bet Calculator',
    'Calculate the optimal hedge amount for your risk-free bets. Our free calculator helps you maximize the value of your risk-free bet promotions while minimizing potential losses.'
);

// State
const oddsA = ref('');
const stakeA = ref('');
const oddsB = ref('');
const conversionPercent = ref(70);
const result = ref(false);
const loading = ref(false);

// Methods
function calculate() {
    if (!oddsA.value || !stakeA.value || !oddsB.value) return;

    // Track calculator submission
    trackCalculatorSubmit('risk_free');

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
    const hashAndParams = window.location.search;
    const queryString = hashAndParams.substring(1); // Remove the leading ?
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

onMounted(() => {
    calcFromUrl();
});
</script>

<template>
    <section class="relative mx-auto w-full max-w-7xl px-5 py-8">
        <h1 class="mb-6 font-mono text-xl">Risk-free Bet Calculator</h1>
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
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

                <div class="mt-2">
                    <SubmitButton :disabled="!oddsA || !stakeA || !oddsB" class="max-sm:w-full" :is-submitting="loading">Calculate Hedge</SubmitButton>
                </div>
            </form>

            <div v-if="result" class="max-w-[500px] md:min-w-[400px] md:flex-1">
                <RiskFreeResult :result="result" />
            </div>
        </div>
    </section>
</template>
