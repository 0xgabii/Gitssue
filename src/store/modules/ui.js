export default {
  namespaced: true,
  state: {
    extend: false,

    position: {
      right: 25,
      bottom: 25,
    },

    fixed: {
      width: 75,
      height: 75,
    },

    resize: {
      width: 1200,
      height: 750,
    },
  },
  getters: {
    computedStyle({ extend, position, fixed, resize }) {
      const positionStyle = {
        right: `${position.right}px`,
        bottom: `${position.bottom}px`,
      };

      if (extend) {
        return {
          ...positionStyle,
          width: `${resize.width}px`,
          height: `${resize.height}px`,
          borderRadius: 0,
        };
      }

      return {
        ...positionStyle,
        width: `${fixed.width}px`,
        height: `${fixed.height}px`,
        borderRadius: '100%',
      };
    },
  },
  mutations: {
    CHANGE_UI(state, { category, value }) {
      state[category] = value;
    },
  },
  actions: {
    changeUI({ commit }, payload) {
      commit('CHANGE_UI', payload);
    },
  },
};
