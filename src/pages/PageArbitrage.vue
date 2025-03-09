<script>
import CardBalanced from '@/components/CardBalanced.vue';
import Navigation from '@/components/Navigation.vue';
import ToggleField from '@/components/ToggleField.vue';
import _ from 'lodash';
import helpers from '@/mixins/helpers.js';
import '@/assets/legacy/style.scss';

export default {
    name: 'PageArbitrage',
    mixins: [helpers],
    components: {
        CardBalanced,
        Navigation,
        ToggleField,
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
            document.addEventListener('keydown', (event) => {
                if (this.editingLabel) {
                    return;
                }

                event = event || window.event;

                if (event.keyCode === 83) {
                    this.bookmarkPlay();
                }
            });
        },
        calculate() {
            if (!this.freshInput) return;
            if (!this.oddsA || !this.stakeA || !this.oddsB) return;

            // Reset stuff
            this.loading = true;
            this.freshInput = false;
            let stakeC = 0;

            // Get payout
            let payoutA = Number(this.getPayout(this.oddsA, this.stakeA));

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
            const sunk = Number(this.stakeA) + Number(stakeB) + Number(stakeC);
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
            };

            // Done loading
            this.loading = false;
            this.hasSearched = true;

            // Are we viewing a bookmark?
            if (_.find(this.bookmarks, { id: `${this.oddsA}${this.oddsB}` })) {
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

            if (labelA) {
                this.labelA = decodeURIComponent(labelA);
            }

            if (labelB) {
                this.labelB = decodeURIComponent(labelB);
            }

            if (labelC) {
                this.labelC = decodeURIComponent(labelC);
            }

            this.calculate();
        },
        bookmarkPlay() {
            if (!this.hasSearched) {
                return;
            }

            // Remove?
            if (this.viewingBookmark) {
                _.remove(this.bookmarks, (obj) => {
                    return obj.id == `${this.oddsA}${this.oddsB}`;
                });

                this.viewingBookmark = false;
                return;
            }

            // Create
            const bookmark = _.clone(this.arbBalanced);
            bookmark.id = `${this.oddsA}${this.oddsB}`;
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
        },
    },
};
</script>

<template>
    <div class="page legacy arb">
        <input id="shareLink" class="copy-input" type="text" :value="shareLink" />
        <input id="csv" class="copy-input" type="text" :value="csv" />

        <form @submit.prevent="calculate" :class="{ threeway: threeway }">
            <div v-if="bookmarks.length" class="bookmarks">
                <div v-for="(play, i) in bookmarks" class="bookmark flex items-stretch" :key="i" @click="loadBookmark(play)">
                    <div :class="{ 'color-green': play.ev > 0, 'color-red': play.ev < 0 }" class="ev flex items-center">{{ formatUSD(play.ev) }}</div>
                    <div class="games">
                        {{ play.labelA }} <strong>{{ play.oddsA }}</strong
                        ><br />
                        {{ play.labelB }} <strong>{{ play.oddsB }}</strong>
                    </div>
                </div>
            </div>
            <div class="settings space-y-4 rounded-sm bg-gray-200 p-4 ring-1 ring-gray-300">
                <div>
                    <label for="" class="mb-2 block">Rounding</label>
                    <ToggleField v-model="round" @change="calculate" />
                </div>
                <div>
                    <label for="" class="mb-2 block">Three-way</label>
                    <ToggleField v-model="threeway" />
                </div>
            </div>
            <div class="book">
                <input type="text" v-model="labelA" class="label-input" tabindex="1" @focus="editingLabel = true" @blur="editingLabel = false" />
                <div class="field-wrap flex items-center justify-center">
                    <div class="field">
                        <label for="" class="color-arb">Stake</label>
                        <input type="text" v-model="stakeA" required tabindex="3" @keyup="onKeyUp('xa')" class="bg-white" />
                    </div>
                    <div class="field">
                        <label for="">Odds</label>
                        <input type="text" v-model="oddsA" required tabindex="4" @keyup="onKeyUp('oa')" class="bg-white" />
                    </div>
                </div>
            </div>
            <div class="book">
                <input type="text" v-model="labelB" class="label-input" tabindex="2" @focus="editingLabel = true" @blur="editingLabel = false" />
                <div class="field-wrap flex items-center justify-center">
                    <div class="field">
                        <label for="">Odds</label>
                        <input type="text" v-model="oddsB" required tabindex="5" @keyup="onKeyUp('ob')" class="bg-white" />
                    </div>
                </div>
            </div>
            <div v-if="threeway" class="book">
                <input type="text" v-model="labelC" class="label-input" tabindex="2" @focus="editingLabel = true" @blur="editingLabel = false" />
                <div class="field-wrap flex items-center justify-center">
                    <div class="field">
                        <label for="">Odds</label>
                        <input type="text" v-model="oddsC" required tabindex="6" @keyup="onKeyUp('oc')" class="bg-white" />
                    </div>
                </div>
            </div>
            <div class="button-wrap flex items-center justify-center">
                <div>
                    <button type="submit" class="button" :disabled="loading">Calculate</button>
                </div>
            </div>
        </form>

        <CardBalanced v-if="arbBalanced" :data="arbBalanced" />
    </div>
</template>
