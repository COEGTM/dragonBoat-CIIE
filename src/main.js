import Vue from 'vue';
import Antd from 'ant-design-vue';
import Button from 'ant-design-vue/lib/button';
import Menu from 'ant-design-vue/lib/menu';

import App from './App';
import 'ant-design-vue/dist/antd.css';
// import 'ant-design-vue/dist/antd.dark.css';
import router from './router'
import axios from 'axios'



import Loading from '../src/components/loading'
import { FormModel } from 'ant-design-vue';


Vue.prototype.$axios = axios;
// Vue.prototype.bus = new Vue();
Vue.component(Button.name, Button, Menu);
Vue.use(Antd, Loading, FormModel);
// Vue.config.productionTip = false;

window.router = router
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})