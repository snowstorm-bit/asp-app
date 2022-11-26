<template>
  <asp-auth :authIsValid="authIsValid" />
  <asp-header :authIsValid="authIsValid" />
  <main>
    <asp-alert v-if="message.length > 0" :message="message" :status="status" />
    <router-view v-if="authIsValid"></router-view>
  </main>
</template>

<script>
import AspHeader from '@/components/Header.vue';
import AspAuth from '@/components/Authentification/Auth.vue';
import AspAlert from '@/components/Header.vue';
import useUserStore from '@/stores/user';
import { mapState } from 'pinia';
import { validateAuth } from '@/includes/validation.js';

export default {
  name: 'App',
  components: {
    AspHeader,
    AspAuth,
    AspAlert
  },
  data() {
    return {
      authIsValid: true,
      message: '',
      status: ''
    };
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn'])
  },
  watch: {
    '$router'() {
      this.authIsValid = validateAuth(this.$router.meta?.requiresAuth, this.userLoggedIn);
      if (localStorage.hasOwnProperty('globalMessage')) {
        let globalMessage = localStorage.getItem('globalMessage');
        this.message = globalMessage.code;
        this.status = globalMessage.status;
      }
    }
  }
};
</script>
