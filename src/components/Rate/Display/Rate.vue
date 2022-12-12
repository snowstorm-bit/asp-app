<template>
  <div class="d-flex align-items-center flex-wrap">
    <div :class="starRateClass" class="star-ratings me-2">
      <div :style="{width: getFilledRatingsWith + '%'}" class="filled-ratings">
        <span class="d-flex flex-nowrap">
          <stars-star v-for="i in numberOfStars" :key="i" :starHiddenClass="getStarHiddenClass(i)"></stars-star>
        </span>
      </div>
      <div v-if="!isUserRate" class="empty-ratings">
        <span>
          <stars-star v-for="i in numberOfStars" :key="i"
                      :starHiddenClass="{'bi-star-fill':fillEmptyStars, 'bi-star': !fillEmptyStars}"></stars-star>
        </span>
      </div>
    </div>
    <p :class="textRateClass" class="mb-0 me-2">{{ this.rate }} / {{ numberOfStars }}</p>
    <p v-if="votes" :class="textRateClass" class="mb-0">({{ votes }} {{ $t('display_text.rate.votes') }})</p>
  </div>
</template>

<script>
import StarsStar from '@/components/Rate/Star.vue';
import { round } from '@/includes/utils';

export default {
  name: 'Asp-Rate',
  components: { StarsStar },
  props: ['rate', 'votes', 'isUserRate', 'textRateClass', 'starRateClass', 'fillEmptyStars'],
  data() {
    let data = {};
    data.numberOfStars = 5;
    data.starHiddenClass = 'empty-star';
    return data;
  },
  computed: {
    getStarHiddenClass() {
      return index => {
        let selectedStarValid = this.rate > 0 && index <= this.rate || this.rate > index - 1;
        return selectedStarValid ? 'bi-star-fill' : 'bi-star';
      };
    },
    getFilledRatingsWith() {
      return round((this.rate / 5) * 100);
    }
  }
};
</script>

<style lang="scss" scoped>
.star-ratings {
  color: grey;
  font-size: 64px;
  position: relative;
  margin: 0;
  padding: 0;

  .filled-ratings {
    color: #EF767A;
    padding: 0;
    position: absolute;
    z-index: 1;
    display: block;
    top: 0;
    left: 0;
    overflow: hidden;

    // Allows us to grab the width of the span elements
    span {
      display: inline-block;
    }
  }

  .empty-ratings {
    color: #EF767A;
    filter: brightness(70%);
    padding: 0;
    display: block;
    z-index: 0;

    .bi-star-fill {
      color: inherit;
      filter: brightness(0.75);
    }
  }
}
</style>