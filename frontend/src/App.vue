<template>
  <div id="app" :class="{ 'hide-menu': !isMenuVisible }">
    <Header
      title="Cod3r - Base de conhecimento"
      :hideToggle="false"
      :hideUserDropdown="false"
    />
    <Menu />
    <Content />
    <Footer />
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import Vue from 'vue';
import Content from './templates/Content.vue';
import Header from './templates/Header.vue';
import Footer from './templates/Footer.vue';
import Menu from './templates/Menu.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Header,
    Content,
    Footer,
    Menu,
  },
  computed: {
    ...mapState(['isMenuVisible']),
  },
});
</script>

<style lang="scss">
* {
  font-family: 'Lato', sans-serif;
}

body {
  margin: 0;
}

#app {
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */

  height: 100vh;
  display: grid;
  grid-template-rows: 60px 1fr 40px;
  grid-template-columns: 300px 1fr;
  grid-template-areas:
    'header header'
    'menu content'
    'menu footer';

  &.hide-menu {
    grid-template-areas:
      'header header'
      'content content'
      'footer footer';
  }
}
</style>
