<script setup>
import { ref, onMounted } from 'vue';
import RiskFreeResult from '@/components/result/RiskFreeResult.vue';
import InputField from '@/components/ui/InputField.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import SubmitButton from '@/components/ui/SubmitButton.vue';
import { usePageTitle, calculatorSchema } from '@/composables/usePageTitle';
import { trackCalculatorSubmit } from '@/utils/analytics';
import { getPayout } from '@/utils/helpers';

// Set page title immediately
const description = 'Free risk-free bet calculator for second-chance bet promos. Find the hedge amount that locks in profit when a losing bet is refunded as a bonus bet.';
usePageTitle('Risk-Free Bet Calculator (Second-Chance Bets)', description, {
    schema: calculatorSchema('Risk-Free Bet Calculator', description, '/risk-free-bet-calculator'),
    breadcrumbs: [{ name: 'Risk-Free Bet Calculator', path: '/risk-free-bet-calculator' }],
});

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
    <section class="prose mx-auto mt-10 max-w-7xl px-5">
        <h2>How to use</h2>
        <p>Use the risk-free bet calculator to hedge a second-chance promo, where the sportsbook refunds a losing bet as a bonus bet.</p>
        <ul>
            <li>Enter your risk-free stake and odds</li>
            <li>Enter the odds for the other side as <em>Hedge Odds</em></li>
            <li>Set <em>Assumed Conversion %</em> to how much cash you expect to get from the refunded bonus bet (70% is a reasonable default)</li>
        </ul>
        <p>Plus signs are optional in odds fields.</p>

        <h2>How risk-free bets work</h2>
        <p>
            A risk-free bet isn't free money up front. You bet real cash, and if it loses, the sportsbook gives you a bonus bet for the amount you lost. To lock in value, you hedge the other side with
            a smaller amount, sized so you end up with the same profit whether your bet wins or loses and you convert the refund.
        </p>
        <p>Once you get the bonus bet back, use the <RouterLink to="/bonus-bet-calculator">bonus bet calculator</RouterLink> to convert it to cash.</p>
    </section>
</template>
