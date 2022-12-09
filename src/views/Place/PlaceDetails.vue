<template>
  <div v-if="dataLoaded">
    <asp-alert v-if="requestStatus.length > 0" :code="requestMessage" :status="requestStatus" />
    <!-- TODO : ONGET : Validate is user how has created the place -->
    <div :class="{'d-flex justify-content-between align-items-center': userLoggedIn}">
      <h2 :class="{'flex-fill':userLoggedIn}">{{ $t('details.place.details') }}</h2>
      <div v-if="userLoggedIn" class="d-flex">[&nbsp;<div>
        <router-link :to="{name: 'PlaceCreate'}" class="asp-link">
          {{ $t('links.create') }}
        </router-link>
      </div>
        <div v-if="isCreator">&nbsp;|&nbsp;<router-link :to="{name: 'PlaceUpdate', params: { placeTitle: title}}"
                                                        class="asp-link">
          {{ $t('links.modify') }}
        </router-link>
        </div>&nbsp;]
      </div>
    </div>
    <hr />
    <!-- Place details -->
    <div id="place-details" class="row d-flex">
      <div class="col-lg-5 mt-4 border-bottom">
        <h3>{{ title }}</h3>
        <div class="asp-sticky-container">
          <div aria-controls="place-description" aria-expanded="true" class="asp-sticky-title fw-bold"
               data-bs-toggle="collapse" href="#place-description" role="button">
            {{ $t('fields.description') }}
            <i :class="`bi bi-arrow-down-short pe-1`"></i>
          </div>
          <div id="place-description" class="mb-4 collapse show">{{ description }}</div>
          <div aria-controls="place-steps" aria-expanded="true" class="asp-sticky-title fw-bold"
               data-bs-target="#place-steps" data-bs-toggle="collapse" role="button">
            {{ $t('fields.steps') }}
            <i :class="`bi bi-arrow-down-short pe-1`"></i>
          </div>
          <div id="place-steps" class="collapse show mb-4">{{ steps }}</div>
        </div>
      </div>
      <div class="col-lg-7 mt-4 d-flex">
        <asp-map :latitude="latitude" :longitude="longitude" :marker-draggable="false" :marker-title="title" />
      </div>
    </div>
    <hr />
    <!-- Place climbs -->
    <h4>{{ $t('details.place.climbs') }}&nbsp;-&nbsp;({{ climbs.length }})</h4>
    <hr />
    <div v-if="climbs.length > 0" class="row mt-3">
      <!-- Styles & difficulty levels-->
      <div class="row col-lg-8">
        <div class="col-md-6 asp-sticky-container">
          <!-- Styles -->
          <h5>{{ $t('display_text.style') }}</h5>
          <template v-for="[style, climbs] of Object.entries(styles)" :key="style">
            <div :aria-controls="`style-${style}`" :data-bs-target="`#style-${style}`" aria-expanded="true"
                 class="asp-sticky-title fw-bold" data-bs-toggle="collapse" role="button">
              {{ $t('display_text.style') }}&nbsp;-&nbsp;{{ $t(`climb_style.${ style }`) }}&nbsp;({{ climbs.length }})
              <i :class="`bi bi-arrow-down-short pe-1`"></i>
            </div>
            <div :id="`style-${style}`" :class="{show: climbs.length > 0}" class="mb-3 collapse">
              <a v-for="(climb, i) in climbs" v-if="climbs.length > 0" :key="climb.title"
                 :class="{'mb-3': i === climbs.length - 1}"
                 :href="`#climb-${climb.title}`" class="asp-link m-1">
                {{ climb.title }}
              </a>
              <div v-else>{{ $t('empty_result.place.climb.style') }}</div>
            </div>
          </template>
        </div>
        <!-- Difficulty levels -->
        <div class="col-md-6 asp-sticky-container">
          <h5>{{ $t('fields.difficulty_level') }}</h5>
          <template v-for="[difficultyLevel, climbs] of Object.entries(difficultyLevels)" :key="difficultyLevel">
            <div :aria-controls="`difficulty-level-${ difficultyLevel.replace('.', '-') }`"
                 :data-bs-target="`#difficulty-level-${ difficultyLevel.replace('.', '-') }`"
                 aria-expanded="true" class="asp-sticky-title fw-bold" data-bs-toggle="collapse" role="button">
              {{ $t('display_text.difficulty_level') }}&nbsp;-&nbsp;{{ `${ difficultyLevel }` }}&nbsp;
              ({{ climbs.length }})
              <i :class="`bi bi-arrow-down-short pe-1`"></i>
            </div>
            <div :id="`difficulty-level-${ difficultyLevel.replace('.', '-') }`"
                 :class="{show: climbs.length > 0}" class="mb-3 collapse">
              <a v-for="(climb, i) in climbs" v-if="climbs.length > 0" :key="climb.title"
                 :class="{'mb-3': i === climbs.length - 1}"
                 :href="`#climb-${climb.title}`" class="asp-link m-1">
                {{ climb.title }}
              </a>
              <div v-else>{{ $t('empty_result.place.climb.difficulty_level') }}</div>
            </div>
          </template>
        </div>
      </div>
      <!-- Climbs -->
      <div class="col-lg-4">
        <div class="asp-sticky-container">
          <h5>{{ $t('details.place.climbs_list') }}</h5>
          <div v-for="(climb, i) in climbs" :id="`climb-${climb.title}`" :key="i"
               class="mb-3 d-flex align-items-center asp__climb">
            <router-link :to="{name: 'NotFound'}" aria-disabled="true" class="me-3 text-nowrap asp-link__climb-details"
                         role="link">
              {{ climb.title }}
            </router-link>
            <asp-rate :isUserRate="false" :rate="climb.rate" :star-rate-class="'fs-5'" :text-rate-class="'fs-6'"
                      :votes="climb.votes"></asp-rate>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AspMap from '@/components/Map.vue';
