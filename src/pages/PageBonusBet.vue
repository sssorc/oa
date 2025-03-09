<script>
import CardConversion from '@/components/CardConversion.vue';
import Navigation from '@/components/Navigation.vue';
import _ from 'lodash';
import helpers from '@/mixins/helpers';
import ToggleField from '@/components/ToggleField.vue';
import '@/assets/legacy/style.scss';

export default {
    name: 'PageBonusBet',
    mixins: [helpers],
    components: {
        CardConversion,
        Navigation,
        ToggleField,
    },
    data() {
        return {
            viewingBookmark: false,
            oddsA: '',
            stakeA: '',
            oddsB: '',
            plays: [],
            conversion: false,
            loading: false,
            freshInput: true,
            hasSearched: false,
            bookmarks: [],
            freeBetMode: false,
        };
    },
    created() {
        this.bindShortcuts();
        this.calcFromUrl();
    },
    methods: {
        calcFromUrl() {
            const a = this.getQueryString('oddsa');
            const ax = this.getQueryString('stakea');
            const b = this.getQueryString('oddsb');
            const labelA = this.getQueryString('booka');
            const labelB = this.getQueryString('bookb');
            this.oddsA = a;
            this.stakeA = ax;
            this.oddsB = b;

            if (labelA) {
                this.labelA = decodeURIComponent(labelA);
            }

            if (labelB) {
                this.labelB = decodeURIComponent(labelB);
            }

            this.calculate();
        },
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
            if (!this.oddsA || !this.stakeA || !this.oddsB) return;

            const payoutA = this.stakeA * (this.oddsA / 100);
            const o = (this.oddsB * -1) / 100;
            let stakeB = (payoutA * o) / (1 + o);
            if (this.round) {
                stakeB = Math.round(stakeB);
            }
            const payoutB = Number(this.getPayout(Number(this.oddsB), stakeB));
            const profitA = payoutA - stakeB;
            const profitB = payoutB - stakeB;
            const profitAvg = (profitA + profitB) / 2;

            const conversion = {
                stakeA: Number(this.stakeA),
                oddsA: this.oddsA,
                payoutA,
                profitA: Number(profitA.toFixed(2)),
                stakeB,
                oddsB: this.oddsB,
                payoutB,
                profitB: Number(profitB.toFixed(2)),
                percent: this.percentOf(this.stakeA, profitAvg),
            };

            this.loading = false;
            this.hasSearched = true;
            this.conversion = conversion;
        },
        editLabel(l) {
            const prop = `isEditingLabel${l}`;
            const ref = `labelInput${l}`;
            this[prop] = true;

            this.$nextTick(() => {
                this.$refs[ref].focus();
            });
        },
        bookmarkPlay() {
            if (!this.hasSearched) {
                return;
            }

            if (this.viewingBookmark) {
                _.remove(this.bookmarks, (obj) => {
                    return obj.id == `${this.oddsA}${this.oddsB}`;
                });

                this.viewingBookmark = false;
                return;
            }

            const play = {
                id: `${this.oddsA}${this.oddsB}`,
                labelA: this.labelA,
                labelB: this.labelB,
                oddsA: this.oddsA,
                oddsB: this.oddsB,
                ev: this.balanced ? this.balanced.ev.toFixed(2) : 0,
                percent: this.conversion ? this.conversion.percent : 0,
                hedge: this.conversion ? this.conversion.stakeB : 0,
            };
            this.bookmarks.push(play);
            this.viewingBookmark = true;

            // Reset fields
            this.resetState();
        },
        loadBookmark(play) {
            this.oddsA = play.oddsA;
            this.oddsB = play.oddsB;
            this.labelA = play.labelA;
            this.labelB = play.labelB;
            this.freshInput = true;
            this.calculate();
        },
    },
    watch: {
        round() {
            this.calculate();
        },
    },
};
</script>

<template>
    <div class="page legacy free-bet">
        <Navigation />
        <input id="shareLink" class="copy-input" type="text" :value="shareLink" />

        <form @submit.prevent="calculate">
            <div v-if="bookmarks.length" class="bookmarks">
                <div v-for="(play, i) in bookmarks" class="bookmark conversion flex-stretch" :key="i" @click="loadBookmark(play)">
                    <div :class="getConversionColor(play.percent)" class="ev flex items-center justify-center">{{ play.percent }}%</div>
                    <div class="games">${{ play.hedge.toLocaleString('en-US') }}</div>
                </div>
            </div>
            <div class="settings rounded-sm bg-gray-200 p-4 ring-1 ring-gray-300">
                <div>
                    <label for="" style="display: block">Rounding</label>
                    <ToggleField v-model="round" @change="calculate" />
                </div>
            </div>
            <div class="book">
                <input type="text" v-model="labelA" class="label-input" tabindex="1" @focus="editingLabel = true" @blur="editingLabel = false" />
                <div class="field-wrap flex items-center justify-center">
                    <div class="field">
                        <label for="" class="color-fb">Free bet</label>
                        <input type="text" v-model="stakeA" tabindex="3" @keyup="onKeyUp('xa')" required class="bg-white" />
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

            <div class="button-wrap flex items-center justify-center">
                <div>
                    <button class="btn btn-calculate" type="submit" tabindex="6" name="button">Calculate hedge</button>
                    <button v-if="conversion && !loading" tabindex="-1" :class="{ 'viewing-bookmark': viewingBookmark }" class="save-play" @click.prevent="bookmarkPlay">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor">
                            <path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z" />
                        </svg>
                    </button>
                </div>
            </div>
        </form>

        <!-- Loading -->
        <section v-if="loading" class="loading flex items-center justify-center px-5 py-8">
            <div class="spinner"></div>
        </section>

        <!-- Results -->
        <section class="card-section alt px-5 py-8">
            <transition>
                <div v-if="!loading && conversion" class="card-wrap">
                    <CardConversion :play="conversion" :bet-A="labelA" :bet-B="labelB" />
                </div>
            </transition>
        </section>
    </div>
</template>
