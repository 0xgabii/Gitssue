<template>
  <div 
    :class="`
      contextMenu__item
      contextMenu__item--${type}
    `">
    <slot />
  </div>  
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    type: {
      type: String,
      default: 'default',
    },
  },
  data: () => ({
    visible: false,
    x: 0,
    y: 0,
    data: undefined,
  }),
};
</script>

