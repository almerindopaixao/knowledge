<template>
  <div class="user-admin">
    <b-form>
      <input type="hidden" id="user-id" v-model="user.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Nome:" label-for="user-name">
            <b-form-input
              id="user-name"
              type="text"
              v-model="user.name"
              required
              placeholder="Informe o nome do usuário..."
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Email:" label-for="user-email">
            <b-form-input
              id="user-email"
              type="email"
              v-model="user.email"
              required
              placeholder="Informe o email do usuário..."
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-checkbox switch id="user-admin" v-model="user.admin" class="my-3">
        Administrador
      </b-form-checkbox>
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Senha:" label-for="user-password">
            <b-form-input
              id="user-password"
              type="password"
              v-model="user.password"
              required
              placeholder="Informe a senha do usuário..."
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group
            label="Confirmação de senha:"
            label-for="user-confirm-password"
          >
            <b-form-input
              id="user-confirm-password"
              type="password"
              v-model="user.confirmPassword"
              required
              placeholder="Confirme a senha do usuário..."
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <b-button variant="primary" @click="save" v-if="mode === 'save'">
      Salvar
    </b-button>
    <b-button variant="danger" @click="remove" v-if="mode === 'remove'">
      Excluir
    </b-button>
    <b-button class="ml-2" type="reset" @click="reset">
      Cancelar
    </b-button>
    <hr />
    <b-table hover striped :items="users" :fields="fields"></b-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  admin: boolean;
}

interface Field {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (value: boolean) => string;
}

type Data = {
  mode: 'save' | 'remove';
  user: User;
  users: Array<User>;
  fields: Array<Field>;
};

export default Vue.extend({
  name: 'UserAdmin',
  data(): Data {
    return {
      mode: 'save',
      user: {
        id: 0,
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        admin: false,
      },
      users: [],
      fields: [
        {
          key: 'id',
          label: 'Código',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Nome',
          sortable: true,
        },
        {
          key: 'email',
          label: 'E-mail',
          sortable: true,
        },
        {
          key: 'admin',
          label: 'Administrador',
          sortable: true,
          formatter: value => (value ? 'Sim' : 'Não'),
        },
        {
          key: 'actions',
          label: 'Ações',
        },
      ],
    };
  },

  methods: {
    async loadUsers() {
      try {
        const { data } = await this.$api.get('/users');
        this.users = data;
      } catch (err) {
        console.log(err);
      }
    },

    reset() {
      this.mode = 'save';
      this.user = {
        id: 0,
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        admin: false,
      };
      this.loadUsers();
    },
  },

  mounted() {
    this.loadUsers();
  },
});
</script>

<style></style>
