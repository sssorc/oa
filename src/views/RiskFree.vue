<script>
import CardRiskFree from '@/components/CardRiskFree.vue';
import Navigation from '@/components/Navigation.vue';
import helpers from '@/mixins/helpers';
import '@/assets/legacy/style.scss'

export default {
	name: 'RiskFree',
	mixins: [helpers],
	components: {
		CardRiskFree,
		Navigation,
	},
	data() {
		return {
			viewingBookmark: false,
			stakeA: '',
			oddsA: '',
			oddsB: '',
			loading: false,
			freshInput: true,
			hasSearched: false,
			rfbSafe: false,
			rfbRisky: false,
			conversionRate: 75,
		};
	},
	created() {
		this.calcFromUrl();	
	},
	computed: {
	},
	methods: {
		calcFromUrl() {
			const a = this.getQueryString('oddsa');
			const labelA = this.getQueryString('booka');
			const labelB = this.getQueryString('bookb');
			const ax = this.getQueryString('stakea');
			const b = this.getQueryString('oddsb');			
			const cr = this.getQueryString('cr');			
			this.oddsA = a;
			this.stakeA = ax;
			this.oddsB = b;
			if ( cr ) {
				this.conversionRate = cr;	
			}
			
			if ( labelA ) {
				this.labelA = decodeURIComponent(labelA);
			}
			
			if ( labelB ) {
				this.labelB = decodeURIComponent(labelB);
			}

			this.calculate();
		},
		calculate() {
			if ( !this.oddsA || !this.stakeA || !this.oddsB ) return;
			this.calculateRisky();
			this.calculateSafe();
		},
		calculateRisky() {
			const conversion = Number(this.stakeA * (this.conversionRate / 100));
			const payoutA = this.getPayout(this.oddsA, this.stakeA);
			const stakeB = payoutA - this.stakeA;
			const payoutB = Number(this.getPayout(this.oddsB, stakeB));
			const profitB = payoutB - stakeB - this.stakeA;
			
			this.rfbRisky = {
				safe: false,
				stakeA: this.stakeA,
				oddsA: this.oddsA,
				payoutA,
				profitA: 0,
				stakeB,
				oddsB: this.oddsB,
				payoutB,
				profitB: Number(profitB.toFixed(2)),
				conversion,
				profitAfterConversion: Number((profitB + conversion).toFixed(2)),
				conversionRate: this.conversionRate,
			}
		},
		calculateSafe() {
			const conversion = Number(this.stakeA * (this.conversionRate / 100));
			const payoutA = this.getPayout(Number(this.oddsA), Number(this.stakeA));
			const o = ( this.oddsB * -1 ) / 100;
			let stakeB = Number(((payoutA - conversion) / (1 + (1/o) )).toFixed(2));
			
			if ( this.round ) {
				stakeB = Math.round(stakeB);	
			}
			const payoutB = Number(this.getPayout(this.oddsB, stakeB));
			const profitB = Number(payoutB - this.stakeA - stakeB);

			this.rfbSafe = {
				safe: true,
				stakeA: this.stakeA,
				oddsA: this.oddsA,
				payoutA,
				profitA: payoutA - this.stakeA - stakeB,
				stakeB,
				oddsB: this.oddsB,
				payoutB,
				profitB,
				conversion,
				profitAfterConversion: Number((profitB + conversion).toFixed(2)),
				conversionRate: this.conversionRate,
			}
		},
		editLabel(l) {
			const prop = `isEditingLabel${l}`;
			const ref = `labelInput${l}`;
			this[prop] = true;

			this.$nextTick(() => {
				this.$refs[ref].focus();
			})
		},
	},
	watch: {
		round() {
			this.freshInput = true;
			this.calculate();
		}
	},
}
</script>

<template>
	<div class="page legacy risk-free">
		<Navigation/>
		<input id="shareLink" class="copy-input" type="text" :value="shareLink">

		<form @submit.prevent="calculate">
			<div class="settings">
				<div>
					<label for="" style="display:block;">Rounding</label>
					<div class="toggle toggle-round">
						<input id="round" v-model="round" type="checkbox" value="true">
						<label for="round"></label>
						<div class="knob"></div>
					</div>
				</div>
				<div class="field mt-5">
					<label for="">Conversion %</label>
					<input type="text" v-model="conversionRate" @keyup="onKeyUp('cr')">
				</div>
			</div>
			<div class="book">
				<input type="text" v-model="labelA" class="label-input" tabindex="1" @focus="editingLabel = true" @blur="editingLabel = false">
				<div class="field-wrap flex-center">
					<div class="field">
						<label for="" class="color-rfb">Risk-free stake</label>
						<input type="text" v-model="stakeA" tabindex="3" required @keyup="onKeyUp('xa')">
					</div>
					<div class="field">
						<label for="">Odds</label>
						<input type="text" v-model="oddsA" tabindex="4" required @keyup="onKeyUp('oa')">
					</div>
				</div>
			</div>
			<div class="book">
				<input type="text" v-model="labelB" class="label-input" tabindex="2" @focus="editingLabel = true" @blur="editingLabel = false">
				<div class="field-wrap flex-center">
					<div class="field">
						<label for="">Odds</label>
						<input type="text" v-model="oddsB" tabindex="5" required @keyup="onKeyUp('ob')">
					</div>
				</div>
			</div>
			<div class="flex-center button-wrap">
				<button class="btn btn-calculate" type="submit" tabindex="6" name="button">Calculate hedge</button>
			</div>
		</form>
	
	
		<section v-if="loading" class="loading flex-center">
			<div class="spinner"></div>
		</section>
	
		<section class="card-section alt">		
			<transition>
				<div v-if="rfbSafe && rfbRisky" class="card-wrap">
					<CardRiskFree :play="rfbRisky" :bet-A="labelA" :bet-B="labelB"/>
					<CardRiskFree :play="rfbSafe" :bet-A="labelA" :bet-B="labelB"/>
				</div>
			</transition>
		</section>
	</div>
</template>