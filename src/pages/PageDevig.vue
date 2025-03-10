<script setup>
import { ref, computed, onMounted } from 'vue';
import { devig } from '@/api/cno';
import Navigation from '@/components/Navigation.vue';
import InputField from '@/components/InputField.vue';
import RadioField from '@/components/RadioField.vue';
import InputLabel from '@/components/InputLabel.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import DevigResults from '@/components/DevigResults.vue';

// State
const isSubmitting = ref(false);
const results = ref(false);
const errorMessage = ref(false);
const kellyBankroll = ref(1000);
const showImport = ref(false);
const sourceBook = ref('');
const freeBetType = ref(0);
const freeBetPercentage = ref('50');
const conversionRate = ref('70');

const inputs = ref({
    LegOdds: '',
    FinalOdds: '',
    Correlation_Text: '',
    Boost_Text: '',
    Boost_Type: 0,
    DevigMethod: 4,
    WorstCase_Multiplicative: 1,
    WorstCase_Additive: 1,
    WorstCase_Power: 1,
    WorstCase_Shin: 1,
    WeightedAverage_Multiplicative: 0,
    WeightedAverage_Additive: 0,
    WeightedAverage_Power: 0,
    WeightedAverage_Shin: 0,
});

const shareUrl = computed(() => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();

    if (inputs.value.FinalOdds) {
        params.append('finalOdds', encodeURIComponent(inputs.value.FinalOdds));
    }

    if (inputs.value.LegOdds) {
        params.append('legOdds', encodeURIComponent(inputs.value.LegOdds));
    }

    if (inputs.value.Boost_Text) {
        params.append('boost', inputs.value.Boost_Text);
    }

    return `${baseUrl}#/devig?${params.toString()}`;
});

// Methods
const getFinalOddsForRequest = (value) => {
    if (freeBetType.value == 0) {
        return encodeURIComponent(value);
    }

    let fbPercentage = Number(freeBetPercentage.value.replace(/\D/g, ''));
    let convRate = Number(conversionRate.value.replace(/\D/g, '')) / 100;
    let percentBack = (fbPercentage * convRate) / 100;
    let type = freeBetType.value == 1 ? 'r' : 'n';

    let out = `#=${value};${type}=${percentBack}x`;
    return encodeURIComponent(out);
};

const formatFinalOdds = () => {
    // remove comma and slash dangle
    inputs.value.FinalOdds = inputs.value.FinalOdds.replace(/[,/]$/, '');
};

const formatLegOdds = () => {
    // replace spaces with commas, remove comma and slash dangle
    inputs.value.LegOdds = inputs.value.LegOdds.replace(/\s+/g, ',').replace(/[,/]$/, '');
};

const round = (num, wholeNumber, decimals = 2) => {
    if (wholeNumber) {
        return Math.round(num);
    } else {
        const factor = Math.pow(10, decimals);
        return Math.round(num * factor) / factor;
    }
};

const getWcMethod = (code) => {
    if (code == 'wc:p') {
        return 'Power';
    }

    if (code == 'wc:p,m') {
        return 'Power + Multiplicative';
    }

    return false;
};

const getFairOdds = (odds) => {
    let plus = odds > 0 ? '+' : '';
    return plus + round(odds, true);
};

const getFinalOdds = (data) => {
    if ('Odds' in data) {
        return data.Odds;
    }

    if (inputs.value.Boost_Text && inputs.value.FinalOdds > 0) {
        return '+' + inputs.value.FinalOdds * (1 + inputs.value.Boost_Text / 100);
    }
};

const getLegData = (data) => {
    let legs = [];

    for (const key in data) {
        let obj = data[key];

        if (Object.hasOwnProperty.call(obj, 'MarketJuice')) {
            legs.push(obj);
        }
    }

    return legs;
};

const getJuice = (data) => {
    let juice = 0;
    let count = 0;

    for (const key in data) {
        let obj = data[key];

        if (Object.hasOwnProperty.call(obj, 'MarketJuice')) {
            juice += obj.MarketJuice;
            count += 1;
        }
    }

    return round((juice / count) * 100);
};

