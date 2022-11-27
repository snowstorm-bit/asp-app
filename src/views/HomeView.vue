<template>
  <button @click="event">404</button>
</template>

<script>
// import useUserStore from "@/stores/user";

export default {
  name: 'Home-View',
  methods: {
    event() {
      this.$router.push({name: 'notFound'})
      console.log('home');
    }
  }
};
</script>