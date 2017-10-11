<template>
  <div class="mditor">
    <textarea 
      v-model="texts"
      @input="autoHeight"
      @keydown.tab.prevent="indentText"
    />  
  </div>
</template>

<script>
export default {
  name: 'Mditor',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    texts: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      },
    },
  },
  methods: {
    autoHeight(e) {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    },
    indentText(e) {
      // https://github.com/kazzkiq/CodeFlask.js/blob/master/src/codeflask.js
      // CodeFlask.prototype.handleInput
      const {
        selectionStart: startPos,
        selectionEnd: endPos,
        value: inputVal,
      } = e.target;

      // tab = 4 spaces
      const indent = '    ';

      let selectionPrev = inputVal.substring(0, startPos);
      let selection = inputVal.substring(startPos, endPos);
      const selectionNext = inputVal.substring(endPos);

      // if text selection
      if (startPos !== endPos) {
        // find line start position
        const lineStartPos = startPos - selectionPrev.split('\n').pop().length;

        const startIndentLength = indent.length;
        const endIndentLength = indent.length;

        // indent
        if (!e.shiftKey) {
          selectionPrev = selectionPrev.substring(0, lineStartPos) +
                          indent +
                          selectionPrev.substring(lineStartPos, startPos);

          // line break => line break + indent
          selection = selection.replace(/\n/g, `\n${indent}`);

        // unindent - shift + tab
        } else {
          //
        }

        // set indented value
        e.target.value = selectionPrev + selection + selectionNext;

        e.target.selectionStart = startPos + startIndentLength;
        e.target.selectionEnd = startPos + selection.length + endIndentLength;

      // just tab not selection
      } else {
        e.target.value = selectionPrev + indent + selectionNext;
        e.target.selectionStart = startPos + indent;
        e.target.selectionEnd = startPos + indent;
      }
    },
  },
};
</script>
