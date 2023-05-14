<template>
    <div class="parser">
        <a href="" class="close-parser" @click.prevent="$emit('close')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"/></svg></a>
        <div class="flex split">
            <div class="col text-center">
                <h4>Book A data</h4>
                <textarea v-model="rawDataDK" resize="none"></textarea>
                <!-- <pre class="placeholder">
                [
                    {
                                        "team": "team a",
                                                "odds": ["215", "-250"],
                                        "opp": "team b"
                    },
                ]
                </pre> -->
            </div>
            <div class="col text-center">
                <h4>Book B data</h4>
                <textarea v-model="rawDataFD" resize="none"></textarea>
            </div>
        </div>
        <div class="parser-footer field-wrap flex">
            <div class="field">
                <label for="">Boost %</label>
                <input type="text" v-model="boostPercent">
            </div>
            <!-- <div class="field">
                <label for="">League</label>
                <select v-model="league">
                    <option value="mlb">MLB</option>
                    <option value="nba">NBA</option>
                </select>
            </div> -->
            <div class="flex align-right">
                <button class="btn btn-calculate" :disabled="!rawDataDK || !rawDataFD" @click.prevent="parse">Parse</button>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import map from '@/components/mixins/map';
import helpers from '@/mixins/helpers';

export default {
    name: 'Parser',
    mixins: [map, helpers],
    data() {
        return {
            boostPercent: 25,
            rawDataDK: '',
            rawDataFD: '',
            league: 'mlb',
            dataDK: [],
            dataFD: [],
            placeholderText: "test",
        }
    },
    mounted() {
        document.onkeydown = (event) => {
            event = event || window.event;

            if (event.keyCode === 27) {
                this.$emit('close');
            }
        };
    },
    methods: {
        getBoostedOdds(odds, boost) {

            if ( boost === 0 ) {
                return odds;
            }

            // Profit from pre-boosted $50
            const profitBefore = this.getPayout(Number(odds), 50) - 50;
            const profitAfter = profitBefore * (1 + (Number(boost)/100) );

            // Get neg/pos odds
            const negativeOdds = Math.round((100 * 50) / profitAfter * -1);
            const positiveOdds = Math.round(( profitAfter / 50) * 100);

            return positiveOdds > 99 ? positiveOdds : negativeOdds;
        },
        getBestBet() {
            let bestBet = {
                dkName: '',
                dkOdds: '',
                fdName: '',
                fdOdds: '',
                profit: 0,
            };

            _.forEach(this.dataDK, (game) => {
                const gameFD = _.find(this.dataFD, { 'team': game.team });

                if ( !gameFD || this.isInvalid(game, gameFD) ) {
                    return;
                }

                // get profit on both options
                console.log('checking profit for games');
                console.log(game);
                console.log(gameFD);
                const dkBoostHome = this.getBoostedOdds(game.odds[0], this.boostPercent);
                const dkBoostAway = this.getBoostedOdds(game.odds[1], this.boostPercent);
                const profitOne = this.getProfit(dkBoostHome, Number(gameFD.odds[1]));
                const profitTwo = this.getProfit(dkBoostAway, Number(gameFD.odds[0]));

                if ( profitOne > bestBet.profit ) {
                    bestBet.profit = profitOne
                    bestBet.dkName = game.team;
                    bestBet.dkOdds = dkBoostHome;
                    bestBet.fdName = gameFD.opp;
                    bestBet.fdOdds = Number(gameFD.odds[1]);
                    console.log('new high');
                }

                if ( profitTwo > bestBet.profit ) {
                    bestBet.profit = profitTwo;
                    bestBet.dkName = game.opp;
                    bestBet.dkOdds = dkBoostAway;
                    bestBet.fdName = gameFD.team;
                    bestBet.fdOdds = Number(gameFD.odds[0]);
                    console.log('new high');
                }
                console.log('===========');
            });

            return bestBet;
        },
        parse() {
            console.log('parsing...');
            this.dataDK = JSON.parse(this.rawDataDK);
            this.dataFD = JSON.parse(this.rawDataFD);

            // make the team names match so we can compare
            // this.dataFD = _.map(this.dataFD, (game) => {
            //     return {
            //         team: this.map[this.league][game.team],
            //         opp: this.map[this.league][game.opp],
            //         odds: game.odds,
            //     }
            // });

            // Then get best bet
            const bestBet = this.getBestBet();
            console.log(bestBet);
            this.$emit('parse', bestBet);
        },
        getProfit(oddsA, oddsB) {
            var payoutA = this.getPayout(oddsA, 25);
            var highestProfit = 0;

            for (var xb = 0; xb < 1000; xb += 0.5 ) {
                var payoutB = Number(this.getPayout(oddsB, xb));
                var sunk = 25 + xb;

                // Exit loop.. no longer profitable or above maxB bet
                if ( sunk > payoutA ) {
                    break;
                }

                // If arb opportunity exists
                if ( payoutB >= sunk && payoutA >= sunk ) {
                    var profitA = Number((payoutA - sunk).toFixed(2));
                    var profitB = Number((payoutB - sunk).toFixed(2));
                    var biggest = profitA > profitB ? profitA : profitB;

                    if ( biggest > highestProfit ) {
                        highestProfit = biggest;
                    }
                }
            }
            console.log('highest profit for', oddsA, oddsB, highestProfit);
            return highestProfit;
        },
        isInvalid(game, gameFD) {
            const a = Number(game.odds[0]);
            const b = Number(game.odds[1]);
            const c = Number(gameFD.odds[0]);
            const d = Number(gameFD.odds[1]);

            if ( a == 0 || b == 0 || c == 0 || d == 0 ) {
                return true;
            }

            return false;
        }
    },
}
</script>