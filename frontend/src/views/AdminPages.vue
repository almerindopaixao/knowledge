<template>
  <div class="admin-pages">
    <PageTitle
      icon="fa fa-cogs"
      main="Administração do sistema"
      sub="Cadastro & Cia"
    />
    <div class="admin-pages-tabs">
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Artigos" active>
            <article-admin />
          </b-tab>
          <b-tab title="Categorias">
            <category-admin />
          </b-tab>
          <b-tab title="Usuários">
            <user-admin />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PageTitle from '../components/PageTitle.vue';
import ArticleAdmin from '../components/ArticleAdmin.vue';
import CategoryAdmin from '../components/CategoryAdmin.vue';
import UserAdmin from '../components/UserAdmin.vue';

export default Vue.extend({
  name: 'Home',
  components: { PageTitle, ArticleAdmin, CategoryAdmin, UserAdmin },
});
</script>
