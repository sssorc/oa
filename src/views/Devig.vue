<script setup>
import { ref, computed, onMounted } from 'vue';
import { devig } from '@/api/cno';
import Navigation from '@/components/Navigation.vue';
import InputField from '@/components/InputField.vue';
import RadioField from '@/components/RadioField.vue';
import InputLabel from '@/components/InputLabel.vue';

// State
const showSettings = ref(false);
const results = ref(false);
const copied = ref(false);
const errorMessage = ref(false);
const kellyMultiplier = ref(0.25);
const kellyBankroll = ref(1000);
const showImport = ref(false);
const importData = ref('');
const importDataType = ref('firstBasket');
const sourceBook = ref('');
const freeBetType = ref(0);
const freeBetPercentage = ref('50');
const conversionRate = ref('70');
const discordText = ref(null);

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

// Computed properties
const kellyEvDollars = computed(() => {
    if (!results.value) return '';
    return kellyStakeSize.value * (results.value.ev / 100);
});

const kellyStakeSize = computed(() => {
    if (!results.value) return '';
    return (kellyBankroll.value * kellyMultiplier.value * results.value.kellyFull) / 100;
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

const discordTextComputed = computed(() => {
    if (!results.value) return '';

    return `Odds: ${results.value.finalOdds}; **EV: ${results.value.ev}%**\n\n\`${results.value.inputLegs}\` (${results.value.juice}% juice)\n\nFV: ${results.value.fairOdds}; Method: ${results.value.method.toLowerCase()} (${
        results.value.wcMethod ? results.value.wcMethod.toLowerCase() : 'm'
    }); (FB = ${results.value.conversionPercentage}%)\n\n[View/Edit Devig](${shareUrl.value})`;
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

const copyForDiscord = () => {
    const textarea = discordText.value;
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    copied.value = true;

    setTimeout(() => {
        copied.value = false;
    }, 2000);
};

const importFirstBasket = () => {
    // let data = this.importData;
    let data = importData.value;

    // Remove line breaks
    data = data.replace(/[\r\n]+/gm, '/');

    // Remove numbers that don't have + or - in front
    data = data.replace(/[^+-\d]\d+/g, '');

    // Remove everything except numbers, +, and -
    data = data.replace(/[^\d\-\+\/]/g, '');

    // Remove multiple slashes with single slash
    data = data.replace(/\/{2,}/g, '/');

    // Remove "/" at start
    data = data.replace(/^\//, '');

    inputs.value.LegOdds = data;
};

const importPastedData = () => {
    if (importDataType.value == 'firstBasket') {
        importFirstBasket();
    }

    showImport.value = false;
    importData.value = '';
};

const openModal = () => {
    showImport.value = true;
    setTimeout(() => {
        importData.value.focus();
    }, 100);
};

const closeModal = () => {
    showImport.value = false;
};

const formatUSD = (number) => {
    let dollarUS = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return dollarUS.format(number).replace('.00', '');
};

const round = (num, wholeNumber) => {
    if (wholeNumber) {
        return Math.round(num);
    } else {
        return Math.round(num * 100) / 100;
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

const getMethod = (num) => {
    switch (num) {
        case 0:
            return 'Multiplicative';
            break;
        case 1:
            return 'Additive';
            break;
        case 2:
            return 'Power';
            break;
        case 3:
            return 'Shin';
            break;
        case 4:
            return 'Worst Case';
            break;
        case 5:
            return 'Weighted Average';
            break;
        default:
            return 'Multiplicative';
            break;
    }
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

const getFairOddsFromPercent = () => {
    return 'todo';
};

const onSubmit = async () => {
    formatFinalOdds();
    formatLegOdds();
    errorMessage.value = false;
    results.value = false;

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
            method: getMethod(inputs.value.DevigMethod),
            inputLegs: inputs.value.LegOdds,
            finalOdds: getFinalOdds(finalData),
            fairOdds: getFairOdds(finalData.FairValue_Odds),
            legs: getLegData(data),
            juice: getJuice(data),
            hitPercentage: finalData.FairValue * 100,
            conversionPercentage: round(finalData.FB_Percentage * 100),
            ev: round(finalData.EV_Percentage * 100),
            kellyFull: finalData.Kelly_Full,
            sourceBook: sourceBook.value,
            wcMethod: getWcMethod(finalData.DevigMethod),
            includeConversion: freeBetType.value === 0,
        };
    } catch (error) {
        errorMessage.value = error.message;
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
        console.log('params', urlParams);
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
        }

        if (shouldAutoSubmit && inputs.value.FinalOdds && inputs.value.LegOdds) {
            onSubmit();
        }
    }
});
</script>

<template>
    <div class="devig">
        <Navigation />
        <section class="relative mx-auto max-w-7xl gap-8 px-5 py-8 md:grid md:grid-cols-10">
            <main class="md:col-span-6 lg:col-span-7">
                <form @submit.prevent="onSubmit" class="grid gap-6">
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

                    <div class="flex flex-col gap-4 lg:flex-row">
                        <div class="flex-grow lg:max-w-sm">
                            <InputLabel for="legOdds" required>Leg Odds</InputLabel>
                            <InputField v-model="inputs.LegOdds" id="legOdds" type="text" required />
                        </div>

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
                        <div v-if="freeBetType !== 0" class="flex items-start gap-x-6 gap-y-4">
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
                        <input
                            type="submit"
                            class="from-pale-blue to-ice-blue text-jet cursor-pointer bg-linear-65 from-40% px-8 py-3 font-mono tracking-wide shadow transition-all duration-100 hover:from-10% active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                            name="ButtonCalculate"
                            value="Calculate EV"
                            style="min-width: 170px"
                        />
                    </div>
                    <!-- Error -->
                    <div v-if="errorMessage" class="pad-20 color-red bc-red mt-8 border">{{ errorMessage }}</div>
                </form>

                <!-- Results -->
                <div v-if="results" class="mt-10">
                    <h2 class="mb-4">Results</h2>
                    <div
                        :class="{ 'bc-red bg-red-01': results.ev < 0, 'bc-green bg-green-01': results.ev > 0 }"
                        class="results flex flex-col gap-6 border p-6 lg:flex-row lg:items-start lg:justify-between"
                    >
                        <div class="results-ev flex flex-wrap gap-x-5 gap-y-4 lg:order-last">
                            <div :class="{ 'bg-green-01': results.ev >= 0, 'bg-red-01': results.ev < 0 }" class="item item-ev">
                                <div :class="{ 'color-green': results.ev >= 0, 'color-red': results.ev < 0 }" class="number text-right">{{ results.ev }}%</div>
                                <div class="mt-1 flex items-center justify-between gap-2 text-xs font-semibold">
                                    <div v-if="results.ev > 0">{{ formatUSD(kellyEvDollars) }}</div>
                                    <div class="align-right">EV</div>
                                </div>
                            </div>
                            <div class="item item-kelly flex items-center gap-6" v-if="results.ev > 0">
                                <div>
                                    <div class="number">{{ formatUSD(kellyStakeSize) }}</div>
                                    <div class="mt-1 text-xs font-semibold">{{ kellyMultiplier }} Kelly</div>
                                </div>
                                <div class="item-units fs-13 grid gap-1">
                                    <div class="lh-15"><span class="text-slate-800">Full:</span> {{ round(results.kellyFull) }}u</div>
                                    <div class="lh-15"><span class="text-slate-800">Half:</span> {{ round(results.kellyFull / 2) }}u</div>
                                    <div class="lh-15"><span class="text-slate-800">Quarter:</span> {{ round(results.kellyFull / 4) }}u</div>
                                </div>
                            </div>
                        </div>
                        <div class="results-top flex flex-wrap items-start justify-between gap-4">
                            <div class="fs-14">
                                <h3 class="mb-3">
                                    {{ results.method }}
                                </h3>
                                <div class="pad-4 grid gap-2">
                                    <div>
                                        Final Odds: <strong>{{ results.finalOdds }}</strong>
                                    </div>
                                    <div v-if="results.includeConversion">
                                        FB Conversion: <strong :class="{ 'color-green': results.conversionPercentage > 75 }">{{ results.conversionPercentage }}%</strong>
                                    </div>
                                    <hr />
                                    <div>
                                        Fair Value: <strong>{{ results.fairOdds }} ({{ round(results.hitPercentage) }}%)</strong>
                                    </div>
                                    <div>
                                        Market Juice: <strong>{{ results.juice }}%</strong>
                                    </div>
                                    <div>
                                        Legs: <strong>{{ results.inputLegs }}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 flex items-center justify-end gap-4">
                        <div v-if="copied" class="fs-14 text-slate-700">Copied to clipboard</div>
                        <button
                            class="cursor-pointer rounded-sm bg-gray-200 px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 hover:bg-slate-100 hover:ring-slate-300"
                            @click.prevent="copyForDiscord"
                        >
                            Copy for discord
                        </button>
                        <textarea class="discord-text" ref="discordText" :value="discordTextComputed"></textarea>
                    </div>
                </div>
            </main>

            <aside
                :class="{ 'max-md:hidden': !showSettings }"
                class="fixed top-11 right-0 bottom-0 left-0 z-20 bg-gray-100 px-5 py-8 md:static md:col-span-4 md:rounded-sm md:ring-1 md:ring-gray-300 lg:col-span-3"
            >
                <div class="mb-5 flex items-center justify-between gap-4">
                    <h3>Settings</h3>
                    <button @click="showSettings = false" class="text-primary flex h-10 w-10 cursor-pointer items-center justify-center hover:opacity-70 md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M3 3L13 13M3 13L13 3" />
                        </svg>
                    </button>
                </div>

                <!-- Weighted average settings -->
                <div v-if="inputs.DevigMethod == 5" class="border-top mt-4 pt-4">
                    <h5 class="mb-3">Method Weights</h5>
                    <div class="sm-2s grid gap-2">
                        <div>
                            <label for="">Multiplicative/Traditional</label>
                            <InputField v-model="inputs.WeightedAverage_Multiplicative" type="text" id="TextBoxMultiplicativeWeight" class="small" style="width: 80px" /> %
                        </div>
                        <div>
                            <label for="">Additive</label>
                            <InputField v-model="inputs.WeightedAverage_Additive" name="TextBoxAdditiveWeight" type="text" id="TextBoxAdditiveWeight" class="small" style="width: 80px" /> %
                        </div>
                        <div>
                            <label for="">Power</label>
                            <InputField v-model="inputs.WeightedAverage_Power" name="TextBoxPowerWeight" type="text" id="TextBoxPowerWeight" class="small" style="width: 80px" /> %
                        </div>
                        <div>
                            <label for="">Shin</label>
                            <InputField v-model="inputs.WeightedAverage_Shin" name="TextBoxShinWeight" type="text" id="TextBoxShinWeight" class="small" style="width: 80px" /> %
                        </div>
                    </div>
                    <p class="mt-4">Weights do not need to add up to exactly 100%, the calculator will use the ratio of the sum of the weights. Set to 0 to exclude a method.</p>
                </div>

                <!-- Quick tips -->
                <div class="border-top mt-4 pt-4">
                    <h5 class="mb-3">Quick Tips</h5>
                    <ul>
                        <li>- A comma separates legs</li>
                        <li>- A &quot;/&quot; symbol separates sides of a market</li>
                        <li>- The first number in a leg is the side of the market you are wagering on.</li>
                        <li>- If a leg has multiple sides in its market (e.g. superbowl winner), then separate all sides by a &quot;/&quot; symbol like this: +500/+250/+2000</li>
                        <li>- More tips and help <a href="http://www.crazyninjamike.com/Public/sportsbooks/sportsbook_devigger_help.aspx" target="_blank">here</a></li>
                    </ul>
                </div>
            </aside>
        </section>

        <section class="mx-auto my-6 max-w-7xl px-5">
            <div class="bg-space/10 flex gap-4 p-3">
                <div class="w-32">
                    <InputLabel for="bankroll">Bankroll</InputLabel>
                    <div class="relative">
                        <InputField v-model="kellyBankroll" type="text" id="bankroll" addon="$" />
                    </div>
                </div>
                <div class="w-20">
                    <InputLabel for="multiplier">Kelly</InputLabel>
                    <InputField v-model="kellyMultiplier" type="text" id="multiplier" />
                </div>
            </div>
        </section>
    </div>
</template>
