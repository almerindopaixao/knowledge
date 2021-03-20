<template>
  <div class="user-dropdown">
    <div class="user-button">
      <span class="d-none d-sm-block">{{ user.name }}</span>
      <div class="user-dropdown-img">
        <Gravatar :email="user.email" alt="User" />
      </div>
      <i class="fa fa-angle-down"></i>
    </div>
    <div class="user-dropdown-content">
      <router-link to="/admin">
        <i class="fa fa-cogs"></i>
        Administração
      </router-link>
      <a href="#"><i class="fa fa-sign-out"></i> Sair </a>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import Gravatar from 'vue-gravatar';
import Vue from 'vue';

export default Vue.extend({
  name: 'UserDropdown',
  components: { Gravatar },
  computed: {
    ...mapState(['user']),
  },
});
</script>

<style lang="scss" scoped>
.user-dropdown {
  position: relative;
  height: 100%;

  &:hover .user-dropdown-content {
    visibility: visible;
    opacity: 1;
  }
}

.user-button {
  display: flex;
  align-items: center;
  color: #fff;
  font-weight: 100;
  height: 100%;
  padding: 0px 20px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

.user-dropdown-img {
  margin: 0px 10px;

  > img {
    max-height: 37px;
    border-radius: 5px;
  }
}

.user-dropdown-content {
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  min-width: 170px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 1;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;

  a {
    text-decoration: none;
    color: #000;
    padding: 10px;

    &:hover {
      background-color: #ededed;
    }
  }
}
</style>
