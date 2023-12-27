import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import App from './App.vue';
import elementSvgicon from './components/SvgIcon/element-svgicon';
import globalComponents from '@/components/index';

// console.log(import.meta.env);

const app = createApp(App);
// 注册element组件，设置中文
// app.use(ElementPlus, {
//   locale: zhCn,
// });

// 导入全局样式
import '@/styles/index.scss';
// svg插件
import 'virtual:svg-icons-register';
// 注册elementsvg图标
app.use(elementSvgicon);
// 注册自定义组件
app.use(globalComponents);
app.mount('#app');
