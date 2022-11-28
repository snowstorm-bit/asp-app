<template>
  <div>
    <img alt="Home img" class="opacity-75" src="/home-img.jpg" />
    <div class="centered">
      <h1>{{ $t('app_name').toUpperCase() }}</h1>
    </div>
  </div>
  <button @click="event">404</button>
</template>

<script>
// import useUserStore from "@/stores/user";

export default {
  name: 'Home-View',
  methods: {
    event() {
      this.$router.push({ name: 'NotFound' });
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  position: relative;
  text-align: center;

  img {
    filter: blur(0.15mm);
    width: 100%;
  }

  .centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    h1 {
      font-family: 'Castellar', serif;
      letter-spacing: 5px;
      font-size: 50px;
      font-weight: bold;
      background-image: linear-gradient(
              to right,
              #462523 0,
              #d08a19 22%,
              #f5c31e 45%,
              #eecc22 50%,
              #f5d21c 55%,
              #c98e3a 78%,
              #462523 100%
      );
      -webkit-background-clip: text;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
      color: transparent;
      filter: blur(0.12mm);
      animation-duration: 2s;
      animation-name: fade-in;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 100%;
    }
  }
}
</style>