<template>
  <div class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div v-for="[imageUrl, i] in imageUrls" class="carousel-item">
        <img :alt="imagesFrom" :src="imageUrl" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Asp-Carousel',
  props: ['imageUrls', 'imagesFrom']
};
</script>

<style scoped>

</style>