<template>
  <div id="error-message" class="d-block justify-content-center">
    <h1 class="text-center">404</h1>
    <hr />
    <h1 class="text-center">{{ $t('errors.404') }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Asp-Error'
};

</script>

<style scoped>
main {
  background-image: url('./public/logo.png');
}

#error-message {
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>