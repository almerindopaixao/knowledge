import Vue from 'vue';
import { AxiosError } from 'axios';

export function showError(e: AxiosError) {
  if (e && e.response && e.response.data) {
    Vue.toasted.global.defaultError({ msg: e.response.data.errors });
  } else if (typeof e === 'string') {
    Vue.toasted.global.defaultError({ msg: e });
  } else {
    Vue.toasted.global.defaultError();
  }
}
