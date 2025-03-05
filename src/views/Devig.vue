<script setup>
import { ref, computed, onMounted } from 'vue';
import { devig } from '@/api/cno';
import Navigation from '@/components/Navigation.vue';
import InputField from '@/components/InputField.vue';
import RadioField from '@/components/RadioField.vue';

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
const freeBetPercentage = ref('50%');
const conversionRate = ref('70%');
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
		<div class="legacy">
			<Navigation />
		</div>
		<section :class="{ 'show-settings': showSettings }" class="rel layout">
			<main>
				<div class="flex justify-between items-center gap-4 mb-8">
					<h1 style="line-height: 30px">
						<a href="http://crazyninjamike.com/Public/sportsbooks/sportsbook_devigger.aspx" style="text-decoration: none">CNO Devigger</a>
						<div class="fs-14 lh-14 mt-2">via <a href="https://crazyninjaodds.com/Default.aspx" target="_blank">crazyninjaodds.com</a></div>
					</h1>

					<button @click="showSettings = true" class="flex items-center justify-center toggle-settings reset md:hidden">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 512 512" fill="currentColor">
							<path
								d="M496 384H160v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h80v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h336c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160h-80v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h336v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h80c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160H288V48c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16C7.2 64 0 71.2 0 80v32c0 8.8 7.2 16 16 16h208v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h208c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16z"
							/>
						</svg>
					</button>
				</div>
				<form @submit.prevent="onSubmit" class="grid gap-4">
					<div class="flex items-center gap-4">
						<div>
							<label for="odds"
								>Odds
								<div class="text-sm color-yellow pl-1 inline-block">*</div></label
							>
							<InputField v-model="inputs.FinalOdds" type="text" id="odds" />
						</div>
						<div>
							<label for="odds">Boost %</label>
							<InputField v-model="inputs.Boost_Text" type="tel" id="boostPercent" />
						</div>
					</div>

					<div class="flex flex-col sm:flex-row gap-4">
						<div class="sm:max-w-sm flex-grow">
							<label for=""
								>Leg Odds
								<div class="text-sm color-yellow pl-1 inline-block">*</div>
								<small>(Format: "+125/-130,+150/-180")</small></label
							>
							<InputField v-model="inputs.LegOdds" type="text" required />
						</div>

						<div>
							<label>Correlation <small>(Format: &quot;0.2&quot; OR &quot;+326=+112,+134&quot;)</small></label>
							<InputField v-model="inputs.Correlation_Text" type="text" id="TextBoxCorrelation" />
						</div>
					</div>

					<div class="flex items-start gap-y-4 gap-x-8">
						<div>
							<label>Free Bet Returned</label>
							<div class="grid gap-1">
								<RadioField v-model="freeBetType" id="freeBet0" :value="0">None</RadioField>
								<RadioField v-model="freeBetType" id="freeBet1" :value="1">On Loss</RadioField>
								<RadioField v-model="freeBetType" id="freeBet2" :value="2">Guaranteed</RadioField>
							</div>
						</div>
						<div v-if="freeBetType !== 0" class="flex items-center gap-4">
							<div v-if="freeBetType !== 0">
								<label for="freeBetPercentage">Free Bet Amount <small>(% of stake)</small></label>
								<input type="text" v-model="freeBetPercentage" id="freeBetPercentage" style="max-width: 200px" />
							</div>
							<div v-if="freeBetType !== 0">
								<label for="conversionRate">Free Bet Conversion Rate <small>(in %)</small></label>
								<input type="text" v-model="conversionRate" id="conversionRate" style="max-width: 200px" />
							</div>
						</div>
					</div>

					<!-- Source book -->
					<div class="max-w-sm">
						<label for="">Source book(s)</label>
						<input v-model="sourceBook" type="text" />
					</div>

					<!-- Submit -->
					<div class="mt-2">
						<input type="submit" class="btn submit reset mt-2" name="ButtonCalculate" value="Calculate" style="min-width: 170px" />
					</div>
					<!-- Error -->
					<div v-if="errorMessage" class="pad-20 mt-8 color-red border bc-red">{{ errorMessage }}</div>
				</form>

				<!-- Results -->
				<div v-if="results" class="mt-10">
					<h2 class="mb-4">Results</h2>
					<div :class="{ 'bc-red bg-red-01': results.ev < 0, 'bc-green bg-green-01': results.ev > 0 }" class="results pad-20 border">
						<div class="results-top flex justify-between items-start flex-wrap gap-4">
							<div class="fs-14">
								<h3 class="mb-3">
									{{ results.method }} <small v-if="results.sourceBook" class="fs-16 op-50">(vs {{ sourceBook }})</small>
								</h3>
								<div class="grid gap-2 pad-4">
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
							<div class="flex flex-wrap items-center gap-x-5 gap-y-4 results-ev">
								<div :class="{ 'bg-green-01': results.ev >= 0, 'bg-red-01': results.ev < 0 }" class="item item-ev">
									<div :class="{ 'color-green': results.ev >= 0, 'color-red': results.ev < 0 }" style="text-align: right" class="number">{{ results.ev }}%</div>
									<label class="flex items-center gap-2">
										<div v-if="results.ev > 0">{{ formatUSD(kellyEvDollars) }}</div>
										<div class="align-right">EV</div>
									</label>
								</div>
								<div class="item item-kelly flex items-center gap-6" v-if="results.ev > 0">
									<div>
										<div class="number">{{ formatUSD(kellyStakeSize) }}</div>
										<label>{{ kellyMultiplier }} Kelly</label>
									</div>
									<div class="grid gap-4 item-units fs-13">
										<div class="lh-15"><span class="color-blue-07">Full:</span> {{ round(results.kellyFull) }}u</div>
										<div class="lh-15"><span class="color-blue-07">Half:</span> {{ round(results.kellyFull / 2) }}u</div>
										<div class="lh-15"><span class="color-blue-07">Quarter:</span> {{ round(results.kellyFull / 4) }}u</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="mt-4 flex justify-end gap-4">
						<div v-if="copied" class="fs-14 color-blue">Copied to clipboard</div>
						<button class="btn btn-small btn-gray" @click.prevent="copyForDiscord">Copy for discord</button>
						<textarea class="discord-text" ref="discordText" :value="discordTextComputed"></textarea>
					</div>
				</div>
			</main>

			<aside>
				<div class="flex justify-between items-center gap-4 mb-5">
					<h3>Settings</h3>
					<button @click="showSettings = false" class="flex items-center justify-center h-9 w-9 p-2 rounded-sm bg-[#eeeaea] text-primary md:hidden">
						<svg xmlns="http://www.w3.org/2000/svg" width="15" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" /></svg>
					</button>
				</div>

				<!-- Method -->
				<h5 class="mb-3">Devig Method</h5>
				<div class="grid gap-2">
					<div class="flex items-center gap-2 radio"><input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_0" type="radio" :value="0" /><label for="RadioButtonListDevigMethod_0">Multiplicative/Traditional</label></div>
					<div class="flex items-center gap-2 radio"><input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_1" type="radio" :value="1" /><label for="RadioButtonListDevigMethod_1">Additive</label></div>
					<div class="flex items-center gap-2 radio"><input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_2" type="radio" :value="2" /><label for="RadioButtonListDevigMethod_2">Power</label></div>
					<div class="flex items-center gap-2 radio"><input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_3" type="radio" :value="3" /><label for="RadioButtonListDevigMethod_3">Shin</label></div>
					<div class="flex items-center gap-2 radio"><input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_4" type="radio" :value="4" /><label for="RadioButtonListDevigMethod_4">Worst-case</label></div>
					<div class="flex items-center gap-2 radio"><input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_5" type="radio" :value="5" /><label for="RadioButtonListDevigMethod_5">Weighted Average</label></div>
					<!-- <div class="flex items-center gap-2 radio">
						<input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_6" type="radio" value="showall" /><label for="RadioButtonListDevigMethod_6">Show All</label>
					</div> -->
				</div>

				<!-- Kelly -->
				<div class="flex items-center gap-4 pt-16 mt-4 border-top">
					<div>
						<label for="kellyMultiplier">Kelly Multiplier</label>
						<InputField v-model="kellyMultiplier" type="text" id="kellyMultiplier" class="small" />
					</div>
					<div>
						<label for="kellyBankroll">Kelly Bank Roll</label>
						<InputField v-model="kellyBankroll" type="text" id="kellyBankroll" class="small" />
					</div>
				</div>

				<!-- Weighted average settings -->
				<div v-if="inputs.DevigMethod == 5" class="mt-4 border-top pt-16">
					<h5 class="mb-3">Method Weights</h5>
					<div class="grid sm-2s gap-2">
						<div>
							<label for="">Multiplicative/Traditional</label>
							<input v-model="inputs.WeightedAverage_Multiplicative" type="text" id="TextBoxMultiplicativeWeight" class="small" style="width: 80px" /> %
						</div>
						<div>
							<label for="">Additive</label>
							<input v-model="inputs.WeightedAverage_Additive" name="TextBoxAdditiveWeight" type="text" id="TextBoxAdditiveWeight" class="small" style="width: 80px" /> %
						</div>
						<div>
							<label for="">Power</label>
							<input v-model="inputs.WeightedAverage_Power" name="TextBoxPowerWeight" type="text" id="TextBoxPowerWeight" class="small" style="width: 80px" /> %
						</div>
						<div>
							<label for="">Shin</label>
							<input v-model="inputs.WeightedAverage_Shin" name="TextBoxShinWeight" type="text" id="TextBoxShinWeight" class="small" style="width: 80px" /> %
						</div>
					</div>
					<p class="mt-4">Weights do not need to add up to exactly 100%, the calculator will use the ratio of the sum of the weights. Set to 0 to exclude a method.</p>
				</div>

				<!-- Quick tips -->
				<div class="mt-4 pt-16 border-top">
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

		<div v-show="showImport" class="modal">
			<div class="modal-content">
				<button @click="closeModal" class="close flex items-center justify-center reset">
					<svg xmlns="http://www.w3.org/2000/svg" width="15" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" /></svg>
				</button>
				<h3 class="mb-2">Import Pasted data <small class="fs-14 op-60">(FanDuel)</small></h3>

				<!-- <div class="field">
					<label>Data Type</label>
					<div class="radio">
						<input v-model="importDataType" id="importDataTypeFirstBasket" type="radio" value="firstBasket"/>
						<label for="importDataTypeFirstBasket">First Basket/Goal</label>
					</div>
				</div> -->

				<textarea v-model="importData" ref="importData" id="importData" class="mt-6" style="height: 300px"></textarea>
				<div class="flex items-end mt-6">
					<button class="btn btn-blue" @click="importPastedData">Import lines</button>
				</div>
			</div>
		</div>
	</div>
</template>
