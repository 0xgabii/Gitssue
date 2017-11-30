<template>
  <div class="comment">
    <div class="column column--left">
      <img 
        class="comment__authorAvatar" 
        :src="data.author.avatarUrl"
      />
    </div>

    <div class="column column--right">
      <div class="comment-info">
        <h3 class="comment-info__authorName">
          {{data.author.login}}
        </h3>

        <relative-time 
          class="comment-info__createdAt"
          :utc="data.createdAt" 
        />
      </div>

      <div 
        class="comment-body markdown-preview" 
        v-html="txt2MD(data.body)"
      />
    </div>
  </div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';

marked.setOptions({
  highlight: str => hljs.highlightAuto(str).value,
  breaks: true,
});

export default {
  name: 'IssueComment',
  props: [
    'data',
  ],
  methods: {
    txt2MD(text) {
      return marked(text);
    },
  },
};
</script>

