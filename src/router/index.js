import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../login/login.vue'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    routes: [{
            path: '/',
            name: 'login',
            component: login
        },
        {
            path: '/board',
            name: 'app',
            component: app
        },

    ]
})