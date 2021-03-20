<template>
  <div class="home">
    <PageTitle icon="fa fa-home" main="Dashboard" sub="Base de Conhecimento" />

    <div class="stats">
      <Stat
        title="Categorias"
        :value="stat.categories"
        icon="fa fa-folder"
        color="#d54d50"
      />
      <Stat
        title="Artigos"
        :value="stat.articles"
        icon="fa fa-file"
        color="#3bc480"
      />
      <Stat
        title="Usuários"
        :value="stat.users"
        icon="fa fa-user"
        color="#3282cd"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import PageTitle from '../components/PageTitle.vue';
import Stat from '../components/Stat.vue';

export default Vue.extend({
  name: 'Home',
  components: { PageTitle, Stat },

  methods: {
    ...mapActions(['getStats']),
    ...mapMutations(['setStats']),
  },

  computed: {
    ...mapState(['stat']),
  },

  mounted() {
    const statJson = window.sessionStorage.getItem('stat');

    if (statJson) {
      this.setStats(JSON.parse(statJson));
    } else {
      this.getStats();
    }
  },
});
</script>
<style lang="scss" scoped>
.stats {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