import { status, validationHiddenClass } from '@/includes/enums';
import { getHeaderAuthorization } from '@/includes/validation';
import errors from '@/includes/errors.json';
import warnings from '@/includes/warnings.json';
import { mapWritableState } from 'pinia';
import useUserStore from '@/stores/user';
import useAlertStore from '@/stores/alert';
import AspAlert from '@/components/Alert.vue';
import AspRate from '@/components/Rate/Display/Rate.vue';

export default {
  name: 'Asp-Place-Details',
  props: ['placeTitle'],
  components: {
    AspMap,
    AspAlert,
    AspRate
  },
  data() {
    return {
      dataLoaded: false,
      arrowDirectionClass: {
        description: 'down',
        steps: 'down',
        styles: {},
        difficultyLevels: {}
      },
      title: '',
      description: '',
      steps: '',
      latitude: 0,
      longitude: 0,
      styles: '',
      difficultyLevels: [5.6, 5.7, 5.8, 5.9, '5.10', 5.11, 5.12, 5.13, 5.14, 5.15],
      climbs: [],
      isCreator: false,
      requestStatus: '',
      requestMessage: ''
    };
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  methods: {
    setArrowDirectionClass(key, subKey = null) {
      if (subKey !== null) {
        this.arrowDirectionClass[key][subKey] = this.arrowDirectionClass[key][subKey] === 'down' ? 'up' : 'down';
      } else {
        this.arrowDirectionClass[key] = this.arrowDirectionClass[key] === 'down' ? 'up' : 'down';
      }
    },
    redirectTo404(error = null) {
      if (error !== null) {
        useAlertStore().setMessage('globalMessage', {
          code: error,
          status: status.error
        });
      }
      this.$router.push({ name: 'NotFound' });
    },
    mapInvalidResponse(result, mapForInvalidFields = true) {
      if ('home' in result.codes) {
        this.requestStatus = result.status;
        this.requestMessage = result.codes['home'];
      } else if ('refresh' in result.codes) { // authentication error
        this.$router.go();
      } else if ('not_found' in result.codes) {
        this.redirectTo404(result.codes.not_found);
      } else if (mapForInvalidFields) {
        // Map errors returned by the request
        for (const [key, value] of Object.entries(result.codes)) {
          this.errors[key] = value;
          this.hiddenClass[key] = validationHiddenClass.isInvalid;
        }
      }
    },
    async getData() {
      let response;
      try {
        response = await fetch(`/api/place/details/${ this.placeTitle }`, {
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

      if (data.result.isCreator === 401 && this.userLoggedIn) {
        if (localStorage.hasOwnProperty('user')) {
          localStorage.removeItem('user');
        } else if (localStorage.hasOwnProperty('token')) {
          localStorage.removeItem('token');
        }
        this.userLoggedIn = localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('user');
        return {
          codes: { 'place_details': warnings.auth.login_again },
          status: status.warning,
          result: data.result
        };
      }

      return await response.json();
    }
  },
  async mounted() {
    if (!useAlertStore().hasAuthInvalidMessage) {
      let placeDetails = await this.getData();
      if (placeDetails.status !== status.success) {
        this.mapInvalidResponse(placeDetails, false);
        if (placeDetails.status === status.error) {
          return;
        }
      }

      for (const [key, value] of Object.entries(placeDetails.result)) {
        this[key] = value;
      }

      let styles = {};
      for (const [_, value] of Object.entries(this.styles)) {
        let climbs = this.climbs.filter(climb => climb.style === value);
        styles[value] = climbs === undefined ? [] : climbs;
        this.arrowDirectionClass.styles[value] = 'down';
      }
      this.styles = styles;

      let difficultyLevels = {};
      this.difficultyLevels.forEach(difficultyLevel => {
        let climbs = this.climbs.filter(climb => Number(climb.difficultyLevel) === Number(difficultyLevel));
        difficultyLevels[`${ difficultyLevel }`] = climbs === undefined ? [] : climbs;
        this.arrowDirectionClass.difficultyLevels[`${ difficultyLevel }`] = 'down';
      });
      this.difficultyLevels = difficultyLevels;
    }
    this.dataLoaded = true;
  }
};
</script>

<style lang="scss" scoped>
.asp-link {
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &__climb-details {
    text-decoration: none;
    opacity: 50%;
    cursor: not-allowed;
    pointer-events: none;
  }
}

#place-details {
  min-height: 200px;
}

.asp__climb:target {
  animation: target-highlight 0.8s alternate ease-in-out;

  &:before {
    content: ">";
    width: -100%;
    position: absolute;
    transform: translate(-120%, 0);
    color: #169c93;
    margin-right: 0.25em;
  }
}

@keyframes target-highlight {
  from {
    color: inherit;
  }

  to {
    color: #169c93;
  }
}

</style>