
<template>
    <div class="card" :class="{'threeway': play.stakeC }">
        <div :class="{'show': copyConfirmation}" class="copy-confirmation flex">{{ copyConfirmation }}</div>
        <div class="util flex">
            <button tabindex="-1" @click="copyToClipboard('csv')" class="copy-to-clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="14" viewBox="0 0 384 512"><path fill="currentColor" d="M369.83 97.98L285.94 14.1c-9-9-21.2-14.1-33.89-14.1H47.99C21.5.1 0 21.6 0 48.09v415.92C0 490.5 21.5 512 47.99 512h287.94c26.5 0 48.07-21.5 48.07-47.99V131.97c0-12.69-5.17-24.99-14.17-33.99zM255.95 51.99l76.09 76.08h-76.09V51.99zM336 464.01H47.99V48.09h159.97v103.98c0 13.3 10.7 23.99 24 23.99H336v287.95zM224 264v20.8c0 35.48 12.88 68.89 36.28 94.09 3.02 3.25 7.27 5.11 11.72 5.11s8.7-1.86 11.72-5.11c23.41-25.2 36.28-58.61 36.28-94.09V264c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v20.8c0 20.27-5.7 40.17-16 56.88-10.3-16.7-16-36.61-16-56.88V264c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8zm-104-8h-8c-26.51 0-48 21.49-48 48v32c0 26.51 21.49 48 48 48h8c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8h-8c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h8c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8zm59.45 42.47c-1.38-1.19-2.12-2.55-2.12-3.84 0-3.12 4.45-6.62 10.41-6.62H200c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8h-12.27c-23.39 0-42.41 17.33-42.41 38.62 0 10.66 4.86 20.92 13.33 28.14l21.89 18.77c1.38 1.19 2.12 2.55 2.12 3.84 0 3.12-4.45 6.62-10.41 6.62H160c-4.42 0-8 3.58-8 8v16c0 4.42 3.58 8 8 8h12.27c23.39 0 42.41-17.33 42.41-38.62 0-10.66-4.86-20.92-13.33-28.14l-21.9-18.77z"/></svg></button>
            <button tabindex="-1" @click="copyToClipboard('shareLink')" class="ml-10 copy-to-clipboard"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M352 320c-25.6 0-48.9 10-66.1 26.4l-98.3-61.5c5.9-18.8 5.9-39.1 0-57.8l98.3-61.5C303.1 182 326.4 192 352 192c53 0 96-43 96-96S405 0 352 0s-96 43-96 96c0 9.8 1.5 19.6 4.4 28.9l-98.3 61.5C144.9 170 121.6 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.6 0 48.9-10 66.1-26.4l98.3 61.5c-2.9 9.4-4.4 19.1-4.4 28.9 0 53 43 96 96 96s96-43 96-96-43-96-96-96zm0-272c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM96 304c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm256 160c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z"/></svg></button>
        </div>
        <h2>{{ roi.toFixed(2) }}%</h2>
        <div class="card-body">
            <div class="flex split">
                <div class="amount">
                    <label>{{ this.$parent.labelA }} ({{ this.play.oddsA }})</label>
                    <div class="number">{{ formatUSD(play.stakeA) }}</div>
                    <small>stake</small>
                </div>
                <div class="amount">
                    <label>{{ this.$parent.labelB }} ({{ this.play.oddsB }})</label>
                    <div class="number">{{ formatUSD(play.stakeB) }}</div>
                    <small>stake</small>
                </div>
				<div v-if="play.stakeC" class="amount">
					<label>{{ this.$parent.labelC }} ({{ this.play.oddsC }})</label>
                    <div class="number">{{ formatUSD(play.stakeC) }}</div>
                    <small>stake</small>
				</div>
            </div>
            <div class="flex-center mt-15 mb-25">
                <div class="amount">
                    <div class="number sunk color-orange">{{ formatUSD(play.stakeA + play.stakeB + play.stakeC) }}</div>
                    <small>sunk</small>
                </div>
            </div>
            <div class="flex split card-bottom">
                <div v-if="play.winback" class="amount">
					<div class="number color-red small">{{ formatUSD(play.profitA - play.winback) }}</div>
					<small>{{ formatUSD(play.payoutA - play.winback) }} payout</small>
					
					<div class="number color-blue small mt-10">+{{ formatUSD(play.winback) }}</div>
					<small>Extra</small>
					
					<div class="number color-green mt-10">{{ formatUSD(play.profitA) }}</div>
					<small>after extra</small>
				</div>
                <div v-else class="amount">
                    <div :class="{'color-green': play.profitA > 0, 'color-red': play.profitA < 0}" class="number">{{ formatUSD(play.profitA) }}</div>
                    <small>{{ formatUSD(play.payoutA) }} payout</small>
                </div>
                <span class="or">or</span>
                <div :class="{'mt-a': play.winback }" class="amount">
                    <div :class="{'color-green': play.profitB > 0, 'color-red': play.profitB < 0}" class="number">{{ formatUSD(play.profitB) }}</div>
                    <small>{{ formatUSD(play.payoutB) }} payout</small>
                </div>
				<div v-if="play.stakeC" :class="{'mt-a': play.winback }" class="amount">
					<div :class="{'color-green': play.profitC > 0, 'color-red': play.profitC < 0}" class="number">{{ formatUSD(play.profitC) }}</div>
					<small>{{ formatUSD(play.payoutC) }} payout</small>
				</div>
            </div>
        </div>
    </div>
</template>

<script>
import helpers from '@/mixins/helpers';

export default {
    name: 'CardBalanced',
    props: {
        play: Object,
    },
	computed: {
		roi() {
			const { stakeA, stakeB, stakeC } = this.play;
			const stake = stakeA + stakeB + stakeC;
			const profit = this.play.profitA;
			return (profit / stake) * 100;
		}
	},
    mixins: [helpers],
}
</script>