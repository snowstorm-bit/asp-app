<template>
  <!-- delete climb modal -->
  <asp-modal v-if="isAdmin" :modal-id="'delete-climb'" @[deleteClimbModalConfirmEvent]="deleteClimb">
    <template v-slot:modal-title>
      <h1 class="modal-title fs-5">{{ $t('delete.climb.title') }}</h1>
    </template>
    <template v-slot:modal-body>
      <i18n-t keypath="delete.climb.confirm_message" tag="div">
        <template v-slot:climbTitle>
          <span class="mt-3 fw-bold">{{ climbTitle }}</span>
        </template>
      </i18n-t>
    </template>
  </asp-modal>
  <div class="asp-container">
    <img alt="Home img" class="opacity-75" src="/home-img.jpg" />
    <div class="centered">
      <h1 v-if="dataLoaded">{{ $t('app_name').toUpperCase() }}</h1>
    </div>
  </div>
  <div v-if="dataLoaded" class="m-5 ps-5 pe-5">
    <hr />
    <asp-alert v-if="requestStatus.length > 0" :code="requestMessage" :status="requestStatus"
               @[alertClosed]="requestStatus = ''; requestMessage = '';" />
    <div class="d-flex justify-content-between align-self-baseline">
      <h2 class="fw-bold text-start mb-4 fs-4">{{ $t('home.most_popular_climbs').toUpperCase() }}</h2>
    </div>
    <asp-search-climbs :can-delete-climb="isAdmin" :col-class="'col col-md-6 col-lg-4 col-xl-3'"
                       :items="items" @[climbToDeleteSelected]="setClimbTitle" />
    <div class="mt-5 mb-5">
      <hr />
      <asp-climbs-view :is-admin="isAdmin" @[climbToDeleteSelected]="setClimbTitle"></asp-climbs-view>
    </div>
  </div>
</template>

<script>
import AspRateForm from '@/components/Rate/RateForm.vue';
import AspRate from '@/components/Rate/Display/Rate.vue';
import ClimbCard from '@/components/Climb/Card.vue';
import AspSearchClimbs from '@/components/Climb/Search.vue';
import { status } from '@/includes/enums';
import errors from '@/includes/errors.json';
import AspClimbsView from '@/views/Climb/ClimbsView.vue';
import { ALERT_CLOSED, CLIMB_TO_DELETE_SELECTED, MODAL_CONFIRMED } from '@/includes/events';
import { getHeaderAuthorization, validateIsAuth, validateNeedsAuth } from '@/includes/validation';
import useAlertStore from '@/stores/alert';
import { mapActions, mapWritableState } from 'pinia';
import useUserStore from '@/stores/user';
import AspModal from '@/components/Modal.vue';

export default {
  name: 'Home-View',
  components: {
    AspClimbsView,
    AspRateForm,
    AspRate,
    ClimbCard,
    AspSearchClimbs,
    AspModal
  },
  data() {
    return {
      items: [],
      dataLoaded: false,
      requestStatus: '',
      requestMessage: '',
      deleteClimbModalConfirmEvent: MODAL_CONFIRMED,
      climbToDeleteSelected: CLIMB_TO_DELETE_SELECTED,
      alertClosed: ALERT_CLOSED,
      climbTitle: ''
    };
  },
  computed: {
    ...mapWritableState(useUserStore, ['isAdmin'])
  },
  methods: {
    ...mapActions(useUserStore, { validateIsAdmin: 'validateUserIsAdmin' }),
    getURLSearchParams() {
      return new URLSearchParams(Object.entries({ offset: 0, limit: 'top-10' }));
    },
    setClimbTitle(value) {
      console.log('home setClimbTitle', value);
      this.climbTitle = value;
    },
    mapInvalidResponse(result) {
      let errorCode = 'authentication' in result.codes
          ? 'authentication'
          : 'home' in result.codes
              ? 'home' : '';

      if (errorCode.length > 0) {
        this.requestStatus = result.status;
        this.requestMessage = result.codes[errorCode];
      } else if ('refresh' in result.codes) { // authentication error
        this.$router.go();
      }
    },
    async manageDeleteClimbRequest() {
      let response;
      try {
        response = await fetch(`/api/climb/${ this.climbTitle }`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          }
        });
      } catch {
        return {
          codes: { 'delete_climb': errors.routes.delete.climb },
          status: status.error
        };
      }

      let data = await response.json();

      if (response.status === 500) {
        return data;
      }

      let isAuth = await validateNeedsAuth(response.status, data.codes?.authentication, false);

      if (typeof isAuth !== 'boolean') {
        useAlertStore().setMessage('globalMessage', {
          code: isAuth.codes.authentication,
          status: isAuth.status
        });

        return {
          codes: { refresh: true },
          status: status.error
        };
      }

      if (data.status === status.error) {
        return data;
      }

      useAlertStore().setMessage('globalMessage', {
        code: data.code,
        status: data.status
      });

      return { status: status.success };
    },
    async deleteClimb() {
      let result = await this.manageDeleteClimbRequest();

      if (result.status === status.error) {
        this.mapInvalidResponse(result);
      } else if (result.status === status.success) {
        this.$router.go();
      }
    },
    async getData() {
      let response;
      try {
        response = await fetch(`/api/climb/all/?${ this.getURLSearchParams() }`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          }
        });
      } catch {
        return {
          codes: { 'home': errors.routes.home },
          status: status.error
        };
      }

      if (response.status === 500) {
        return {
          codes: { 'home': errors.routes.home },
          status: status.error
        };
      }

      let data = await response.json();

      let isAuth = await validateIsAuth(data.result.isAuth, 'authentication');

      if (typeof isAuth !== 'boolean') {
        useAlertStore().setMessage('globalMessage', {
          code: isAuth.codes.authentication,
          status: isAuth.status
        });

        return {
          codes: { refresh: true },
          status: status.error
        };
      }

      return data;
    }
  },
  async mounted() {
    let data = await this.getData();

    // manage error, if so, from response
    if (data.status !== status.success) {
      this.mapInvalidResponse(data);
      if (data.status === status.error) {
        return;
      }
    }

    // map data from response to component data
    for (const [key, value] of Object.entries(data.result)) {
      this[key] = value;
    }

    this.isAdmin = this.validateIsAdmin();

    this.dataLoaded = true;
  }
};
</script>

<style lang="scss" scoped>
main {
  margin: 0 !important;

  .container {
    margin: 0 !important;
    padding: 0 !important;
  }
}

.asp-container {
  position: relative;

  img {
    filter: blur(0.15mm);
    width: 100%;
  }

  .centered {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    h1 {
      font-family: 'Castellar', serif;
      letter-spacing: 5px;
      font-size: 50px;
      font-weight: bold;
      background-image: linear-gradient(
              to right,
              #462523 0,
              #d08a19 22%,
              #f5c31e 45%,
              #eecc22 50%,
              #f5d21c 55%,
              #c98e3a 78%,
              #462523 100%
      );
      -webkit-background-clip: text;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
      color: transparent;
      filter: blur(0.12mm);
      animation-duration: 2s;
      animation-name: fade-in;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 100%;
    }
  }
}
</style>