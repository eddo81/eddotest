/* eslint-disable no-unused-vars */
import Navbar from './modules/navbar';
import LoadModule from './modules';
import CheckSelector from './utils/checkselector';
import './modules/objectfit';
<% if(vue !== false) { -%>
import Vue from "vue";
import App from "./vue/App.vue";

Vue.config.productionTip = false;
<% } -%>

window.addEventListener('load', () => {
	Navbar();
});
<% if(vue !== false) { -%>
new Vue({

}).$mount("#app");
<% } -%>
