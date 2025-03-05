<template>
	<div class="card">
		<div :class="{ show: copyConfirmation }" class="copy-confirmation flex">{{ copyConfirmation }}</div>
		<div class="util">
			<button @click="copyToClipboard('csv')" class="copy-to-clipboard">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" viewBox="0 0 384 512">
					<path
						fill="currentColor"
						d="M369.83 97.98L285.94 14.1c-9-9-21.2-14.1-33.89-14.1H47.99C21.5.1 0 21.6 0 48.09v415.92C0 490.5 21.5 512 47.99 512h287.94c26.5 0 48.07-21.5 48.07-47.99V131.97c0-12.69-5.17-24.99-14.17-33.99zM255.95 51.99l76.09 76.08h-76.09V51.99zM336 464.01H47.99V48.09h159.97v103.98c0 13.3 10.7 23.99 24 23.99H336v287.95zM224 264v20.8c0 35.48 12.88 68.89 36.28 94.09 3.02 3.25 7.27 5.11 11.72 5.11s8.7-1.86 11.72-5.11c23.41-25.2 36.28-58.61 36.28-94.09V264c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v20.8c0 20.27-5.7 40.17-16 56.88-10.3-16.7-16-36.61-16-56.88V264c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8zm-104-8h-8c-26.51 0-48 21.49-48 48v32c0 26.51 21.49 48 48 48h8c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8h-8c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h8c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8zm59.45 42.47c-1.38-1.19-2.12-2.55-2.12-3.84 0-3.12 4.45-6.62 10.41-6.62H200c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8h-12.27c-23.39 0-42.41 17.33-42.41 38.62 0 10.66 4.86 20.92 13.33 28.14l21.89 18.77c1.38 1.19 2.12 2.55 2.12 3.84 0 3.12-4.45 6.62-10.41 6.62H160c-4.42 0-8 3.58-8 8v16c0 4.42 3.58 8 8 8h12.27c23.39 0 42.41-17.33 42.41-38.62 0-10.66-4.86-20.92-13.33-28.14l-21.9-18.77z"
					/>
				</svg>
			</button>
			<button @click="copyToClipboard('shareLink')" class="ml-2 copy-to-clipboard">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
					<path
						fill="currentColor"
						d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"
					/>
				</svg>
			</button>
		</div>
		<h2>{{ play.percent }}%</h2>
		<div class="card-body">
			<div class="flex split">
				<div class="amount">
					<label>{{ betA }} ({{ Number(this.play.oddsA) > 0 ? `+${this.play.oddsA}` : this.play.oddsA }})</label>
					<div class="number">{{ formatUSD(play.stakeA) }}</div>
					<small>free bet</small>
				</div>
				<div class="amount">
					<label>{{ betB }} ({{ Number(this.play.oddsB) > 0 ? `+${this.play.oddsB}` : this.play.oddsB }})</label>
					<div class="number">{{ formatUSD(play.stakeB) }}</div>
					<small>stake</small>
				</div>
			</div>
			<div class="flex-center mt-4 mb-6">
				<div class="amount">
					<div class="number sunk color-orange">{{ formatUSD(play.stakeB) }}</div>
					<small>staked</small>
				</div>
			</div>
			<div class="flex split card-bottom">
				<div class="amount">
					<div class="number color-green">{{ formatUSD(play.profitA) }}</div>
					<small>{{ formatUSD(play.payoutA) }} payout</small>
				</div>
				<span class="or">or</span>
				<div class="amount">
					<div class="number color-green">{{ formatUSD(play.profitB) }}</div>
					<small>{{ formatUSD(play.payoutB) }} payout</small>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import helpers from '@/mixins/helpers';

export default {
	name: 'CardConversion',
	mixins: [helpers],
	props: {
		play: Object,
		betA: String,
		betB: String,
	},
};
</script>
