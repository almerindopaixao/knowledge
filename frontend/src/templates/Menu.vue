<template>
  <aside v-show="isMenuVisible" class="menu"></aside>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import Vue from 'vue';

export default Vue.extend({
  name: 'Menu',
  computed: {
    ...mapState(['isMenuVisible']),
  },
});
</script>

<style lang="scss" scoped>
.menu {
  grid-area: menu;
  background: linear-gradient(to right, #232526, #414345);

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
</style>
