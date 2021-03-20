<template>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Content',
});
</script>

<style lang="scss" scoped>
.content {
  grid-area: content;
  background-color: #efef;
  padding: 20px;
}
</style>
