import Component from './Component';

const Message = {
  install(Vue) {
    const MessageConstructor = Vue.extend(Component);

    Vue.prototype.$message = ({
      container = 'body',
      content = '',
      actions = '',
      handlers = {},
      delay = 3000,
    }) => {
      const MessageInstance = new MessageConstructor({
        el: document.createElement('div'),
        data: () => ({
          content,
          actions,
          delay,
        }),
        methods: handlers,
      });

      Vue.nextTick(() => {
        const containerDOM = document.querySelector(container);

        if (!containerDOM.style.position) containerDOM.style.position = 'relative';

        if (document.querySelector('.vMessage')) {
          document.querySelector(container).removeChild();
        }
        document.querySelector(container).appendChild(MessageInstance.$el);
      });

      return MessageInstance;
    };
  },
};

export default Message;
