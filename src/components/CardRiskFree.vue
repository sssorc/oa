
<template>
	<div class="card risk-free">
		<div :class="{'show': copyConfirmation}" class="copy-confirmation flex">{{ copyConfirmation }}</div>
		<div class="util">
			<button @click="copyToClipboard('shareLink')" class="ml-10 copy-to-clipboard"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M352 320c-25.6 0-48.9 10-66.1 26.4l-98.3-61.5c5.9-18.8 5.9-39.1 0-57.8l98.3-61.5C303.1 182 326.4 192 352 192c53 0 96-43 96-96S405 0 352 0s-96 43-96 96c0 9.8 1.5 19.6 4.4 28.9l-98.3 61.5C144.9 170 121.6 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.6 0 48.9-10 66.1-26.4l98.3 61.5c-2.9 9.4-4.4 19.1-4.4 28.9 0 53 43 96 96 96s96-43 96-96-43-96-96-96zm0-272c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM96 304c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm256 160c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z"/></svg></button>
		</div>
		<h2>{{ play.safe ? 'Safe' : 'Risky' }}</h2>
		<div v-if="play.safe && play.oddsB > 0" class="card-body">
			<p>Place risk-free bet on positive odds and hedge on negative</p>
		</div>
		<div v-else class="card-body">
			<div class="flex split">
				<div class="amount">
					<label>{{ betA }} ({{ Number(this.play.oddsA) > 0 ? `+${this.play.oddsA}` : this.play.oddsA }})</label>
					<div class="number">{{ formatUSD(play.stakeA) }}</div>
					<small>risk-free</small>
				</div>
				<div class="amount">
					<label>{{ betB }} ({{ Number(this.play.oddsB) > 0 ? `+${this.play.oddsB}` : this.play.oddsB }})</label>
					<div class="number">{{ formatUSD(play.stakeB) }}</div>
					<small>stake</small>
				</div>
			</div>
			<div class="flex-center mt-15 mb-25">
				<div class="amount">
					<div class="number sunk color-orange">{{ formatUSD(Number(play.stakeA) + Number(play.stakeB)) }}</div>
					<small>staked</small>
				</div>
			</div>
			<div class="flex split card-bottom flex-bottom">
				<div class="amount">
					<div class="number color-green">{{ formatUSD(play.profitA) }}</div>
					<small>{{ formatUSD(play.payoutA) }} payout</small>
				</div>
				<span class="or">or</span>
				<div class="amount">
					<div class="number color-red small">{{ formatUSD(play.profitB) }}</div>
					<small>{{ formatUSD(play.payoutB) }} payout</small>
					
					<div class="number color-blue small mt-10">+{{ formatUSD(play.conversion) }}</div>
					<small>{{ play.conversionRate }}% conversion</small>
					
					<div class="number color-green mt-10">{{ formatUSD(play.profitAfterConversion) }}</div>
					<small>after conversion</small>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import helpers from '@/mixins/helpers';

export default {
	name: 'CardRiskFree',
	mixins: [helpers],
	props: {
		play: Object,
		betA: String,
		betB: String,
	},
}
</script>