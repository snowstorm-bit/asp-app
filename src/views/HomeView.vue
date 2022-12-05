<template>
  <div class="asp-container">
    <img alt="Home img" class="opacity-75" src="/home-img.jpg" />
    <div class="centered">
      <h1 v-if="dataLoaded">{{ $t('app_name').toUpperCase() }}</h1>
    </div>
  </div>
  <div v-if="dataLoaded" class="m-5 ps-5 pe-5">
    <hr />
    <div class="d-flex justify-content-between align-self-baseline">
      <h2 class="fw-bold text-start mb-4 fs-4">{{ $t('home.most_popular_climbs') }}</h2>
      <router-link v-if="true === false" :to="{name: 'Climbs'}" class="asp-link">
        {{ $t('links.see_more.climb.popular') }}
      </router-link>
    </div>
    <asp-search-climbs :col-class="'col col-md-6 col-lg-4 col-xl-3'" :items="items" />
    <div v-if="true === false" class="d-flex justify-content-end">
      <router-link :to="{name: 'Climbs'}" class="asp-link">{{ $t('links.see_more.climb.all') }}</router-link>
    </div>
    <div v-if="true === true" class="mt-5">
      <hr />
      <climbs-view></climbs-view>
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
import ClimbsView from '@/views/Climb/ClimbsView.vue';

export default {
  name: 'Home-View',
  components: {
    ClimbsView,
    AspRateForm,
    AspRate,
    ClimbCard,
    AspSearchClimbs
  },
  data() {
    return {
      items: [],
      dataLoaded: false
    };
  },
  methods: {
    getURLSearchParams() {
      return new URLSearchParams(Object.entries({ offset: 0, limit: 'top-10' }));
    },
    async getData() {
      let response;
      try {
        response = await fetch(`/api/climb/all/?${ this.getURLSearchParams() }`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch {
        return {
          codes: { 'home': errors.route.home },
          status: status.error
        };
      }

      if (response.status === 500) {
        return {
          codes: { 'home': errors.route.home },
          status: status.error
        };
      }

      return await response.json();
    }
  },
  async mounted() {
    let data = await this.getData();

    for (const [key, value] of Object.entries(data.result)) {
      this[key] = value;
    }

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