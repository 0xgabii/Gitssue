<template>
  <div class="mditor">

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

      <div class="mditor-controls__utils">
        <span @click="startCapture('full')">full-page</span>
        <span @click="startCapture('visible')">visible-part</span>

        <span @click="cropCapture">crop</span>          
      </div>
    </div>

    <div 
      class="mditor-writeBox"
      v-if="mode === 'write'">
      <textarea 
        v-model="texts"
        ref='textarea'
        @input="autoHeight($event.target)"
        @keydown.tab.prevent="indentText"
      />
    </div>

    <div 
      class="mditor-previewBox" 
      v-else
      v-html="parsedText"
    />
    
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
    tabs: ['write', 'preview'],

    mode: 'write',

    texts: '',

    capture: {
      active: false,
      loading: false,
      v: undefined,
      result: undefined,
    },
  }),
  computed: {
    parsedText() {
      return marked(this.texts);
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
      capture.init();

      this.capture.v = capture;
    },
    cropCapture() {
      this.capture.v.crop().then((imgURL) => {
        this.texts = `![](${imgURL})\n${this.texts}`;
      });
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
