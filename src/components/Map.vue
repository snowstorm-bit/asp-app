<template>
  <GoogleMap id="div-map" :center="center" :zoom="5" :zoom-control="true"
             api-key="AIzaSyB--fzpW892yY2jxJ7Nb4o5QG6GAMdGwWc"
             style="width: 100%;min-height:18rem">
    <Marker :data-bs-title="markerTitle" :options="marker"
            data-bs-placement="top" data-bs-toggle="tooltip"
            @mouseup="updateMarkerPosition" />
  </GoogleMap>
</template>

<script>

import { GoogleMap, Marker } from 'vue3-google-map';

export default {
  name: 'Asp-Map',
  props: ['latitude', 'longitude', 'markerDraggable', 'markerTitle'],
  components: {
    GoogleMap,
    Marker
  },
  data() {
    let center = {
      lat: this.latitude,
      lng: this.longitude
    };
    return {
      center: center,
      marker: {
        draggable: this.markerDraggable,
        position: center,
        title: this.markerTitle
      }
    };
  },
  methods: {
    updateMarkerPosition() {
      console.log(this.marker.position);

    }
  }
};
</script>

<style lang="scss" scoped>
</style>