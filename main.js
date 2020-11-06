import Vue from 'vue'
import App from './App'
import uView from "uview-ui"; 
import Request from 'luch-request' // 使用npm 

const http = new Request();
Vue.prototype.$http = http;
Vue.use(uView);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
