<template>
  <div id="error-message" class="d-block justify-content-center">
    <img src="/logo.png" class="opacity-50"/>
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
}

img {
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -110%);
  transform: translate(-50%, -110%);
  z-index: 0;
}
#error-message {
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>