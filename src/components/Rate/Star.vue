<template>
  <transition name="color">
    <i :class="starHiddenClass" class="bi"></i>
  </transition>
</template>

<script>
export default {
  name: 'Stars-Star',
  props: ['starHiddenClass']
};
</script>

<style scoped>
.bi-star-fill {
  color: #EF767A;
  transition: 0.3s;
}

.bi-star {
  color: inherit;
  transition: 1s;
}

.color-enter-from {
  color: inherit;
}

.color-enter-from {
  transition: all 4s linear;
}
</style>