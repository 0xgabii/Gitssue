<template>
  <div class="mditor">

    <div class="mditor-header">
      <input type="text" v-model="title" placeholder="Title">
    </div>

    <div class="mditor-controls">
      <div class="mditor-controls__tab">
        <span
        v-for="tab in tabs"
        :class="{ active: mode === tab }"
        :key="tab"
        @click="mode = tab">
          {{ tab }}
        </span>
      </div>

      <div class="mditor-controls__utils" v-if="mode === tabs[0]">
        <template v-if="capture.active">
          <span @click="cropCapture">Select & crop</span>
          <span @click="cancelCaptue">Cancel</span>
        </template>

        <template v-else>
          <span @click="startCapture('full')">Full page</span>
          <span @click="startCapture('visible')">Visible page</span>
        </template>
      </div>
    </div>

    <div 
      class="mditor-writeBox"
      v-if="mode === 'write'">
      <textarea 
        v-model="contents"
        ref='textarea'
        placeholder="Write your content"
        spellcheck="false"
        @input="autoHeight($event.target)"
        @keydown.tab.prevent="indentText"
      />
    </div>

    <div 
      class="mditor-previewBox markdown-preview" 
      v-else
      v-html="parsedText"
    />

    <div class="mditor-footer">
      submit
    </div>
    
  </div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';

import Capture from './capture';

marked.setOptions({
  highlight: code => hljs.highlightAuto(code).value,
  breaks: true,
});

export default {
  name: 'Mditor',
  data: () => ({
    title: '',
    contents: '',

    tabs: ['write', 'preview'],
    mode: 'write',

    capture: {
      active: false,
      v: undefined,
    },
  }),
  computed: {
    parsedText() {
      return marked(this.contents) || 'Type contents first!';
    },
  },
  watch: {
    mode(v) {
      if (v === 'write') {
        this.$nextTick(() => {
          this.autoHeight(this.$refs.textarea);
        });
      }
    },
  },
  methods: {
    autoHeight(target) {
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    },

    startCapture(type) {
      const capture = new Capture(type);
      // capture.init();

      this.capture = {
        active: true,
        v: capture,
      };
    },
    cropCapture() {
      this.capture.v.crop().then((imgURL) => {
        this.contents = `![](${imgURL})\n${this.contents}`;
      });
    },
    cancelCaptue() {
      // this.capture.v.destroy();

      this.capture = {
        active: false,
        v: undefined,
      };
    },

    indentText(e) {
      const {
        selectionStart: startPos,
        selectionEnd: endPos,
        value: inputVal,
      } = e.target;

      // 2 spaces
      const indent = '  ';

      let selectionPrev = inputVal.substring(0, startPos);
      let selection = inputVal.substring(startPos, endPos);
      const selectionNext = inputVal.substring(endPos);

      // if text selection
      if (startPos !== endPos) {
        // find line start position
        const lineStartPos = startPos - selectionPrev.split('\n').pop().length;

        let startIndentLength = indent.length;
        let endIndentLength = indent.length;

        // indent
        if (!e.shiftKey) {
          selectionPrev = selectionPrev.substring(0, lineStartPos) +
                          indent +
                          selectionPrev.substring(lineStartPos, startPos);

          // line break => line break + indent
          selection = selection.replace(/\n/g, `\n${indent}`);

        // unindent - shift + tab
        } else {
          // line start with indent
          if (inputVal.substr(lineStartPos, 1) === ' ') {
            startIndentLength = -startIndentLength;

            // Indent is in start of selection
            if (lineStartPos === startPos) {
              startIndentLength = 0;
              endIndentLength = 0;
              selection = selection.substring(indent.length);

            // Indent is before selection
            } else {
              endIndentLength = -endIndentLength;
              selectionPrev = selectionPrev.substring(0, lineStartPos) +
                              selectionPrev.substring(lineStartPos + indent.length);
            }
          } else {
            startIndentLength = 0;
            endIndentLength = 0;
          }

          selection = selection.replace(new RegExp(`\n${indent}`, 'g'), '\n');
        }

        // set indented value
        e.target.value = selectionPrev + selection + selectionNext;

        e.target.selectionStart = startPos + startIndentLength;
        e.target.selectionEnd = startPos + selection.length + endIndentLength;

      // just tab not selection
      } else {
        e.target.value = selectionPrev + indent + selectionNext;
        e.target.selectionStart = startPos + indent.length;
        e.target.selectionEnd = startPos + indent.length;
      }
    },
  },
};
</script>
