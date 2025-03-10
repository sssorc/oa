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
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();

    if (oddsA.value) params.set('oddsa', oddsA.value);
    if (stakeA.value) params.set('stakea', stakeA.value);
    if (oddsB.value) params.set('oddsb', oddsB.value);
    if (conversionPercent.value !== 100) params.set('refund', conversionPercent.value);

    return `${baseUrl}?${params.toString()}`;
});

// Methods
function calculate() {
    if (!oddsA.value || !stakeA.value || !oddsB.value) return;

    const stake = Number(stakeA.value);
    const odds = Number(oddsA.value);
    const hedgeOdds = Number(oddsB.value);
    const refundAmount = (stake * conversionPercent.value) / 100;
    const payoutA = getPayout(odds, stake);

    // Calculate stakeB such that profits are equal:
    // If A wins: payoutA - stakeA - stakeB
    // If A loses: (stakeB * 100/|oddsB|) + stakeB - stakeB + refundAmount
    // So: payoutA - stakeA - stakeB = (stakeB * 100/|oddsB|) + refundAmount

    const oddsB_decimal = Math.abs(hedgeOdds) / 100;
    let stakeB = Math.round((payoutA - stake - refundAmount) / (1 + 100 / Math.abs(hedgeOdds)));

    const payoutB = getPayout(hedgeOdds, stakeB);
    const profitA = payoutA - stake - stakeB;
    const profitB = payoutB - stakeB + refundAmount;
    const profitAvg = (profitA + profitB) / 2;

    result.value = {
        stakeA: stake,
        oddsA: oddsA.value,
        payoutA,
        profitA: Number(profitA.toFixed(2)),
        stakeB,
        oddsB: oddsB.value,
        payoutB,
        profitB: Number(profitB.toFixed(2)),
        percent: percentOf(stake, profitAvg),
    };

    loading.value = false;
    hasSearched.value = true;
}

function bookmarkPlay() {
    if (!hasSearched.value) return;

    if (viewingBookmark.value) {
        _.remove(bookmarks.value, (obj) => {
            return obj.id == `${oddsA.value}${oddsB.value}`;
        });

        viewingBookmark.value = false;
        return;
    }

    const bookmark = {
        id: `${oddsA.value}${oddsB.value}`,
        oddsA: oddsA.value,
        oddsB: oddsB.value,
        percent: result.value ? result.value.percent : 0,
        hedge: result.value ? result.value.stakeB : 0,
    };
    bookmarks.value.push(bookmark);
    viewingBookmark.value = true;
}

function calcFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const a = params.get('oddsa');
    const ax = params.get('stakea');
    const b = params.get('oddsb');
    const r = params.get('refund');

    if (a) oddsA.value = a;
    if (ax) stakeA.value = ax;
    if (b) oddsB.value = b;
    if (r) conversionPercent.value = r;

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
    <section class="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 md:flex-row md:items-start md:justify-between">
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

        <div class="max-w-[420px] md:min-w-[320px] md:flex-1">
            <RiskFreeResult :result="result" />
        </div>
    </section>
</template>
