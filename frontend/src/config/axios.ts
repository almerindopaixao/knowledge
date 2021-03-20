import Vue from 'vue';
import axios, { AxiosInstance } from 'axios';
import { baseApiUrl } from '../utils/global';

const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    Authorization:
      'beader eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJhbG1lcmluZG9fNEBlbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjE1NDI4MzcxLCJleHBpcmVzIjoxNjE1NTE0NzcxLCJleHAiOjE2MTU1MTQ3NzF9.5k6vVebG2O4zvCwqJ_eAih5Zwpv4NcaNtBZHm_-oi3s',
  },
});

Vue.use({
  install(Vue) {
    Vue.prototype.$api = api;
  },
});

declare module 'vue/types/vue' {
  interface Vue {
    $api: AxiosInstance;
  }
}
