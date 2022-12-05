<template>
  <div id="asp-search" class="row position-relative" style="width: 100%">
    <div v-for="climb in items" :key="climb.title" :class="colClass" class="asp__seach-climbs">
      <climb-card :description="climb.description" :image-url="`/api/${climb.image}`" :place-title="climb.placeTitle"
                  :rate="climb.rate" :title="climb.title" :votes="climb.votes" />
    </div>
  </div>
</template>

<script>
import ClimbCard from '@/components/Climb/Card.vue';

export default {
  name: 'Asp-Search-Climbs',
  props: ['items', 'colClass'],
  components: {
    ClimbCard
  },
  mounted() {
    console.log(this);
  }
};
</script>

<style scoped>
.asp__seach-climbs {
  padding: 0;
}

#asp-search {
  margin: 0;
}
</style>