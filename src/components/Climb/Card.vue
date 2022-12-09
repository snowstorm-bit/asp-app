<template>
  <div class="asp__card">
    <div class="asp__card-body card-img-container">
      <h5 class="asp__card-body position-absolute card-title mb-0 border-bottom border-end rounded-end rounded-0 bg-white bg-opacity-75">
        {{ title }}</h5>
      <div class="card-overlay d-flex flex-column fs-5">
        <div class="card-text text-start">
          <div class="d-flex justify-content-between align-items-center flex-wrap">
          </div>
          <div class="fw-semibold border-bottom d-flex flex-wrap justify-content-between align-items-baseline">
            <div>
              <router-link :to="{name: 'NotFound'}" aria-disabled="true" class="asp-link asp-link__climb-details"
                           role="link">
                {{ title }}
              </router-link>
              &nbsp;>&nbsp;
              <router-link :to="{name : 'PlaceDetails', params: {placeTitle: placeTitle}}" class="asp-link">
                {{ placeTitle }}
              </router-link>
            </div>
            <asp-rate :fill-empty-stars="true" :is-user-rate="false" :rate="rate" :star-rate-class="'fs-5'"
                      :text-rate-class="'fs-6'" :votes="votes" />
          </div>
        </div>
        <p class="text-start overflow-hidden m-0 flex-fill">{{ description }}</p>
        <div class="d-flex justify-content-end position-relative">
          <div class="d-flex justify-content-end position-absolute bottom-0 end-0">
            <router-link :to="{name: 'NotFound'}" aria-disabled="true"
                         class="btn btn-sm btn-light asp-link asp-link__climb-details fs-sm"
                         role="link">
              {{ $t('links.see_more.details') }}
            </router-link>
          </div>
        </div>
      </div>
      <div class="img-container">
        <img :src="imageUrl" class="card-img-top" />
      </div>
    </div>
  </div>
</template>

<script>

import AspRate from '@/components/Rate/Display/Rate.vue';

export default {
  name: 'Climb-Card',
  components: { AspRate },
  props: ['title', 'placeTitle', 'description', 'imageUrl', 'rate', 'votes']
};
</script>

<style lang="scss" scoped>
.asp-link {
  text-decoration: none;
  color: white;

  &:hover {
    text-decoration: underline;
    color: white;
    filter: brightness(0.75);
  }

  &__climb-details {
    text-decoration: none;
    opacity: 75%;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.asp {
  &__card-body {
    padding: 0.5rem;
    position: relative;
    transition: opacity 0.3s ease-in-out;

    &:hover {
      .asp__card-body {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }

      .card-overlay {
        padding: 0.5rem;
        opacity: 100%;
        position: absolute;
        color: white;
        height: 100%;
        max-height: 100%;
        transition: height 0.3s ease-in-out, padding 0.3s ease-in-out, opacity 0.3s ease-in-out;
      }
    }

    .card-overlay {
      width: 100%;
      max-height: 0;
      height: 0;
      position: absolute;
      opacity: 0;
      background: rgba(0, 0, 0, 0.49);
      overflow-y: hidden;
      transition: max-height 0.3s ease-in-out, height 0.3s ease-in-out, padding 0.3s ease-in-out, opacity 0.4s ease-in-out;
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}


.card-img-container {
  padding: 0;
  height: 100%;
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100%;

  img {
    flex-shrink: 0;
    min-width: 100%;
    min-height: 100%;
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
</style>