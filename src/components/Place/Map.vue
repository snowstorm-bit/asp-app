<template>
  <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
</template>

<script>
export default {
  name: 'Map',
  props: ['latitude', 'longitude', 'markerDraggable']
};
</script>

<style scoped>

</style>