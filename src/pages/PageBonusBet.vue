<script setup>
import { ref, computed } from 'vue';
import ConversionResult from '@/components/ConversionResult.vue';
import InputField from '@/components/InputField.vue';
import InputLabel from '@/components/InputLabel.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import _ from 'lodash';
import { usePageTitle } from '@/composables/usePageTitle';

// Set page title
usePageTitle('Sports Betting Bonus Bet Calculator', 'Find the optimal hedge amount to conver your free bets or bonus bets into cash.');

// State
const viewingBookmark = ref(false);
const oddsA = ref('');
const stakeA = ref('');
const oddsB = ref('');
const conversion = ref(false);
const loading = ref(false);
const hasSearched = ref(false);
const bookmarks = ref([]);

// Computed
const shareUrl = computed(() => {
    const baseUrl = window.location.origin + '/bonus-bet';
    const params = new URLSearchParams();

    if (oddsA.value) params.set('oddsa', oddsA.value);
    if (stakeA.value) params.set('stakea', stakeA.value);
    if (oddsB.value) params.set('oddsb', oddsB.value);

    return `${baseUrl}?${params.toString()}`;
});

// Methods
function calculate() {
    console.log('calculate', oddsA.value, stakeA.value, oddsB.value);
    if (!oddsA.value || !stakeA.value || !oddsB.value) return;

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
calcFromUrl();

// Helper functions from mixins
function getPayout(odds, stake) {
    if (odds > 0) {
        return (odds / 100) * stake + stake;
    } else {
        return (100 / Math.abs(odds)) * stake + stake;
    }
}

function percentOf(a, b) {
    return (b / a) * 100;
}
</script>

<template>
    <section class="relative mx-auto w-full max-w-7xl px-5 py-8">
        <h1 class="mb-6 font-mono text-xl">Bonus Bet Conversion Calculator</h1>
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
</template>
