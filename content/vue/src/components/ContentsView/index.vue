<template>
  <div class="contentsView">

    <header-nav />

    <content-body />

    <footer-tab />    
    
  </div>
</template>

<script>
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

export default {
  name: 'ContentsView',
  components: {
    HeaderNav: Header,
    ContentBody: Body,
    FooterTab: Footer,
  },
};
</script>
