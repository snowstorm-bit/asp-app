<template>
  <div id="auth-modal" aria-hidden="true" aria-labelledby="Modal d'authentification" class="modal fade" tabindex="-1">
    <div class="modal-lg modal-dialog modal-dialog-centered">
      <div class="modal-content p-2">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('auth.title') }}</h5>
          <button v-if="!authIsValid" aria-label="Close" class="btn-close" data-bs-dismiss="modal"
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

          <asp-alert v-if="message.length > 0" :message="message" :status="status" />

          <!-- Form -->
          <auth-login v-if="tab === 'login'" />
          <auth-register v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthLogin from '@/components/Authentification/Login.vue';
import AuthRegister from '@/components/Authentification/Register.vue';
import AspAlert from '@/components/Header.vue';

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
      message: '',
      status: ''
    };
  },
  watch: {
    '$router'() {
      if (localStorage.hasOwnProperty('authInvalid')) {
        let authInvalid = localStorage.getItem('authInvalid');
        this.message = authInvalid.code;
        this.status = authInvalid.status;
      }
    }
  }
};
</script>
