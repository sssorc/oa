<script setup>
import { ref, computed, onMounted } from 'vue';
import ArbitrageResult from '@/components/result/ArbitrageResult.vue';
import InputField from '@/components/ui/InputField.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import SubmitButton from '@/components/ui/SubmitButton.vue';
import { usePageTitle, calculatorSchema } from '@/composables/usePageTitle';
import { trackCalculatorSubmit } from '@/utils/analytics';
import { getPayout, getStake } from '@/utils/helpers';

// Set page title
const description = 'Free hedge bet calculator. Enter your original bet and the hedge odds to see exactly how much to bet so you win the same amount either way.';
usePageTitle('Hedge Calculator: How Much to Hedge a Bet', description, {
    schema: calculatorSchema('Hedge Calculator', description, '/hedge-calculator'),
    breadcrumbs: [{ name: 'Hedge Calculator', path: '/hedge-calculator' }],
});

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
        <section class="prose mx-auto mt-10 max-w-7xl px-5">
            <h2>How to use</h2>
            <p>Use the hedge calculator to find how much to bet on the other side of a bet you've already placed.</p>
            <ul>
                <li>Enter your original bet amount and odds as <em>Stake A</em> and <em>Odds A</em></li>
                <li>Enter the odds of your hedge bet as <em>Odds B</em></li>
                <li>Enter additional odds as <em>Odds C</em> for a three-way hedge</li>
            </ul>
            <p>Plus signs are optional in odds fields.</p>

            <h2>How hedging works</h2>
            <p>
                Hedging means betting against a bet you already have. The calculator sizes the hedge so both outcomes pay the same, which locks in your result: a guaranteed profit if the odds have
                moved in your favor, or a smaller guaranteed loss if they haven't.
            </p>
            <p>
                For example, say you bet $100 at +150 and the other side is now -120. <a href="/hedge-calculator?stakeA=100&oddsA=150&oddsB=-120">Hedging $136</a> locks in about $13 of profit no
                matter who wins.
            </p>

            <h2>Should you hedge?</h2>
            <p>
                Usually not. A hedge trades expected value for lower variance, so if your original bet was a good one, hedging costs you money over time. Read
                <RouterLink to="/knowledge/when-to-hedge">when to hedge a bet</RouterLink> and <RouterLink to="/knowledge/why-hedging-lowers-ev">why hedging lowers EV</RouterLink> for the details. If
                you're betting both sides before either bet is placed, use the <RouterLink to="/arbitrage-calculator">arbitrage calculator</RouterLink>.
            </p>
        </section>
    </div>
</template>
