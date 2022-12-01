<template>
  <div id="auth-modal" ref="authModal" aria-hidden="true" aria-labelledby="Modal d'authentification"
       class="modal fade" tabindex="-1">
    <div class="modal-lg modal-dialog modal-dialog-centered">
      <div class="modal-content p-2">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('auth.title') }}</h5>
          <button v-if="code.length === 0" aria-label="Close" class="btn-close" data-bs-dismiss="modal"
                  type="button"></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <!-- Tabs -->
          <div class="d-flex justify-content-center btn-group mb-4" role="group">
            <button :class="{
                  'btn-primary': tab === 'login',
                  'text-decoration-underline': tab === 'register',
                }" class="btn rounded py-3 px-4"
                    type="button"
                    @click.prevent="tab = 'login'">
              {{ $t('auth.login_tab') }}
            </button>
            <button :class="{
                  'btn-primary': tab === 'register',
                  'text-decoration-underline': tab === 'login',
                }"
                    class="btn rounded py-3 px-4"
                    type="button"
                    @click.prevent="tab = 'register'">
              {{ $t('auth.register_tab') }}
            </button>
          </div>

          <asp-alert v-if="code.length > 0" :code="code" :status="status" />

          <!-- Form -->
          <auth-login v-if="tab === 'login'" ref="login" />
          <auth-register v-else ref="register" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia';
import AuthLogin from '@/components/Authentification/Login.vue';
import AuthRegister from '@/components/Authentification/Register.vue';
import AspAlert from '@/components/Alert.vue';
import useUserStore from '@/stores/user';
import useAlertStore from '@/stores/alert';
import { status } from '@/includes/enums';
import errors from '@/includes/errors.json';
import $ from 'jquery';

export default {
  name: 'Asp-Auth',
  props: ['authIsValid'],
  components: {
    AuthLogin,
    AuthRegister,
    AspAlert
  },
  data() {
    return {
      tab: 'login',
      code: '',
      status: ''
    };
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(useAlertStore, ['hasAuthInvalidMessage']),
    ...mapWritableState(useUserStore, ['modalIsOpened'])
  },
  methods: {
    ...mapActions(useAlertStore, ['getAuthInvalid'])
  },
  watch: {
    '$route'() {
      if (this.hasAuthInvalidMessage) {
        this.$refs.authModal.dataset.bsBackdrop = 'static';
        this.$refs.authModal.dataset.bdKeyboard = this.authIsValid;
        (new bootstrap.Modal($('#auth-modal')[0])).toggle();
        let authInvalid = this.getAuthInvalid();
        if (authInvalid !== undefined) {
          this.code = authInvalid.code;
          this.status = authInvalid.status;
        }
      } else if (!this.authIsValid) {
        this.$refs.authModal.dataset.bsBackdrop = 'static';
        this.$refs.authModal.dataset.bdKeyboard = this.authIsValid;
        this.code = errors.auth.login_required;
        this.status = status.error;
      }
    },
    'modalIsOpened'() {
      this.$refs[this.tab].resetForm();
      this.modalIsOpened = false;
    }
  }
};
</script>

<style scoped>
.btn-close {
  padding: 0 0.4rem !important;
}
</style>