import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGtag from "vue-gtag";

const app = createApp(App)

app.use(router)
app.use(store)
app.use(VueGtag, {
	config: { id: "G-LPV4BWE4E7" }
})

app.mount('#app')
