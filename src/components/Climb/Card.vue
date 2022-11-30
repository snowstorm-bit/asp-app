<template>
  <div class="card" style="width: 18rem;">
    <div class="card-body card-img-container">
      <div class="position-relative">
        <img :src="imageUrl" class="card-img-top" />
        <div class="card-overlay rounded-top">
          <div class="card-text text-start">
            <!--TODO -->
            <div class="fw-semibold border-bottom">
              {{ title }}&nbsp;>&nbsp;
              <!--              <router-link :to="{name : 'PlaceDetails', params: {placeTitle: placeTitle}}">-->
              <!--                {{ placeTitle }}-->
              <!--              </router-link>-->
            </div>
            <p>{{ description }}</p>

          </div>
          <div class="d-flex justify-content-end">
            <!--TODO -->
            <a :href="link" class="btn btn-sm btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
      <div class="card-body d-flex justify-content-between align-items-center flex-wrap">
        <h5 class="card-title mb-0">{{ title }}</h5>
        <asp-rate :is-user-rate="false" :rate="rate" :star-rate-class="'fs-5'" :text-rate-class="'fs-6'"></asp-rate>
      </div>
    </div>
  </div>
</template>

<script>

import AspRate from '@/components/Rate/Display/Rate.vue';

export default {
  name: 'Climb-Card',
  components: { AspRate },
  props: ['title', 'placeTitle', 'description', 'imageUrl', 'link', 'rate']
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: underline;
  color: white;
  transition: 0.4s;

  &:hover {
    cursor: pointer;
  }
}

.card-body:hover .card-overlay {
  padding: 0.5rem;
  position: absolute;
  bottom: 0;
  opacity: 100%;
  display: block;
  background: rgba(0, 0, 0, 0.49);
  color: white;
  max-height: 10rem;
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.card-body .card-overlay {
  width: 100%;
  max-height: 0;
  overflow-y: hidden;
  opacity: 0;
}

.card-img-container {
  padding: 0;
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