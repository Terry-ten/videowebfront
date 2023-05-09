import { createStore } from 'vuex';

export default createStore({
  state: {
    menus: [],
  },
  mutations: {
    setMenus(state, menus) {
      state.menus = menus;
    },
    updateMenuVisibility(state, { id, viewable }) {
      const menu = state.menus.find((menu) => menu.id === id);
      if (menu) {
        menu.viewable = viewable;
      }
    },
  },
  actions: {
    setMenus({ commit }, menus) {
      commit('setMenus', menus);
    },
    updateMenuVisibility({ commit }, payload) {
      commit('updateMenuVisibility', payload);
    },
  },
});
