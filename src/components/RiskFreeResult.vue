<script setup>
import { computed } from 'vue';
import CopyUrlButton from './CopyUrlButton.vue';
import { trackUrlCopy } from '@/utils/analytics';

const props = defineProps({
    result: {
        type: [Object, Boolean],
        required: true,
    },
});

const roi = computed(() => {
    if (!props.result) return 0;
    return (props.result.profitA / props.result.stakeA) * 100;
});

const totalStake = computed(() => {
    if (!props.result) return 0;
    return Number(props.result.stakeA) + Number(props.result.stakeB);
});

const borderColor = computed(() => {
    if (roi.value >= 70) {
        return 'border-jet';
    } else {
        return 'border-red';
    }
});

const shareUrl = computed(() => {
    if (!props.result) return window.location.href;

    const baseUrl = window.location.origin + '/risk-free';
    const { stakeA, oddsA, oddsB, conversionRate } = props.result;

    const params = new URLSearchParams();
    if (stakeA) params.set('stakeA', stakeA);
    if (oddsA) params.set('oddsA', oddsA);
    if (oddsB) params.set('oddsB', oddsB);
    if (conversionRate) params.set('conversion', conversionRate);

    return `${baseUrl}?${params.toString()}`;
});

function formatUSD(number) {
    let dollarUS = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return dollarUS.format(number).replace('.00', '');
}

function formatOdds(odds) {
    return Number(odds) > 0 ? `+${odds}` : odds;
}
</script>

<template>
    <div v-if="result">
        <div class="border-jet relative border font-mono shadow-md">
            <div class="bg-ice-blue/40 dark:from-ice-blue dark:to-pale-blue dark:text-jet relative z-20 bg-linear-65 p-6">
                <div class="flex flex-wrap items-start justify-between gap-6">
                    <div class="text-left">
                        <div class="text-jet font-mono text-sm">Return</div>
                        <div class="mt-1 flex items-end text-4xl font-bold">
                            <div class="font-numbers tracking-tight">{{ roi.toFixed(2) }}</div>
                            <span class="ml-1 pb-1 text-2xl">%</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-end">
                        <div class="text-left">
                            <div class="text-jet font-mono text-sm">Total Stake</div>
                            <div class="font-numbers mt-1 text-3xl font-semibold">{{ formatUSD(totalStake) }}</div>
                        </div>
                    </div>
                </div>
                <hr class="border-space/40 mt-8 border-t" />
                <div class="mt-8 flex items-start justify-between gap-4">
                    <div>
                        <div class="font-mono text-sm">Risk-free bet ({{ formatOdds(result.oddsA) }})</div>
                        <div class="font-numbers mt-1 text-3xl font-bold">{{ formatUSD(result.stakeA) }}</div>
                    </div>
                    <div>
                        <div class="font-mono text-sm">Hedge ({{ formatOdds(result.oddsB) }})</div>
                        <div class="font-numbers decoration-pink mt-1 text-3xl font-bold underline decoration-4 underline-offset-2">{{ formatUSD(result.stakeB) }}</div>
                    </div>
                </div>

                <hr class="border-space/40 mt-8 border-t" />

                <div class="mt-8 flex items-start justify-between gap-4">
                    <div>
                        <div class="font-mono text-sm">{{ formatUSD(result.payoutA) }} payout</div>
                        <div :class="{ 'text-red': result.profitA < 0 }" class="font-numbers mt-1 text-3xl font-bold">
                            {{ formatUSD(result.profitA) }}
                        </div>
                    </div>
                    <div class="pt-4">or</div>
                    <div>
                        <div class="font-mono text-sm">{{ formatUSD(result.payoutB) }} payout</div>
                        <div class="font-numbers text-red mt-1 text-3xl font-bold">{{ formatUSD(result.profitB) }}</div>
                    </div>
                </div>

                <div class="mt-8 flex justify-end gap-4">
                    <div class="space-y-4">
                        <div class="flex flex-col items-end">
                            <div class="font-mono text-sm">{{ result.conversionRate }}% BB Conversion</div>
                            <div class="font-numbers mt-1 text-3xl font-bold">+{{ formatUSD(result.conversion) }}</div>
                        </div>
                    </div>
                </div>

                <hr class="border-space/40 mt-8 border-t" />
                <div class="mt-8 flex items-start justify-between gap-4">
                    <div>
                        <div class="font-mono text-sm">net</div>
                        <div :class="{ 'text-red': result.profitA < 0 }" class="font-numbers mt-1 text-3xl font-bold">
                            {{ formatUSD(result.profitA) }}
                        </div>
                    </div>
                    <div>
                        <div class="font-mono text-sm">net</div>
                        <div :class="{ 'text-red': result.profitAfterConversion < 0 }" class="font-numbers mt-1 text-3xl font-bold">
                            {{ formatUSD(result.profitAfterConversion) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-2">
            <CopyUrlButton :content="shareUrl" @click="trackUrlCopy('risk_free')" />
        </div>
    </div>
</template>
