<script setup>
import { ref, onMounted } from 'vue';
import ConversionResult from '@/components/result/ConversionResult.vue';
import InputField from '@/components/ui/InputField.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import SubmitButton from '@/components/ui/SubmitButton.vue';
import { usePageTitle, calculatorSchema } from '@/composables/usePageTitle';
import { trackCalculatorSubmit } from '@/utils/analytics';
import { getPayout } from '@/utils/helpers';

// Set page title
const description = 'Free bonus bet and free bet calculator. Find the hedge that turns a sportsbook bonus bet or free bet into guaranteed cash and see your conversion rate.';
usePageTitle('Bonus Bet & Free Bet Calculator: Convert to Cash', description, {
    schema: {
        ...calculatorSchema('Bonus Bet Calculator', description, '/bonus-bet-calculator'),
        alternateName: 'Free Bet Calculator',
    },
    breadcrumbs: [{ name: 'Bonus Bet Calculator', path: '/bonus-bet-calculator' }],
});

// State
const oddsA = ref('');
const stakeA = ref('');
const oddsB = ref('');
const conversion = ref(false);
const loading = ref(false);
const hasSearched = ref(false);

// Methods
function calculate() {
    if (!oddsA.value || !stakeA.value || !oddsB.value) return;

    // Track calculator submission
    trackCalculatorSubmit('bonus_bet');

    const payoutA = stakeA.value * (oddsA.value / 100);
    const o = (oddsB.value * -1) / 100;
    let stakeB = Math.round((payoutA * o) / (1 + o));
    const payoutB = Number(getPayout(Number(oddsB.value), stakeB));
    const profitA = payoutA - stakeB;
    const profitB = payoutB - stakeB;
    const profitAvg = (profitA + profitB) / 2;

    conversion.value = {
        stakeA: Number(stakeA.value),
        oddsA: oddsA.value,
        payoutA,
        profitA: Number(profitA.toFixed(2)),
        stakeB,
        oddsB: oddsB.value,
        payoutB,
        profitB: Number(profitB.toFixed(2)),
        percent: percentOf(stakeA.value, profitAvg),
    };

    loading.value = false;
    hasSearched.value = true;
}

function calcFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const a = params.get('oddsa');
    const ax = params.get('stakea');
    const b = params.get('oddsb');

    if (a) oddsA.value = a;
    if (ax) stakeA.value = ax;
    if (b) oddsB.value = b;

    if (oddsA.value && stakeA.value && oddsB.value) {
        calculate();
    }
}

// Lifecycle
onMounted(() => {
    calcFromUrl();
});

function percentOf(a, b) {
    return (b / a) * 100;
}
</script>

<template>
    <section class="relative mx-auto w-full max-w-7xl px-5 py-8">
        <h1 class="mb-6 font-mono text-xl">Bonus Bet &amp; Free Bet Calculator</h1>
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <form @submit.prevent="calculate" class="grid max-w-xl gap-6 md:flex-1">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div class="sm:w-44">
                        <InputLabel for="stakeA" required>Bonus Bet Amount</InputLabel>
                        <InputField v-model="stakeA" type="text" id="stakeA" addon="$" />
                    </div>
                    <div class="sm:w-44">
                        <InputLabel for="oddsA" required>Bonus Bet Odds</InputLabel>
                        <InputField v-model="oddsA" type="text" id="oddsA" />
                    </div>
                </div>

                <div class="sm:w-44">
                    <InputLabel for="oddsB" required>Hedge Odds</InputLabel>
                    <InputField v-model="oddsB" type="text" id="oddsB" required />
                </div>

                <div class="mt-2">
                    <SubmitButton :disabled="!oddsA || !stakeA || !oddsB" class="max-sm:w-full" :is-submitting="loading">Calculate Hedge</SubmitButton>
                </div>
            </form>

            <div v-if="conversion" class="max-w-[420px] md:min-w-[320px] md:flex-1">
                <ConversionResult :result="conversion" />
            </div>
        </div>
    </section>
    <section class="prose mx-auto mt-10 max-w-7xl px-5">
        <h2>How to use</h2>
        <p>Use the bonus bet calculator to find how much cash to bet on the other side of a bonus bet or free bet to guarantee a profit.</p>
        <ul>
            <li>Enter the bonus bet amount, your bonus bet odds, and the hedge odds</li>
            <li>Results show both bets and your conversion rate</li>
            <li>Plus signs are optional in odds fields</li>
        </ul>

        <h2>Bonus bets vs. free bets</h2>
        <p>
            They're the same thing. Most US sportsbooks now call them bonus bets, while others (and most UK books) still say free bets. Either way, if it wins you get the winnings but not the stake,
            so this calculator works for both.
        </p>
        <p>
            A <em>risk-free bet</em> or second-chance bet is different. You bet real money and get a bonus bet back if you lose. Use the
            <RouterLink to="/risk-free-bet-calculator">risk-free bet calculator</RouterLink> for those.
        </p>

        <h2>How bonus bet conversion works</h2>
        <p>
            A bonus bet only pays out the winnings, not the stake. That makes long odds more valuable: bet the bonus on an underdog, then hedge the favorite with cash so you profit whichever side
            wins. Your conversion rate is that guaranteed profit as a percentage of the bonus amount.
        </p>
        <p>For example, a $100 bonus bet at +500 <a href="/bonus-bet-calculator?stakea=100&oddsa=500&oddsb=-600">hedged with $429 at -600</a> returns about $71 either way, a 71% conversion.</p>
        <p>
            Any conversion rate above 70% is considered good. You can consistently get a higher rate by using the
            <a href="https://chromewebstore.google.com/detail/cno-parlay-buddy/hcpaaidgaenjoobhlbacpfnolcebefef?hl=en-US&utm_source=hedge_calc" target="_blank">Parlay Buddy</a> Chrome extension on the
            Crazy Ninja Odds <a href="https://crazyninjaodds.com/site/tools/positive-ev.aspx" target="_blank">Positive EV page</a>. A parlay of the top three legs is usually above 90%.
        </p>
    </section>
</template>
