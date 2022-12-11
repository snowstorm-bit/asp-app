<template>
  <div :class="starsSize" class="star-ratings">
    <div class="d-flex">
      <stars-star v-for="i in numberOfStars" :key="i" :starHiddenClass="getStarHiddenClass(i)"
                  @click="selectStar(i)" @mouseenter="hoverStar(i)" @mouseleave="hoveredStar = -1"></stars-star>
    </div>
  </div>
</template>

<script>
import StarsStar from '@/components/Rate/Star.vue';
import { RATE_SELECTED } from '@/includes/events';

export default {
  name: 'Asp-Rate-Form',
  props: {
    'starsSize': String,
    'selectedStar': Number
  },
  emits: [RATE_SELECTED],
  components: { StarsStar },
  data() {
    let data = {};
    data.hoveredStar = this.selectedStar;
    data.numberOfStars = 5;
    data.starHiddenClass = 'empty-star';
    return data;
  },
  computed: {
    getStarHiddenClass() {
      return index => {
        let hoveredStarValid = this.hoveredStar > 0 && index <= this.hoveredStar;
        let selectedStarValid = this.hoveredStar < 1 && this.selectedStar > 0 && index <= this.selectedStar;
        return hoveredStarValid || selectedStarValid ? 'bi-star-fill' : 'bi-star';
      };
    }
  },
  methods: {
    hoverStar(index) {
      this.hoveredStar = index;
    },
    selectStar(index) {
      let selectedStar = this.selectedStar === index ? 0 : index;
      this.hoveredStar = selectedStar;
      this.$emit(RATE_SELECTED, selectedStar);
    }
  }
};
</script>

<style lang="scss" scoped>
.star-ratings {
  color: grey;
  position: relative;
  margin: 0;
  padding: 0;

  &:active {
    filter: brightness(0.85);
  }
}
</style>