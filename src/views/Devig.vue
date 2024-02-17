<script>
import axios from 'axios';
import '@/assets/css/main.scss'
import Navigation from '@/components/Navigation.vue';
axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';


function copyToClipboard(text) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = 0;
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Unable to copy text to clipboard', err);
  }

  document.body.removeChild(textarea);
}

document.addEventListener('click', function(e) {
	var row = e.target.nodeName == 'TR' ? e.target : e.target.closest('TR');
	var out = 'AVG(';
	var odds = [];
	var cells = Array.from(row.children);

	for (var i = 3; i < cells.length; i++) {
		if (cells[i].innerHTML.match(/[+-]\d+/)) {
			odds.push(cells[i].innerHTML);
		}
	}

	out += odds.join(',') + ')';
	copyToClipboard(out);
}, { once: true } );

export default {
	components: {
		Navigation
	},
	data() {
		return {
			apiUrl: '//api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&Args=ev_p,fb_p,fo_o,kelly,dm&',
			showSettings: false,
			results: false,
			copied: false,
			errorMessage: false,
			kellyMultiplier: .25,
			kellyBankroll: 1000,
			useBoost: 0,
			showImport: false,
			importData: '',
			importDataType: 'firstBasket',
			sourceBook: '',
			inputs: {
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
			},
		}
	},
	computed: {
		kellyDollars() {
			if (!this.results) return '';
			return this.formatUSD(this.kellyBankroll * this.kellyMultiplier * this.results.kellyFull/100);
		},
		redditText() {
			if (!this.results) return '';

			return `Odds: ${this.results.finalOdds}; **EV: ${this.results.ev}%**\r\r\`${this.results.inputLegs}\` (${this.results.juice}% juice)\r\rFV: ${this.results.fairOdds}; Method: ${this.results.method}; (Full=${this.round(this.results.kellyFull)}u, 1/2=${this.round(this.results.kellyFull / 2)}u, 1/4=${this.round(this.results.kellyFull / 4)}u, FB = ${this.results.conversionPercentage}%)`
		}
	},
	mounted() {
		document.addEventListener('keydown', (event) => {
			if (this.showImport && event.key === 'Escape') {
				this.showImport = false;
			}
        });
	},
	methods: {
		formatLegOdds() {
			this.inputs.LegOdds = this.inputs.LegOdds.replace(/\s+/g, ',');
		},
		copyForReddit() {
			const textarea = this.$refs.redditText;
			textarea.select();			
			textarea.setSelectionRange(0, 99999);
			document.execCommand('copy');
			this.copied = true;

			setTimeout(() => {
				this.copied = false;
			}, 2000);
		},
		importFirstBasket() {
			// let data = this.importData;
			let data = this.importData;

			// Remove line breaks
			data = data.replace( /[\r\n]+/gm, "/" );

			// Remove numbers that don't have + or - in front
			data = data.replace(/[^+-\d]\d+/g, '');

			// Remove everything except numbers, +, and -
			data = data.replace(/[^\d\-\+\/]/g, '');

			// Remove multiple slashes with single slash
			data = data.replace(/\/{2,}/g, '/');

			// Remove "/" at start
			data = data.replace(/^\//, '');

			this.inputs.LegOdds = data;
		},
		importPastedData() {
			if (this.importDataType == 'firstBasket') {
				this.importFirstBasket();
			}

			this.showImport = false;
			this.importData = '';
		},
		openModal() {
			this.showImport = true;
			setTimeout(() => {
				this.$refs['importData'].focus();
			}, 100);
		},
		closeModal() {
			this.showImport = false;
		},
		formatUSD(number) {
			let dollarUS = Intl.NumberFormat("en-US", {
    			style: "currency",
    			currency: "USD",
			});

			return dollarUS.format(number).replace('.00', '');;
		},
		round(num, wholeNumber) {
			if (wholeNumber) {
				return Math.round(num);
			} else {
				return Math.round(num * 100) / 100;
			}
		},
		getWcMethod(code) {
			if (code == 'wc:p') {
				return 'Power';
			}

			if (code == 'wc:p,m') {
				return 'Power + Multiplicative';
			}

			return false;
		},
		getMethod(num) {
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
					return 'Worst Case'
					break;
				case 5:
					return 'Weighted Average';
					break;
				default:
					return 'Multiplicative';
					break;
			}
		},
		getFairOdds(odds) {
			let plus = odds > 0 ? '+' : ''; 
			return plus + this.round(odds, true);
		},
		getFinalOdds(data) {
			if ('Odds' in data) {
				return data.Odds;
			}
			
			if (this.useBoost && this.inputs.Boost_Text && this.inputs.FinalOdds > 0) {
				return '+' + this.inputs.FinalOdds * (1 + this.inputs.Boost_Text / 100);
			}
		},
		getLegData(data) {
			let legs = [];

			for (const key in data) {
				let obj = data[key];

				if (Object.hasOwnProperty.call(obj, 'MarketJuice')) {
					legs.push(obj)
				}
			}

			return legs;
		},
		getJuice(data) {
			let juice = 0;
			let count = 0;

			for (const key in data) {
				let obj = data[key];

				if (Object.hasOwnProperty.call(obj, 'MarketJuice')) {
					juice += obj.MarketJuice;
					count += 1;
				}
			}

			return this.round((juice / count) * 100);
		},
		getFairOddsFromPercent() {
			return 'todo';
		},
		onSubmit() {
			this.errorMessage = false;
			let params = [];
			this.results = false;

			for (const key in this.inputs) {
				let value = this.inputs[key];
				if (value || value == 0) {
					params.push(`${key}=${value}`);
				}
			}

			if (this.inputs.Correlation_Text) {
				params.push('Correlation_Bool=1');
			}

			if (this.useBoost) {
				params.push('Boost_Bool=1');
			}

			let finalUrl = this.apiUrl + params.join('&');
			
			axios.get(finalUrl).then((response) => {
				if ('message' in response.data) {
					this.errorMessage = response.data.message;
					return;
				}
				const data = response.data.Final;
				
				this.results = {
					method: this.getMethod(this.inputs.DevigMethod),
					inputLegs: this.inputs.LegOdds,
					finalOdds: this.getFinalOdds(data),
					fairOdds: this.getFairOdds(data.FairValue_Odds),
					legs: this.getLegData(response.data),
					juice: this.getJuice(response.data),
					hitPercentage: data.FairValue * 100,
					conversionPercentage: this.round(data.FB_Percentage * 100),
					ev: this.round(data.EV_Percentage * 100),
					kellyFull: data.Kelly_Full, 
					sourceBook: this.sourceBook,
					wcMethod: this.getWcMethod(data.DevigMethod)
				};
			}).catch((error) => {
				if ('message' in error) {
					this.errorMessage = error.message;
				} else {
					this.errorMessage = 'Error devigging. Re-check inputs.';
				}
			})
		},
	},
}

