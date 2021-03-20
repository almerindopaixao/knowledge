import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

interface State {
  isMenuVisible: boolean;
  user: {
    name: string;
    email: string;
  };
  stat: {
    users: number;
    categories: number;
    articles: number;
    createdAt: number;
  };
}

export default new Vuex.Store({
  state: {
    isMenuVisible: true,
    user: {
      name: 'Usuário Mock',
      email: 'mock@email.com.br',
    },
    stat: {},
  } as State,

  mutations: {
    toggleMenu(state, isVisible?: boolean): void {
      if (isVisible === undefined) {
        state.isMenuVisible = !state.isMenuVisible;
      } else {
        state.isMenuVisible = isVisible;
      }
    },
    setStats(state, payload) {
      state.stat = payload;
    },
  },

  actions: {
    async getStats({ commit }) {
      try {
        const { data } = await Vue.prototype.$api.get('/stats');
        window.sessionStorage.setItem('stat', JSON.stringify(data));
        commit('setStats', data);
      } catch (err) {
        console.log(err);
      }
    },
  },
});
