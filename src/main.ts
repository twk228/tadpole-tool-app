import App from './App.vue';
import router from '@/router';
import store from '@/store';
import 'amfe-flexible';
import 'vant/lib/index.css';
import '@/styles/index.less';

import { NavBar, Dialog, Radio, RadioGroup, Loading } from 'vant';


import pageHeader from '@/components/pageHeader.vue';
import pageFooter from '@/components/pageFooter.vue';

const app = createApp(App);

//注册全局组件
app.component('page-header', pageHeader);
app.component('page-footer', pageFooter);

app.use(Loading);

app.use(NavBar);
app.use(Dialog);

app.use(Radio);
app.use(RadioGroup);

app.use(store);
app.use(router);


app.mount('#app');
