<template>
  <asp-auth :authIsValid="authIsValid" />
  <asp-header :authIsValid="authIsValid" />
  <main>
    <asp-alert v-if="hasMessage" :code="code" :status="status" />
    <router-view v-if="authIsValid"></router-view>
  </main>
</template>

<script>
import AspHeader from '@/components/Header.vue';
import AspAlert from '@/components/Alert.vue';
import AspAuth from '@/components/Authentification/Auth.vue';
import useUserStore from '@/stores/user';
import useAlertStore from '@/stores/alert';
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
      code: '',
      status: ''
    };
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(useAlertStore, ['hasMessage'])
  },
  watch: {
    '$route'() {
      this.authIsValid = validateAuth(this.$router.meta?.requiresAuth, this.userLoggedIn);
      if (this.hasMessage) {
        let globalMessage = useAlertStore().getMessage();
        this.code = globalMessage.code;
        this.status = globalMessage.status;
      }
    }
  }
};
</script>
