<template>
  <div v-if="dataLoaded">
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
    <!-- displayed content -->
    <asp-alert v-if="requestStatus.length > 0" :code="requestMessage" :status="requestStatus"
               @[alertClosed]="requestStatus = ''; requestMessage = '';" />
    <div :class="{'d-flex justify-content-between align-items-center': userLoggedIn}">
      <h2 :class="{'flex-fill':userLoggedIn}">{{ $t('details.climb.details') }}</h2>
      <div v-if="userLoggedIn" class="d-flex">
        [&nbsp;
        <div v-if="!isAdmin">
          <router-link :to="{name: 'ClimbCreate'}" class="asp-link">
            {{ $t('links.create') }}
          </router-link>
        </div>
        <div v-if="isCreator && !isAdmin">&nbsp;|&nbsp;<router-link
            :to="{name: 'ClimbUpdate', params: { climbTitle: climbTitle}}"
            class="asp-link">
          {{ $t('links.modify') }}
        </router-link>
        </div>
        <div v-if="isAdmin"><a
            :data-bs-target="`#delete-climb`" class="asp-link text-danger" data-bs-toggle="modal">
          {{ $t('links.delete') }}
        </a>
        </div>
        &nbsp;]
      </div>
    </div>
    <hr />
    <!-- Place details -->
    <div id="place-details" class="row d-flex align-items-start">
      <div class="col-lg-3">
        <!-- Carousel -->
        <div class="d-flex flex-column align-items-baseline">
          <div class="w-100 h-auto">
            <asp-carousel :image-urls="images"
                          :images-from="`${$t('display_text.climb_title')} ${title}`"></asp-carousel>
          </div>
          <div v-if="userLoggedIn && !isAdmin"
               class="d-flex flex-column justify-content-center align-items-center flex-wrap mt-2 m-auto">
            <p class="text-center text-black-50">{{ $t('details.climb.rate') }}</p>
            <div class="d-flex justify-content-center">
              <asp-rate-form :selected-star="userRate" stars-size="fs-4"
                             @[rateSelectedEvent]="rateClimb"></asp-rate-form>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-9 mt-4 mt-lg-0">
        <div
            class="d-flex align-items-xl-end align-items-md-end flex-column flex-xl-row flex-md-row">
          <div>
            <h3 class="mb-0">{{ title }}</h3>
            <asp-rate :fill-empty-stars="true" :is-user-rate="false" :rate="rate" :star-rate-class="'fs-3'"
                      :text-rate-class="'fs-4 fw-semibold'" :votes="votes" />
          </div>
          <div class="flex-fill d-md-flex justify-content-md-around align-self-stretch">
            <div class="border-start align-self-stretch d-none d-md-block"></div>
            <div
                class="d-flex justify-content-between flex-xl-column flex-md-column mt-3 mt-xl-0 mt-md-0 flex-wrap">
              <div class="d-flex flex-wrap">
                <p class="fw-bold me-2">{{ $t('display_text.place_title') }} :</p>
                <router-link :to="{name : 'PlaceDetails', params: {placeTitle: placeTitle}}" class="asp-link">
                  {{ placeTitle }}
                </router-link>
              </div>
              <div class="d-flex flex-wrap">
                <p class="fw-bold me-2">{{ $t('display_text.style') }} :</p>
                <p>{{ $t(`climb_style.${ style }`) }}</p>
              </div>
              <div class="d-flex flex-wrap">
                <p class="fw-bold me-2">{{ $t('display_text.difficulty_level') }} :</p>
                <p>{{ difficultyLevel }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="asp-sticky-container mt-3">
          <div aria-controls="place-description" aria-expanded="true" class="asp-sticky-title fw-bold"
               data-bs-toggle="collapse" href="#place-description" role="button">
            {{ $t('fields.description') }}
            <i :class="`bi bi-arrow-down-short pe-1`"></i>
          </div>
          <div id="place-description" class="mb-4 collapse show">{{ description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapActions, mapState, mapWritableState } from 'pinia';
import useUserStore from '@/stores/user';
import useAlertStore from '@/stores/alert';
import { status } from '@/includes/enums';
import { MODAL_CONFIRMED, RATE_SELECTED, ALERT_CLOSED } from '@/includes/events';
import {
  getHeaderAuthorization,
  validateIsAuth,
  validateNeedsAuth
} from '@/includes/validation';
import errors from '@/includes/errors.json';
import AspAlert from '@/components/Alert.vue';
import AspRate from '@/components/Rate/Display/Rate.vue';
import AspCarousel from '@/components/Carousel.vue';
import AspRateForm from '@/components/Rate/RateForm.vue';
import AspModal from '@/components/Modal.vue';

export default {
  name: 'Asp-Climb-Details',
  props: ['climbTitle'],
  components: { AspModal, AspAlert, AspRateForm, AspCarousel, AspRate },
  data() {
    return {
      dataLoaded: false,
      isCreator: false,
      requestStatus: '',
      requestMessage: '',
      title: '',
      description: '',
      style: '',
      difficultyLevel: '',
      images: '',
      placeTitle: '',
      userRate: 0,
      rate: 0,
      votes: 0,
      rateSelectedEvent: RATE_SELECTED,
      deleteClimbModalConfirmEvent: MODAL_CONFIRMED,
      alertClosed: ALERT_CLOSED
    };
  },
  computed: {
    ...mapState(useAlertStore, ['hasGlobalMessage']),
    ...mapWritableState(useUserStore, ['userLoggedIn', 'isAdmin'])
  },
  methods: {
    ...mapActions(useUserStore, { validateIsAdmin: 'validateUserIsAdmin' }),
    redirectTo404(error = null) {
      if (error !== null) {
        useAlertStore().setMessage('globalMessage', {
          code: error,
          status: status.error
        });
      }
      this.$router.push({ name: 'NotFound' });
    },
    mapInvalidResponse(result) {
      let errorCode = 'authentication' in result.codes
          ? 'authentication'
          : 'climb_details' in result.codes
              ? 'climb_details'
              : 'rate_climb' in result.codes
                  ? 'rate_climb'
                  : 'delete_climb' in result.codes
                      ? 'delete_climb' : '';

      if (errorCode.length > 0) {
        this.requestStatus = result.status;
        this.requestMessage = result.codes[errorCode];
      } else if ('refresh' in result.codes) { // authentication error
        this.$router.go();
      } else if ('not_found' in result.codes) {
        this.redirectTo404(result.codes.not_found);
      }
    },
    async addRate(rate) {
      let response;
      try {
        response = await fetch(`/api/climb/rate/${ this.climbTitle }`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          },
          body: JSON.stringify({ rate: rate })
        });
      } catch {
        return {
          codes: { 'rate_climb': errors.routes.rate.climb },
          status: status.error
        };
      }

      let data = await response.json();

      if (response.status === 500) {
        return data;
      }

      let isAuth = await validateNeedsAuth(response.status, data.codes?.authentication, false);

      if (typeof isAuth !== 'boolean') {
        isAuth.result['isCreator'] = false;
        return isAuth;
      }

      if (response.status === 404) {
        return {
          codes: { 'rate_climb': errors.routes.rate.climb },
          status: status.error
        };
      }

      return data;
    },
    async removeRate() {
      let response;
      try {
        response = await fetch(`/api/climb/rate/${ this.climbTitle }`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          }
        });
      } catch {
        return {
          codes: { 'rate_climb': errors.routes.rate.climb },
          status: status.error
        };
      }

      let data = await response.json();

      if (response.status === 500) {
        return data;
      }

      if (response.status === 404) {
        return {
          codes: { 'rate_climb': errors.routes.rate.climb },
          status: status.error
        };
      }

      let isAuth = await validateNeedsAuth(response.status, data.codes?.authentication, false);

      if (typeof isAuth !== 'boolean') {
        isAuth.result['isCreator'] = false;
        return isAuth;
      }

      return data;
    },
    async rateClimb(selectedRate) {
      let data = selectedRate > 0 ? await this.addRate(selectedRate) : await this.removeRate();
      let userRate = this.userRate;
      this.userRate = selectedRate;
      // manage error, if so, from response
      if (data.status !== status.success) {
        this.mapInvalidResponse(data);

        // reset to previous value
        this.userRate = userRate;

        if (data.status === status.error) {
          return;
        }
      } else {
        this.requestStatus = data.status;
        this.requestMessage = data.code;
      }

      // map data from response to component data
      for (const [key, value] of Object.entries(data.result)) {
        this[key] = value;
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
        isAuth.result['isCreator'] = false;
        return isAuth;
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
        this.$router.push({ name: 'Home' });
      }
    },
    async getData() {
      let response;
      try {
        response = await fetch(`/api/climb/details/${ this.climbTitle }`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          }
        });
      } catch {
        return {
          codes: { 'climb_details': errors.routes.get.details.climb },
          status: status.error
        };
      }

      if (response.status === 500) {
        return {
          codes: { 'climb_details': errors.routes.get.details.climb },
          status: status.error
        };
      }

      if (response.status === 404) {
        return {
          codes: { not_found: errors.climb.not_found },
          status: status.error
        };
      }

      let data = await response.json();

      let isAuth = await validateIsAuth(data.result.isCreator, 'climb_details');

      if (typeof isAuth !== 'boolean') {
        data.result.isCreator = false;
        isAuth.result = data.result;
        return isAuth;
      } else {
        data.result.isCreator = isAuth;
      }

      return data;
    }
  },
  async mounted() {
    // get data for place details
    let climbDetails = await this.getData();

    // manage error, if so, from response
    if (climbDetails.status !== status.success) {
      this.mapInvalidResponse(climbDetails);
      if (climbDetails.status === status.error) {
        return;
      }
    }

    // map data from response to component data
    for (const [key, value] of Object.entries(climbDetails.result)) {
      this[key] = value;
    }

    this.isAdmin = this.validateIsAdmin();

    // True to display data once it has been loaded
    this.dataLoaded = true;
  }
};
</script>

<style scoped>
p {
  margin-bottom: 0;
}
</style>