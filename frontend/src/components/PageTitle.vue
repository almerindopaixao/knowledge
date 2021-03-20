<template>
  <div class="page-title">
    <h1>
      <i v-if="icon" :class="icon"></i>
      {{ main }}
    </h1>
    <h2>{{ sub }}</h2>
    <hr />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PageTitle',
  props: ['icon', 'main', 'sub'],
});
</script>

<style lang="scss" scoped>
.page-title {
  h1 {
    margin: 0;
  }

  h2 {
    color: #777;
    margin-top: 5px;
    font-size: 1.3rem;
  }
}
</style>
