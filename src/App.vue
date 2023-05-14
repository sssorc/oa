<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
	components: { RouterLink, RouterView },
	data() {
		return {
			showMobileNav: false,
		}
	},
	watch: {
		$route() {
			this.showMobileNav = false;
		},
	},
}
</script>

<template>
	<RouterView />
</template>