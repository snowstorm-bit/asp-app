<template>
  <div class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div v-for="(imageUrl, i) in imageUrls" :key="imageUrl" :class="{'active': i === 0}" class="carousel-item">
        <div class="img-container">
          <img :alt="imagesFrom" :src="`/api/${imageUrl}`" class="card-img-top" />
        </div>
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

<style lang="scss" scoped>
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
</style>