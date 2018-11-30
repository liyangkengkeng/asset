// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/com.css'

import TIME from '@/assets/time.js' //时间戳转换
Vue.prototype.TIME=TIME;


import ajax from '@/assets/ajax'
Vue.prototype.ajax=ajax;

Vue.use(Element)
Vue.prototype.axios=axios;
Vue.config.productionTip = false


import 'babel-polyfill'
/* eslint-disable no-new */
new Vue({
    router,
    render: h => h(App),
    created(){
    }
}).$mount('#app');