</script>

<template>
	<div class="devig">
		<div class="legacy">
			<Navigation/>
		</div>
		<section :class="{'show-settings': showSettings}" class="rel layout">
			<main>
				<div class="flex-split gap-16 mb-32">
					<h1><a href="http://www.crazyninjamike.com/Public/sportsbooks/sportsbook_calculator.aspx" style="text-decoration:none">CNM Devigger</a></h1>
					<button @click="showSettings = true" class="flex-center toggle-settings reset hide-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 512 512" fill="currentColor"><path d="M496 384H160v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h80v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h336c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160h-80v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h336v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h80c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160H288V48c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16C7.2 64 0 71.2 0 80v32c0 8.8 7.2 16 16 16h208v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h208c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16z"/></svg>
					</button>
				</div>
				<form @submit.prevent="onSubmit">
					<div class="grid gap-20">
						<!-- Odds/legs -->
						<div class="flex gap-16 wrap">
							<div class="field">
								<label for="">Final Odds<div class="asterisk">*</div></label>
								<input v-model="inputs.FinalOdds" type="text" required style="width:80px;"/>
							</div>
							<div class="field grow">
								<label for="">Leg Odds<div class="asterisk">*</div> <small>(Format: "+125/-130,+150/-180")</small></label>
								<div class="flex wrap gap-8">
									<input v-model="inputs.LegOdds" type="text" style="flex:1;" @blur="formatLegOdds" required/>
									<button type="button" class="btn btn-gray btn-small btn-show-import" @click.prevent="openModal">Paste data</button>
								</div>
							</div>
						</div>
						<div class="flex-top wrap gap-y-16 gap-x-32" style="min-height:66px;">
							<!-- Correlation -->
							<div class="correlation">
								<label>Correlation <small>(Format: &quot;0.2&quot; OR &quot;+326=+112,+134&quot;)</small></label>
								<input v-model="inputs.Correlation_Text" type="text" id="TextBoxCorrelation" />
							</div>

							<!-- Boost -->
							<div>
								<label>Boost</label>
								<div class="checkbox">
									<input v-model="useBoost" id="useBoost" type="checkbox" value="1"/>
									<label for="useBoost">Apply boost</label>
								</div>
							</div>
							<div v-if="useBoost">
								<label>Boost Type</label>
								<div class="radio">
									<input v-model="inputs.Boost_Type" id="RadioButtonBoostProfit" type="radio" value="0"/>
									<label class="" for="RadioButtonBoostProfit">Profit Boost</label>
								</div>
								<div class="radio mt-8">
									<input v-model="inputs.Boost_Type" id="boostType" type="radio" value="1"/>
									<label for="boostType">Profit + Stake</label>
								</div>
							</div>
							<div v-if="useBoost">
								<label for="boostPercent">Boost %</label>
								<input v-model="inputs.Boost_Text" type="text" id="boostPercent" style="width:80px;" />
							</div>
						</div>

						<!-- Source book -->
						<div class="field" style="max-width:200px">
								<label for="">Source book</label>
								<input v-model="sourceBook" type="text">
							</div>
					</div>
					
					<!-- Submit -->
					<input type="submit" class="btn submit reset mt-24" name="ButtonCalculate" value="Calculate" style="min-width: 170px"/>
					
					<!-- Error -->
					<div v-if="errorMessage" class="pad-20 mt-32 color-red border bc-red">{{ errorMessage }}</div>

					<!-- Results -->
					<div v-if="results" class="mt-40">
						<h2 class="mb-16">Results</h2>
						<div :class="{ 'bc-red bg-red-01': results.ev < 0, 'bc-green bg-green-01': results.ev > 0 }" class="results pad-20 border">
							<div class="results-top flex-split flex-top wrap gap-16">
								<div class="fs-14">
									<h3 class="mb-12">{{ results.method }} <small v-if="results.sourceBook" class="fs-16 op-50">(vs {{ sourceBook }})</small></h3>
									<div class="grid gap-8 pad-4">
										<div>Final Odds: <strong>{{ results.finalOdds }}</strong></div>
										<div>FB Conversion: <strong :class="{'color-green': results.conversionPercentage > 75}">{{ results.conversionPercentage }}%</strong></div>
										<hr>
										<div>Fair Value: <strong>{{ results.fairOdds }} ({{ this.round(results.hitPercentage) }}%)</strong></div>
										<div>Market Juice: <strong>{{ results.juice }}%</strong></div>
										<div>Legs: <strong>{{ results.inputLegs }}</strong></div>
									</div>
								</div>
								<div class="flex wrap gap-x-20 gap-y-16 results-ev">
									<div :class="{'bg-green-01': results.ev >= 0, 'bg-red-01': results.ev < 0}" class="item item-ev">
										<div :class="{'color-green': results.ev >= 0, 'color-red': results.ev < 0}" class="number">{{ results.ev }}%</div>
										<label>EV</label>
									</div>
									<div class="item item-kelly flex gap-24" v-if="results.ev > 0">
										<div>
											<div class="number">{{ kellyDollars }}</div>
											<label>{{ kellyMultiplier }} Kelly</label>
										</div>
										<div class="grid gap-4 item-units fs-13">
											<div class="lh-15"><span class="color-blue-07">Full:</span> {{ round(results.kellyFull)}}u</div>
											<div class="lh-15"><span class="color-blue-07">Half:</span> {{ round(results.kellyFull/2)}}u</div>
											<div class="lh-15"><span class="color-blue-07">Quarter:</span> {{ round(results.kellyFull/4)}}u</div>
										</div>
									</div>
								</div>
							</div>

							<!-- TODO -->
							<!-- <div v-for="(leg, index) in results.legs" :key="`leg${index}`" class="results-legs flex gap-12 mt-32">
								<table class="leg">
									<th colspan="2">Leg {{ index + 1 }} ({{ leg.Odds }})</th>
									<tr>
										<td>Market Juice</td>
										<td>{{ this.round(leg.MarketJuice * 100) }}%</td>
									</tr>
									<tr>
										<td>Fair Value</td>
										<td>{{ getFairOddsFromPercent(leg.FairValue) }} ({{ round(leg.FairValue * 100) }}%)</td>
									</tr>
								</table>
							</div> -->
						</div>

						<div class="mt-16 flex-right gap-16">
							<div v-if="copied" class="fs-14 color-blue">Copied to clipboard</div>
							<button class="btn btn-small btn-gray" @click.prevent="copyForReddit">Copy for reddit</button>
							<textarea class="reddit-text" ref="redditText" :value="redditText"></textarea>
						</div>
					</div>
				</form>
			</main>

			<aside>
				<div class="flex-split gap-16 mb-20">
					<h3>Settings</h3>
					<button @click="showSettings = false" class="flex-center toggle-settings reset hide-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="15" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
					</button>
				</div>
				
				<!-- Method -->
				<h5 class="mb-12">Devig Method</h5>
				<div class="grid gap-8">
					<div class="flex gap-8 radio">
						<input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_0" type="radio" :value="0" /><label for="RadioButtonListDevigMethod_0">Multiplicative/Traditional</label>
					</div>
					<div class="flex gap-8 radio">
						<input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_1" type="radio" :value="1" /><label for="RadioButtonListDevigMethod_1">Additive</label>
					</div>
					<div class="flex gap-8 radio">
						<input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_2" type="radio" :value="2" /><label for="RadioButtonListDevigMethod_2">Power</label>
					</div>
					<div class="flex gap-8 radio">
						<input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_3" type="radio" :value="3" /><label for="RadioButtonListDevigMethod_3">Shin</label>
					</div>
					<div class="flex gap-8 radio">
						<input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_4" type="radio" :value="4" /><label for="RadioButtonListDevigMethod_4">Worst-case</label>
					</div>
					<div class="flex gap-8 radio">
						<input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_5" type="radio" :value="5" /><label for="RadioButtonListDevigMethod_5">Weighted Average</label>
					</div>
					<!-- <div class="flex gap-8 radio">
						<input v-model="inputs.DevigMethod" id="RadioButtonListDevigMethod_6" type="radio" value="showall" /><label for="RadioButtonListDevigMethod_6">Show All</label>
					</div> -->
				</div>

				<!-- Kelly -->
				<div class="flex gap-16 pt-16 mt-16 border-top">
					<div>
						<label for="kellyMultiplier">Kelly Multiplier</label>
						<input v-model="kellyMultiplier" type="text" id="kellyMultiplier" class="small"/>
					</div>
					<div>
						<label for="kellyBankroll">Kelly Bank Roll</label>
						<input v-model="kellyBankroll" type="text" id="kellyBankroll" class="small" />
					</div>
				</div>

				<!-- Worst-case settings -->
				<div v-if="inputs.DevigMethod == 4" class="mt-16 border-top pt-16">
					<h5 class="mb-12">Methods to check with</h5>
					<div class="grid gap-8" id="CheckBoxListWorstCaseMethodSettings">
						<div class="flex gap-8 checkbox">
							<input v-model="inputs.WorstCase_Multiplicative" id="WorstCase_Multiplicative" type="checkbox" true-value="1" false-value="0"/>
							<label for="WorstCase_Multiplicative">Multiplicative/Traditional Method</label>
						</div>
						<div class="flex gap-8 checkbox">
							<input v-model="inputs.WorstCase_Additive" id="WorstCase_Additive" type="checkbox" true-value="1" false-value="false"/>
							<label for="WorstCase_Additive">Additive Method</label>
						</div>
						<div class="flex gap-8 checkbox">
							<input v-model="inputs.WorstCase_Power" id="WorstCase_Power" type="checkbox" true-value="1" false-value="false"/>
							<label for="WorstCase_Power">Power Method</label>
						</div>
						<div class="flex gap-8 checkbox">
							<input v-model="inputs.WorstCase_Shin" id="WorstCase_Shin" type="checkbox" true-value="1" false-value="false"/>
							<label for="WorstCase_Shin">Shin Method</label>
						</div>
					</div>
				</div>

				<!-- Weighted average settings -->
				<div v-if="inputs.DevigMethod == 5" class="mt-16 border-top pt-16">
					<h5 class="mb-12">Method Weights</h5>
					<div class="grid sm-2s gap-8">
						<div>
							<label for="">Multiplicative/Traditional</label>
							<input v-model="inputs.WeightedAverage_Multiplicative" type="text" id="TextBoxMultiplicativeWeight" class="small" style="width:80px;"/> %
						</div>
						<div>
							<label for="">Additive</label>
							<input v-model="inputs.WeightedAverage_Additive" name="TextBoxAdditiveWeight" type="text" id="TextBoxAdditiveWeight" class="small" style="width:80px;"/> %
						</div>
						<div>
							<label for="">Power</label>
							<input v-model="inputs.WeightedAverage_Power" name="TextBoxPowerWeight" type="text" id="TextBoxPowerWeight" class="small" style="width:80px;"/> %
						</div>
						<div>
							<label for="">Shin</label>
							<input v-model="inputs.WeightedAverage_Shin" name="TextBoxShinWeight" type="text" id="TextBoxShinWeight" class="small" style="width:80px;"/> %
						</div>
					</div>
					<p class="mt-16">Weights do not need to add up to exactly 100%, the calculator will use the ratio of the sum of the weights. Set to 0 to exclude a method.</p>
				</div>
				
				
				<!-- Misc settings -->
				<!-- <div class="mt-16 pt-16 border-top" id="CheckBoxListMiscSettings">
					<h5 class="mb-12">Misc Settings</h5>
					<div class="grid gap-8">
						<div class="checkbox">
							<input id="CheckBoxListMiscSettings_1" type="checkbox" name="CheckBoxListMiscSettings$1" value="Show Detailed Devig Info" /><label for="CheckBoxListMiscSettings_1">Show Detailed Devig Info</label>
						</div>
					</div>
				</div> -->

				<!-- Quick tips -->
				<div class="mt-16 pt-16 border-top">
					<h5 class="mb-12">Quick Tips</h5>
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
				<button @click="closeModal" class="close flex-center reset">
					<svg xmlns="http://www.w3.org/2000/svg" width="15" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
				</button>
				<h3 class="mb-8">Import Pasted data <small class="fs-14 op-60">(FanDuel)</small></h3>
				
				
				<!-- <div class="field">
					<label>Data Type</label>
					<div class="radio">
						<input v-model="importDataType" id="importDataTypeFirstBasket" type="radio" value="firstBasket"/>
						<label for="importDataTypeFirstBasket">First Basket/Goal</label>
					</div>
				</div> -->

				<textarea v-model="importData" ref="importData" id="importData" class="mt-24" style="height:300px;"></textarea>
				<div class="flex-right mt-24">
					<button class="btn btn-blue" @click="importPastedData">Import lines</button>
				</div>
			</div>
		</div>
	</div>
</template>