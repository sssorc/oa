<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import CardBalanced from '@/components/CardBalanced.vue';
import Navigation from '@/components/Navigation.vue';
import ToggleField from '@/components/ToggleField.vue';
import _ from 'lodash';
import helpers from '@/mixins/helpers.js';
import '@/assets/legacy/style.scss';
import ArbitrageResults from '@/components/ArbitrageResults.vue';
import InputField from '@/components/InputField.vue';
import InputLabel from '@/components/InputLabel.vue';
import SubmitButton from '@/components/SubmitButton.vue';

// Extract helper methods we need
const { getPayout, getStake, getQueryString } = helpers.methods;

// State
const results = ref(false);
const loading = ref(false);
const stakeA = ref('');
const oddsA = ref('');
const oddsB = ref('');
const oddsC = ref('');

// Add shareLink computed property
const shareLink = computed(() => {
    const arr = [`stakea=${stakeA.value}`, `oddsa=${oddsA.value}`, `oddsb=${oddsB.value}`];

    if (oddsC.value) {
        arr.push(`oddsc=${oddsC.value}`);
    }

    const params = arr.join('&');
    const path = window.location.href.split('?');

    return `${path[0]}?${params}`;
});

// Add resetState function that was missing
const resetState = () => {
    oddsA.value = '';
    stakeA.value = '';
    oddsB.value = '';
    results.value = false;
};

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

// Methods
const bindShortcuts = () => {
    document.addEventListener('keydown', (event) => {
        event = event || window.event;
    });
};

const calculate = () => {
    if (!oddsA.value || !stakeA.value || !oddsB.value) return;

    // Return early if inputs haven't changed
    if (!isDirty.value) {
        loading.value = false;
        return;
    }

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
    const a = getQueryString('oddsa');
    const ax = getQueryString('stakea');
    const b = getQueryString('oddsb');
    const c = getQueryString('oddsc');

    oddsA.value = a;
    stakeA.value = ax;
    oddsB.value = b;
    oddsC.value = c || '';

    calculate();
};

// Lifecycle hooks
onMounted(() => {
    bindShortcuts();
    calcFromUrl();
});
</script>

<template>
    <div>
        <section class="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 lg:flex-row lg:justify-between">
            <form @submit.prevent="calculate" class="grid max-w-xl gap-6 md:flex-1">
                <div class="grid grid-cols-2 items-center gap-4 sm:flex">
                    <div class="sm:w-40">
                        <InputLabel for="oddsA" required>Odds A</InputLabel>
                        <InputField v-model="oddsA" type="text" id="oddsA" />
                    </div>
                    <div class="sm:w-44">
                        <InputLabel for="stakeA" required>Stake A</InputLabel>
                        <InputField v-model="stakeA" type="text" id="stakeA" addon="$" />
                    </div>
                </div>

                <div class="sm:w-40">
                    <InputLabel for="oddsB" required>Odds B</InputLabel>
                    <InputField v-model="oddsB" type="text" id="oddsB" required />
                </div>

                <div class="sm:w-40">
                    <InputLabel for="oddsC">Odds C</InputLabel>
                    <InputField v-model="oddsC" type="text" id="oddsC" />
                </div>

                <hr class="border-space/10" />

                <div class="mt-2">
                    <SubmitButton :disabled="!oddsA || !stakeA || !oddsB" class="max-sm:w-full" :is-submitting="loading">Calculate Hedge</SubmitButton>
                </div>
            </form>

            <ArbitrageResults :results="results" class="md:flex-1" />
        </section>
    </div>
</template>
