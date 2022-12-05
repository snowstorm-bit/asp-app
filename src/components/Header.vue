<template>
  <header>
    <nav class="navbar navbar-expand-md bg-light">
      <div class="container-fluid">
        <button aria-controls="asp-navbar-toggler" aria-expanded="false" aria-label="Toggle navigation"
                class="navbar-toggler"
                data-bs-target="#asp-navbar-toggler" data-bs-toggle="collapse" type="button">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div>
          <router-link id="logo-link" :to="{ name: 'Home' }" class="navbar-brand">
            <img id="logo" alt="Logo" src="/logo.png" />
          </router-link>
        </div>
        <div id="asp-navbar-toggler" class="collapse navbar-collapse">
          <div class="navbar-nav me-auto mb-lg-0">
            <router-link :to="{ name: 'Home' }" aria-current="page" class="nav-item nav-link-header active">
              {{ $t('header.nav_items.home') }}
            </router-link>
            <router-link :to="{name: 'Climbs'}" class="nav-item nav-link-header" v-if="true === false">
              {{ $t('header.nav_items.climbs') }}
            </router-link>
          </div>
          <div v-if="userLoggedIn" id="user-menu" class="btn-group">
            <button :disabled="modalIsOpened" aria-expanded="false" class="btn btn-outline-primary dropdown-toggle"
                    data-bs-toggle="dropdown" type="button">
              <i class="bi bi-person-fill"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end">
              <a class="ps-2" @click.prevent="signOut">{{ $t('auth.sign_out') }}</a>
            </div>
          </div>
          <a v-else ref="authLink" class="ps-2 nav-link-header" data-bs-target="#auth-modal" data-bs-toggle="modal"
             @click="onOpenModal">
            {{ $t('auth.login_tab') }} / {{ $t('auth.register_tab') }}
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia';
import useUserStore from '@/stores/user';

export default {
  name: 'Asp-Header',
  props: ['authIsValid'],
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapWritableState(useUserStore, ['modalIsOpened'])
  },
  methods: {
    ...mapActions(useUserStore, { userStoreSignOut: 'signOut' }),
    signOut() {
      this.userStoreSignOut();

      if (this.$router.meta?.requiresAuth) {
        this.$router.push({ name: 'home' });
      }

      this.$router.go();
    },
    onOpenModal() {
      if (!this.modalIsOpened) {
        this.modalIsOpened = true;
      }
    }
  },
  updated() {
    if (!this.authIsValid) {
      this.$refs.authLink.click();
    }
  }
};
</script>

<style lang="scss" scoped>
#user-menu {
  z-index: 99999999999;
}

nav {
  padding: 0.5rem 2rem !important;
}

#logo {
  width: 40px;
  height: 40px;
  position: relative;
  top: -5px;
}

.nav-link-header {
  color: #002f3e !important;
  margin: 0.25rem !important;
  padding: 0.25rem 0.5rem !important;
  border: 1px solid transparent !important;
  text-decoration: none !important;

  &:hover {
    border: 1px solid #002f3e !important;
    border-radius: 5px !important;
    color: #002f3e;
  }
}

.navbar-toggler {
  border: 0 !important;
  line-height: 0 !important;
  background-color: transparent !important;
}

</style>