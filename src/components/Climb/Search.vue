<template>
  <div id="asp-search" class="row position-relative" style="width: 100%;">
    <div v-for="climb in items" v-if="items.length > 0" :key="climb.title" :class="colClass" class="asp__seach-climbs">
      <climb-card :description="climb.description" :image-url="`/api/${climb.image}`" :is-admin="isAdmin"
                  :place-title="climb.placeTitle" :rate="climb.rate" :title="climb.title"
                  :votes="climb.votes" @[climbToDeleteSelected]="setClimbTitle" />
    </div>
    <div v-else class="position-absolute d-flex justify-content-center align-items-center h-100">
      {{ $t('empty_result.climb.none') }}
    </div>
  </div>
</template>

<script>
import ClimbCard from '@/components/Climb/Card.vue';
import { CLIMB_TO_DELETE_SELECTED } from '@/includes/events';

export default {
  name: 'Asp-Search-Climbs',
  props: ['items', 'colClass', 'isAdmin'],
  emits: [CLIMB_TO_DELETE_SELECTED],
  components: { ClimbCard },
  data() {
    return {
      climbToDeleteSelected: CLIMB_TO_DELETE_SELECTED
    };
  },
  methods: {
    setClimbTitle(value) {
      console.log('asp-search-climbs emitting setClimbTitle');
      this.$emit(CLIMB_TO_DELETE_SELECTED, value);
    }
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