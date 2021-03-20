<template>
  <header class="header">
    <a v-if="!hideToggle" class="toggle" @click.prevent="toggleMenu">
      <i class="fa fa-lg" :class="icon"></i>
    </a>
    <h1 class="title">
      <router-link to="/">
        {{ title }}
      </router-link>
    </h1>
    <UserDropdown v-if="!hideUserDropdown" />
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import UserDropdown from '../components/UserDropdown.vue';

export default Vue.extend({
  name: 'Header',
  components: { UserDropdown },
  props: {
    title: {
      type: String,
      required: true,
    },
    hideToggle: Boolean,
    hideUserDropdown: Boolean,
  },

  computed: {
    icon(): string {
      return this.$store.state.isMenuVisible
        ? 'fa-angle-left'
        : 'fa-angle-down';
    },
  },

  methods: {
    toggleMenu(): void {
      this.$store.commit('toggleMenu');
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  grid-area: header;
  background: linear-gradient(to right, #1e469a, #49a7c1);

  display: flex;
  justify-content: center;
  align-items: center;

  > a.toggle {
    width: 60px;
    height: 100%;
    color: #fff;
    justify-self: flex-start;
    text-decoration: none;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
  }
}

.title {
  font-size: 1.2rem;
  color: #fff;
  font-weight: 100;
  flex-grow: 1;
  text-align: center;

  a {
    color: #fff;
    text-decoration: none;
  }
}
</style>
