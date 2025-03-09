const helpers = {
    data() {
        return {
            stakeA: '',
            oddsA: '',
            oddsB: '',
            oddsC: '',
            conversionRate: '75',
            labelA: 'Bet A',
            labelB: 'Bet B',
            labelC: 'Bet C',
            editingLabel: false,
            copyConfirmation: '',
        };
    },
    computed: {
        round: {
            get() {
                return this.$store.state.round;
            },
            set(value) {
                this.$store.state.round = value;
            },
        },
        shareLink() {
            const arr = [`stakea=${this.stakeA}`, `oddsa=${this.oddsA}`, `oddsb=${this.oddsB}`];

            if (this.oddsC) {
                arr.push(`oddsc=${this.oddsC}`);
            }

            if (this.labelA !== 'Bet A') {
                arr.push(`booka=${encodeURIComponent(this.labelA)}`);
            }

            if (this.labelB !== 'Bet B') {
                arr.push(`bookb=${encodeURIComponent(this.labelB)}`);
            }

            if (this.labelC !== 'Bet C') {
                arr.push(`bookc=${encodeURIComponent(this.labelC)}`);
            }

            if (Number(this.conversionRate) !== 75) {
                arr.push(`cr=${this.conversionRate}`);
            }

            const params = arr.join('&');
            const path = window.location.href.split('?');

            return `${path[0]}?${params}`;
        },
    },
    filters: {
        currency(amount) {
            const num = Number(amount).toFixed(2);

            if (num < 0) {
                return `-$${Number(num * -1).toLocaleString('en-US')}`;
            }

            return `$${Number(num).toLocaleString('en-US')}`;
        },
    },
    methods: {
        formatUSD(number) {
            let dollarUS = Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            return dollarUS.format(number).replace('.00', '');
        },
        resetState() {
            this.labelA = 'Bet A';
            this.labelB = 'Bet B';
            this.labelC = 'Bet C';
            this.oddsA = '';
            this.stakeA = '';
            this.oddsB = '';
            this.hasSearched = false;
            this.arbBalanced = false;
        },
        copyToClipboard(id) {
            const copyText = document.getElementById(id);
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand('copy');

            if (id === 'shareLink') {
                this.copyConfirmation = 'Copied share URL';
            }

            if (id === 'csv') {
                this.copyConfirmation = 'Copied CSV';
            }

            setTimeout(() => {
                this.copyConfirmation = false;
            }, 600);
        },
        onKeyUp(field) {
            this.freshInput = true;

            if (field == 'oa' && this.oddsA) {
                this.oddsA = this.oddsA.replace(/[^+-\d]/, '');
            }

            if (field == 'ob' && this.oddsB) {
                this.oddsB = this.oddsB.replace(/[^+-\d]/, '');
            }

            if (field == 'oc' && this.oddsC) {
                this.oddsC = this.oddsC.replace(/[^+-\d]/, '');
            }

            if (field == 'xa' && this.stakeA) {
                this.stakeA = this.stakeA.replace(/[^\d]/, '');
            }

            if (field == 'cr' && this.conversionRate) {
                this.conversionRate = this.conversionRate.replace(/[^\d]/, '');
            }
        },
        getConversionColor(percent) {
            if (percent < 60) {
                return 'color-red';
            } else if (percent < 70) {
                return 'color-orange';
            } else if (percent < 80) {
                return 'color-blue';
            } else {
                return 'color-green';
            }
        },
        percentOf(orig, final) {
            const percent = (final / orig) * 100;
            return Number(percent.toFixed(2));
        },
        getPayout(odds, stake) {
            var payout = 0;
            odds = Number(odds);
            stake = Number(stake);

            payout = odds > 0 ? stake * (odds / 100) + stake : stake / ((odds * -1) / 100) + stake;

            return Number(Number(payout).toFixed(2));
        },
        getStake(oddsB, payoutA) {
            const odds = Number(oddsB);
            const payout = Number(payoutA);

            if (odds < 0) {
                const o = (odds * -1) / 100;
                return Number((payout / (1 + 1 / o)).toFixed(2));
            }

            const o = odds / 100;
            return Number((payout / (1 + o)).toFixed(2));
        },
        getQueryString(field) {
            const href = window.location.href;
            const reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
            const string = reg.exec(href);

            return string ? string[1] : null;
        },
    },
};

export default helpers;
