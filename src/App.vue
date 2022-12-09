<template>
  <asp-auth :authIsValid="authIsValid" />
  <asp-header :authIsValid="authIsValid" />
  <main>
    <asp-alert v-if="hasGlobalMessage || code.length > 0" :code="code" :status="status" />
    <router-view v-if="authIsValid" class="container-fluid container"></router-view>
  </main>
</template>

<script>
import AspHeader from '@/components/Header.vue';
import AspAlert from '@/components/Alert.vue';
import AspAuth from '@/components/Authentication/Auth.vue';
import useUserStore from '@/stores/user';
import useAlertStore from '@/stores/alert';
import { mapActions, mapState, mapWritableState } from 'pinia';
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
    ...mapWritableState(useAlertStore, ['hasGlobalMessage'])
  },
  methods: {
    ...mapActions(useAlertStore, ['getGlobalMessage'])
  },
  watch: {
    '$route'() {
      console.log('app watch route');
      this.authIsValid = validateAuth(this.$route.meta.requiresAuth, this.userLoggedIn);
      console.log('authIsValid', this.authIsValid);
      if (this.hasGlobalMessage) {
        let globalMessage = this.getGlobalMessage();
        if (globalMessage !== undefined) {
          this.code = globalMessage.code;
          this.status = globalMessage.status;
        }
      }
    }
  }
};
</script>

<style>
.container {
  margin-top: 4rem;
  margin-bottom: 4rem;
}
</style>