<template>
	<div class="page">
		<input id="shareLink" class="copy-input" type="text" :value="shareLink">
		<input id="csv" class="copy-input" type="text" :value="csv">
	
		<form @submit.prevent="calculate" :class="{'threeway': threeway}">
			<div v-if="bookmarks.length" class="bookmarks">
				<div v-for="(play, i) in bookmarks" class="bookmark flex-stretch" :key="i" @click="loadBookmark(play)">
					<div :class="{'color-green': play.ev > 0, 'color-red': play.ev < 0}" class="ev flex-center">{{ play.ev|currency }}</div>
					<div class="games">
						{{ play.labelA }} <strong>{{ play.oddsA }}</strong><br>
						{{ play.labelB }} <strong>{{ play.oddsB }}</strong>
					</div>
				</div>
			</div>
			<div class="settings">
				<div>
					<label for="" style="display:block;">Rounding</label>
					<div class="toggle toggle-round">
						<input id="round" v-model="round" type="checkbox" value="true" tabindex="-1">
						<label for="round"></label>
						<div class="knob"></div>
					</div>
				</div>
				<div>
					<label for="" style="display:block;">Three-way</label>
					<div class="toggle toggle-round">
						<input id="threeway" v-model="threeway" type="checkbox" value="false" tabindex="-1">
						<label for="threeway"></label>
						<div class="knob"></div>
					</div>
				</div>
				<div>
					<label for="" style="display:block;">
						Extra
						<svg width="12" v-tooltip.right="'Additional winnings awarded only if the bet hits'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm0-338c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"/></svg>
					</label>
					<div class="toggle toggle-round">
						<input id="winback" v-model="winback" type="checkbox" value="true" tabindex="-1">
						<label for="winback"></label>
						<div class="knob"></div>
					</div>
				</div>
			</div>
			<div class="book">
				<input type="text" v-model="labelA" class="label-input" tabindex="1" @focus="editingLabel = true" @blur="editingLabel = false">
				<div class="field-wrap flex-center">
					<div class="field">
						<label for="" class="color-arb">Max stake</label>
						<input type="text" v-model="stakeA" required tabindex="3" @keyup="onKeyUp('xa')">
					</div>
					<div class="field">
						<label for="">Odds</label>
						<input type="text" v-model="oddsA" required tabindex="4" @keyup="onKeyUp('oa')">
					</div>
					<div v-if="winback" class="field">
						<label for="">Extra</label>
						<input type="text" v-model="winbackAmount" required tabindex="4" @keyup="onKeyUp('wb')">
					</div>
				</div>
			</div>
			<div class="book">
				<input type="text" v-model="labelB" class="label-input" tabindex="2" @focus="editingLabel = true" @blur="editingLabel = false">
				<div class="field-wrap flex-center">
					<div class="field">
						<label for="">Odds</label>
						<input type="text" v-model="oddsB" required tabindex="5" @keyup="onKeyUp('ob')">
					</div>
				</div>
			</div>
			<div v-if="threeway" class="book">
				<input type="text" v-model="labelC" class="label-input" tabindex="2" @focus="editingLabel = true" @blur="editingLabel = false">
				<div class="field-wrap flex-center">
					<div class="field">
						<label for="">Odds</label>
						<input type="text" v-model="oddsC" required tabindex="6" @keyup="onKeyUp('oc')">
					</div>
				</div>
			</div>
			<div class="flex-center button-wrap">
				<div>
					<button class="btn btn-calculate" type="submit" tabindex="6" name="button">Calculate hedge</button>
					<button v-if="arbBalanced && !loading" :class="{ 'viewing-bookmark': viewingBookmark }" tabindex="-1" class="save-play btn-util" @click.prevent="bookmarkPlay"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor"><path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"/></svg></button>
				</div>
			</div>
		</form>
	
		<section v-if="loading" class="loading flex-center">
			<div class="spinner"></div>
		</section>
	
		<section class="card-section alt">
			<transition name="fade">
				<div v-if="arbBalanced && !loading" class="card-wrap">
					<CardBalanced :play="arbBalanced" />
				</div>
			</transition>
		</section>
	</div>
</template>

<script>
import CardBalanced from '@/components/CardBalanced';
import _ from 'lodash';
import helpers from '@/components/mixins/helpers';