const areInputsUnchanged = () => {
    if (!results.value?.inputData) return false;

    const prevInputs = results.value.inputData;
    return (
        prevInputs.finalOdds === inputs.value.FinalOdds &&
        prevInputs.legOdds === inputs.value.LegOdds &&
        prevInputs.boost === (inputs.value.Boost_Text || null) &&
        prevInputs.correlation === (inputs.value.Correlation_Text || null) &&
        prevInputs.freeBetType === freeBetType.value &&
        prevInputs.freeBetPercentage === (freeBetType.value !== 0 ? freeBetPercentage.value : null) &&
        prevInputs.conversionRate === (freeBetType.value !== 0 ? conversionRate.value : null)
    );
};

const onSubmit = async () => {
    if (isSubmitting.value) return;

    // Return early if all inputs are the same as last submission
    if (areInputsUnchanged()) return;

    formatFinalOdds();
    formatLegOdds();
    errorMessage.value = false;

    if (!inputs.value.FinalOdds || !inputs.value.LegOdds) {
        return;
    }

    isSubmitting.value = true;

    const params = [];

    for (const key in inputs.value) {
        let value = inputs.value[key];

        if (key === 'FinalOdds') {
            let formatted = getFinalOddsForRequest(value);
            params.push(`${key}=${formatted}`);
        } else if (value || value === 0) {
            params.push(`${key}=${value}`);
        }
    }

    if (inputs.value.Correlation_Text) {
        params.push('Correlation_Bool=1');
    }

    if (inputs.value.Boost_Text) {
        params.push('Boost_Bool=1');
    }

    try {
        const data = await devig(params.join('&'));
        const finalData = data.Final;

        results.value = {
            inputLegs: inputs.value.LegOdds,
            finalOdds: getFinalOdds(finalData),
            fairOdds: getFairOdds(finalData.FairValue_Odds),
            legs: getLegData(data),
            juice: getJuice(data),
            hitPercentage: finalData.FairValue * 100,
            conversionPercentage: round(finalData.FB_Percentage * 100),
            ev: round(finalData.EV_Percentage * 100, false, 1),
            kellyFull: finalData.Kelly_Full,
            sourceBook: sourceBook.value,
            wcMethod: finalData.DevigMethod.split(':')[1] || finalData.DevigMethod,
            includeConversion: freeBetType.value === 0,
            inputData: {
                finalOdds: inputs.value.FinalOdds,
                legOdds: inputs.value.LegOdds,
                boost: inputs.value.Boost_Text || null,
                correlation: inputs.value.Correlation_Text || null,
                freeBetType: freeBetType.value,
                freeBetPercentage: freeBetType.value !== 0 ? freeBetPercentage.value : null,
                conversionRate: freeBetType.value !== 0 ? conversionRate.value : null,
            },
        };
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        isSubmitting.value = false;
    }
};

// Mounted logic
onMounted(() => {
    document.addEventListener('keydown', (event) => {
        if (showImport.value && event.key === 'Escape') {
            showImport.value = false;
        }
    });

    // Get the full hash portion including query params
    const hashAndParams = window.location.hash;
    // Split on ? to get just the query string
    const queryString = hashAndParams.split('?')[1];

    if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        let shouldAutoSubmit = false;

        const finalOdds = urlParams.get('finalOdds');
        if (finalOdds) {
            inputs.value.FinalOdds = decodeURIComponent(finalOdds);
            shouldAutoSubmit = true;
        }

        const legOdds = urlParams.get('legOdds');
        if (legOdds) {
            inputs.value.LegOdds = decodeURIComponent(legOdds);
            shouldAutoSubmit = true;
        }

        const boostPct = urlParams.get('boost');
        if (boostPct && !isNaN(boostPct)) {
            inputs.value.Boost_Text = boostPct;
            inputs.value.Boost_Bool = 1;
        }

        const correlation = urlParams.get('correlation');
        if (correlation) {
            inputs.value.Correlation_Text = correlation;
            inputs.value.Correlation_Bool = 1;
        }

        const fbType = urlParams.get('freeBetType');
        if (fbType && !isNaN(fbType)) {
            freeBetType.value = parseInt(fbType);
        }

        const fbPercentage = urlParams.get('freeBetPercentage');
        if (fbPercentage && !isNaN(fbPercentage)) {
            freeBetPercentage.value = fbPercentage;
        }

        const convRate = urlParams.get('conversionRate');
        if (convRate && !isNaN(convRate)) {
            conversionRate.value = convRate;
        }

        if (shouldAutoSubmit && inputs.value.FinalOdds && inputs.value.LegOdds) {
            onSubmit();
        }
    }
});
</script>

