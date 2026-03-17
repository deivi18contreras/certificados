import { createApp } from 'vue'
import { createPinia } from 'pinia'
<<<<<<< HEAD
import { Quasar, Notify } from 'quasar'

// Import Quasar css
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
=======
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Quasar, Notify, Loading } from 'quasar'

// Import Quasar css
import 'quasar/src/css/index.sass'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import './assets/main.css'
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c

import App from './App.vue'
import router from './router'

const app = createApp(App)
<<<<<<< HEAD

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {
    Notify
  },
  config: {
    brand: {
      primary: '#38a900', // SENA Green
      secondary: '#26A69A',
      accent: '#9C27B0',
      dark: '#1d1d1d',
      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#F2C037'
    }
=======
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.use(Quasar, {
  plugins: {
    Notify,
    Loading
  },
  config: {
    notify: { /* look at QuasarConfOptions from the API card */ }
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
  }
})

app.mount('#app')