export default {
	name: 'Arb',
	mixins: [helpers],
	components: {
		CardBalanced,
	},
	data() {
		return {
			threeway: false,
			viewingBookmark: false,
			arbBalanced: false,
			loading: false,
			freshInput: true,
			hasSearched: false,
			bookmarks: [],
			noLossA: false,
			noLossB: false,
		};
	},
	created() {
		this.bindShortcuts();
		this.calcFromUrl();
	},
	computed: {
		csv() {
			const today = new Date();
			const dateArray = today.toLocaleDateString('en-US').split('/');
			dateArray.pop();
			const date = dateArray.join('/');

			return `${date},${this.labelA},${this.oddsA},${this.arbBalanced.stakeA},${this.arbBalanced.payoutA},${this.labelB},${this.oddsB},${this.arbBalanced.stakeB},${this.arbBalanced.payoutB},${this.arbBalanced.profitA},${this.arbBalanced.profitB}`;
		},
	},
	methods: {
		bindShortcuts() {
			document.addEventListener( 'keydown', (event) => {
				if ( this.editingLabel ) {
					return;
				}

				event = event || window.event;

				if ( event.keyCode === 83 ) {
					this.bookmarkPlay();
				}
			});
		},
		calculate() {
			if ( !this.freshInput ) return;
			if ( !this.oddsA || !this.stakeA || !this.oddsB ) return;

			// Reset stuff
			this.loading = true;
			this.freshInput = false;
			let stakeC = 0;
			
			// Get payout
			let payoutA = Number(this.getPayout(this.oddsA, this.stakeA));

			// Add winback to payout if exists
			if ( this.winback ) {
				payoutA += Number(this.winbackAmount);
			}

			// stake B
			let stakeB = this.getStake(this.oddsB, payoutA);
			stakeB = this.round ? Math.round(stakeB) : stakeB;

			// stake C
			if (this.threeway) {
				stakeC = this.getStake(this.oddsC, payoutA);
				stakeC = this.round ? Math.round(stakeC) : stakeC;
			}

			const payoutB = Number(this.getPayout(this.oddsB, stakeB));
			const payoutC = this.threeway ? Number(this.getPayout(this.oddsC, stakeC)) : 0;
			const sunk = Number(this.stakeA) + Number(stakeB) + stakeC;
			const profitB = payoutB - sunk;
			const profitA = payoutA - sunk;
			const profitC = payoutC - sunk;
			
			// Push our card data
			this.arbBalanced = {
				stakeA: Number(this.stakeA),
				stakeB,
				stakeC,
				oddsA: this.oddsA,
				oddsB: this.oddsB,
				oddsC: this.oddsC,
				payoutA,
				payoutB,
				payoutC,
				profitA,
				profitB,
				profitC,
				ev: (profitA + profitB) / 2,
				winback: this.winback ? this.winbackAmount : false
			}

			// Done loading
			this.loading = false;
			this.hasSearched = true;
			
			// Are we viewing a bookmark?
			if ( _.find(this.bookmarks, { 'id': `${this.oddsA}${this.oddsB}` }) ) {
				this.viewingBookmark = true;
			} else {
				this.viewingBookmark = false;
			}
		},
		calcFromUrl() {
			const a = this.getQueryString('oddsa');
			const ax = this.getQueryString('stakea');
			const b = this.getQueryString('oddsb');			
			const c = this.getQueryString('oddsc');
			const labelA = this.getQueryString('booka');
			const labelB = this.getQueryString('bookb');
			const labelC = this.getQueryString('bookc');
			const wb = this.getQueryString('wb');
			this.oddsA = a;
			this.stakeA = ax;
			this.oddsB = b;

			if (c) {
				this.threeway = true;
				this.oddsC = c;
			}
			
			if ( labelA ) {
				this.labelA = decodeURIComponent(labelA);
			}
			
			if ( labelB ) {
				this.labelB = decodeURIComponent(labelB);
			}

			if ( labelC ) {
				this.labelC = decodeURIComponent(labelC);
			}
			
			if ( wb ) {
				this.winback = true;
				this.winbackAmount = decodeURIComponent(wb);
			}

			this.calculate();
		},
		bookmarkPlay() {
			if ( !this.hasSearched ) {
				return;
			}
			
			// Remove?
			if ( this.viewingBookmark ) {
				_.remove(this.bookmarks, (obj) => {
					return obj.id == `${this.oddsA}${this.oddsB}`;
				});
				
				this.viewingBookmark = false;
				return;
			}
			
			// Create
			const bookmark = _.clone(this.arbBalanced)
			bookmark.id = `${this.oddsA}${this.oddsB}`
			bookmark.labelA = this.labelA;
			bookmark.labelB = this.labelB;
			
			this.bookmarks.push(bookmark);
			this.resetState();
		},
		loadBookmark(bookmark) {
			this.oddsA = bookmark.oddsA;
			this.stakeA = bookmark.stakeA;
			this.oddsB = bookmark.oddsB;
			this.labelA = bookmark.labelA;
			this.labelB = bookmark.labelB;
			this.freshInput = true;
		},
	},
	watch: {
		round() {
			this.freshInput = true;
			this.calculate();
		},
		threeway() {
			this.freshInput = true;
		}
	},
}
</script>