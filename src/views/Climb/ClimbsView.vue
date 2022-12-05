<template>
  <div class="row">
    <!-- Filter menu-->
    <div>

    </div>
    <!-- Climb results -->
    <div>
      <asp-search-climbs :col-class="'col col-md-6 col-lg-4 col-xl-3'" :items="items" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Climbs-View'
};
</script>

<style scoped>

</style>