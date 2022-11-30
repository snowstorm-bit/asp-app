<template>
  <div class="star-ratings fs-3">
    <div class="d-flex">
      <stars-star v-for="i in numberOfStars" :key="i" :starHiddenClass="getStarHiddenClass(i)" @click="selectStar(i)"
                  @mouseenter="hoverStar(i)" @mouseleave="hoveredStar = -1"></stars-star>
    </div>
  </div>
</template>

<script>
import StarsStar from '@/components/Rate/Star.vue';

export default {
  name: 'Asp-Rate-Form',
  components: { StarsStar },
  data() {
    let data = {};
    data.selectedStar = 0;
    data.hoveredStar = data.selectedStar;
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
      this.selectedStar = this.selectedStar === index ? 0 : index;
      this.hoveredStar = this.selectedStar;
      console.log(this.hoveredStar);
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
}
</style>