<template>
    <div>
        <section class="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 md:flex-row md:justify-between">
            <form @submit.prevent="onSubmit" class="grid max-w-xl gap-6 md:flex-1">
                <div class="flex items-center gap-4">
                    <div>
                        <InputLabel for="odds" required>Odds</InputLabel>
                        <InputField v-model="inputs.FinalOdds" type="text" id="odds" />
                    </div>
                    <div>
                        <label for="boost" class="font-mono text-sm">Boost %</label>
                        <InputField v-model="inputs.Boost_Text" type="tel" id="boost" class="mt-1" addon="%" />
                    </div>
                </div>

                <div>
                    <InputLabel for="legOdds" required>Leg Odds</InputLabel>
                    <InputField v-model="inputs.LegOdds" id="legOdds" type="text" required />
                </div>

                <div class="flex flex-col gap-4 lg:flex-row">
                    <div>
                        <InputLabel for="correlation">Correlation</InputLabel>
                        <InputField v-model="inputs.Correlation_Text" type="text" id="TextBoxCorrelation" />
                    </div>
                </div>
                <hr class="border-space/10" />

                <div class="flex flex-col items-start gap-x-8 gap-y-4 lg:flex-row">
                    <div>
                        <InputLabel for="freeBetCheckbox">Bonus Bet Returned</InputLabel>
                        <div class="mt-1 grid gap-2">
                            <RadioField v-model="freeBetType" id="freeBet0" :value="0">None</RadioField>
                            <RadioField v-model="freeBetType" id="freeBet1" :value="1">On Loss</RadioField>
                            <RadioField v-model="freeBetType" id="freeBet2" :value="2">Guaranteed</RadioField>
                        </div>
                    </div>
                    <div v-if="freeBetType !== 0" class="flex flex-wrap items-start gap-x-6 gap-y-4">
                        <div v-if="freeBetType !== 0">
                            <InputLabel for="freeBetPercentage">Amount (% of stake)</InputLabel>
                            <InputField v-model="freeBetPercentage" id="freeBetPercentage" class="mt-1 w-32" addon="%" />
                        </div>
                        <div v-if="freeBetType !== 0">
                            <InputLabel for="conversionRate">Conversion %</InputLabel>
                            <InputField v-model="conversionRate" id="conversionRate" class="mt-1 w-32" addon="%" />
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="mt-2">
                    <SubmitButton :disabled="!inputs.FinalOdds || !inputs.LegOdds" class="max-sm:w-full" :is-submitting="isSubmitting">Calculate EV</SubmitButton>
                </div>
                <!-- Error -->
                <div v-if="errorMessage" class="text-red">{{ errorMessage }}</div>
            </form>

            <div class="max-w-[420px] md:min-w-[320px] md:flex-1">
                <DevigResults :results="results" :bankroll="kellyBankroll" />
            </div>
        </section>

        <section class="mx-auto max-w-7xl px-5 text-right">
            <div class="bg-slate/10 inline-flex gap-4 p-3 shadow">
                <div class="w-32 text-left">
                    <InputLabel for="bankroll">Bankroll</InputLabel>
                    <div class="relative">
                        <InputField v-model="kellyBankroll" type="text" id="bankroll" addon="$" />
                    </div>
                </div>
            </div>
        </section>

        <section class="mx-auto mt-10 max-w-7xl px-5">
            <h5 class="border-jet text-space text-jet mb-3 border-b pb-2 font-mono font-bold">Usage Tips</h5>
            <ul class="marker:text-slate list-disc space-y-2 pl-4 text-sm marker:text-xs">
                <li>A comma separates legs</li>
                <li>A &quot;/&quot; symbol separates sides of a market</li>
                <li>The first number in a leg is the side of the market you are wagering on.</li>
                <li>If a leg has multiple sides in its market (e.g. superbowl winner), then separate all sides by a &quot;/&quot; symbol like this: +500/+250/+2000</li>
                <li>
                    More tips and help on the
                    <a
                        href="http://www.crazyninjamike.com/Public/sportsbooks/sportsbook_devigger_help.aspx"
                        target="_blank"
                        class="decoration-pink hover:decoration-pale-blue underline decoration-2 underline-offset-2 transition-colors duration-100"
                        >devigger help page</a
                    >
                </li>
            </ul>
        </section>
    </div>
</template>
