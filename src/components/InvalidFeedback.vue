<template>
  <transition-group name="fade">
    <template v-if="error.length > 0">
      <div v-if="typeof error === 'string'" class="text-danger fs-sm">{{ $t(error) }}</div>
      <div v-for="err in error" v-else class="text-danger fs-sm">{{ $t(err) }}</div>
    </template>
  </transition-group>
</template>

<script>
export default {
  name: 'Invalid-Feedback',
  props: ['error']
};
</script>

<style scoped>
div {
  padding-left: 0.1rem;
}

</style>