<template>
  <div class="issues">
    issues

    <div 
      class="issues__issue" 
      v-for="item in transformData"
      :key="item.id" v-html="item.content">
    </div>
  </div>
</template>

<script>
import { markdown } from 'markdown';

export default {
  name: 'Issues',
  props: {
    data: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    transformData() {
      return this.data.map(({
        id,
        title,
        html_url,
        body,
      }) => ({
        id,
        title,
        html_url,
        content: markdown.toHTML(body),
      }));
    },
  },
};
</script>
