<script setup>
import { ref, computed, onMounted } from 'vue';
import ArbitrageResult from '@/components/result/ArbitrageResult.vue';
import InputField from '@/components/ui/InputField.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import SubmitButton from '@/components/ui/SubmitButton.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { trackCalculatorSubmit } from '@/utils/analytics';
import { getPayout, getStake } from '@/utils/helpers';

// Set page title
usePageTitle('Sports Betting Hedge Calculator', 'Calculate optimal bet size for your hedge. Find the perfect stake amounts for guaranteed profits.');

// State
const results = ref(false);
const loading = ref(false);
const stakeA = ref('');
const oddsA = ref('');
const oddsB = ref('');
const oddsC = ref('');

// Add this with other computed properties
const isDirty = computed(() => {
    if (!results.value) return true;

    return !(
        results.value.oddsA === oddsA.value &&
        results.value.oddsB === oddsB.value &&
        results.value.oddsC === oddsC.value &&
        results.value.stakeA === Number(stakeA.value) &&
        !!oddsC.value === !!results.value.stakeC
    );
});

const calculate = () => {
    if (!oddsA.value || !stakeA.value || !oddsB.value) return;

    // Return early if inputs haven't changed
    if (!isDirty.value) {
        loading.value = false;
        return;
    }

    // Track calculator submission
    trackCalculatorSubmit('hedge');

    // Reset stuff
    loading.value = true;
    let stakeC = 0;
    let stakeB = 0;

    // Get initial payout for bet A
    let payoutA = Number(getPayout(oddsA.value, stakeA.value));

    if (oddsC.value) {
        // For three-way arbitrage, we want equal profit across all outcomes
        // First calculate the stakes needed for equal payouts
        stakeB = getStake(oddsB.value, payoutA);
        stakeC = getStake(oddsC.value, payoutA);

        // Round stakes if needed
        stakeB = Math.round(stakeB);
        stakeC = Math.round(stakeC);
    } else {
        // Regular two-way arbitrage
        stakeB = getStake(oddsB.value, payoutA);
        stakeB = Math.round(stakeB);
    }

    const payoutB = Number(getPayout(oddsB.value, stakeB));
    const payoutC = oddsC.value ? Number(getPayout(oddsC.value, stakeC)) : 0;
    const sunk = Number(stakeA.value) + Number(stakeB) + Number(stakeC);
    const profitB = payoutB - sunk;
    const profitA = payoutA - sunk;
    const profitC = payoutC - sunk;

    // Push our card data
    results.value = {
        stakeA: Number(stakeA.value),
        stakeB,
        stakeC,
        oddsA: oddsA.value,
        oddsB: oddsB.value,
        oddsC: oddsC.value,
        payoutA,
        payoutB,
        payoutC,
        profitA,
        profitB,
        profitC,
        ev: oddsC.value ? (profitA + profitB + profitC) / 3 : (profitA + profitB) / 2,
    };

    // Done loading
    loading.value = false;
};

const calcFromUrl = () => {
    const hashAndParams = window.location.search;
    const queryString = hashAndParams.substring(1); // Remove the leading ?
    const params = new URLSearchParams(queryString);

    const a = params.get('oddsA');
    const ax = params.get('stakeA');
    const b = params.get('oddsB');
    const c = params.get('oddsC');

    oddsA.value = a;
    stakeA.value = ax;
    oddsB.value = b;
    oddsC.value = c || '';

    calculate();
};

// Lifecycle hooks
onMounted(() => {
    calcFromUrl();
});
</script>

<template>
    <div>
        <section class="relative mx-auto w-full max-w-7xl px-5 py-8">
            <h1 class="mb-6 font-mono text-xl">Hedge Calculator</h1>
            <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <form @submit.prevent="calculate" class="grid max-w-xl gap-6 md:flex-1">
                    <div class="grid grid-cols-2 items-center gap-4 sm:flex">
                        <div class="sm:w-44">
                            <InputLabel for="stakeA" required>Stake A</InputLabel>
                            <InputField v-model="stakeA" type="text" id="stakeA" addon="$" />
                        </div>
                        <div class="sm:w-44">
                            <InputLabel for="oddsA" required>Odds A</InputLabel>
                            <InputField v-model="oddsA" type="text" id="oddsA" />
                        </div>
                    </div>

                    <div class="sm:w-44">
                        <InputLabel for="oddsB" required>Odds B</InputLabel>
                        <InputField v-model="oddsB" type="text" id="oddsB" required />
                    </div>

                    <div class="sm:w-44">
                        <InputLabel for="oddsC">Odds C</InputLabel>
                        <InputField v-model="oddsC" type="text" id="oddsC" />
                    </div>

                    <div class="mt-2">
                        <SubmitButton :disabled="!oddsA || !stakeA || !oddsB" class="max-sm:w-full" :is-submitting="loading">Calculate Hedge</SubmitButton>
                    </div>
                </form>

                <ArbitrageResult :results="results" class="md:flex-1" />
            </div>
        </section>
        <section class="mx-auto mt-10 max-w-7xl px-5">
            <h5 class="border-jet font-space text-jet mb-3 border-b pb-2 font-mono font-bold">How to use</h5>
            <div class="space-y-3">
                <p>Use the above calculator to find the optimal amount to place for an arbitrage or hedge.</p>
                <ul class="marker:text-slate list-disc space-y-2 pl-4 text-sm marker:text-xs">
                    <li>Enter your first bet amount and odds as <em>Stake A</em> and <em>Odds A</em></li>
                    <li>Enter the odds of your second or hedge bet as <em>Odds B</em></li>
                    <li>Enter additional odds as <em>Odds C</em> for a three-way arb</li>
                </ul>
                <p>Plus signs are optional in odds fields.</p>
            </div>
        </section>
    </div>
</template>
