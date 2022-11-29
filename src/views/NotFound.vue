<template>
  <div id="img-div" class="d-flex justify-content-center">
    <img class="opacity-75" src="/logo.png" />
  </div>
  <div id="error-message" class="d-block justify-content-center">
    <h1 class="text-center">404</h1>
    <hr />
    <h1 class="text-center">{{ $t('errors.404') }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Asp-Error',
  watch: {
    '$route'() {
      console.log('not found watch route');
    }
  }
};

</script>

<style scoped>

#img-div {
  width: 100%;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

img {
  width: 25%;
  filter: blur(1.1rem);
}

#error-message {
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>