<template>
  <footer class="footer">
    <span>Copyright <strong>Cod3r</strong> &copy; 2021</span>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Footer',
});
</script>

<style lang="scss" scoped>
.footer {
  grid-area: footer;
  background-color: #ddd;
  color: #333;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
}
</style>
