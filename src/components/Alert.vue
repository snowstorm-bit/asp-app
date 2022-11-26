<template>
  <div :class="alertClass" class="alert div-alert" role="alert">
    {{ $t(message) }}
  </div>
</template>

<script>
export default {
  name: 'Asp-Alert',
  props: ['status', 'message'],
  data() {
    return {
      alertClass: status.success
          ? 'alert-success'
          : 'alert-danger'
    };
  }
};
</script>

<style scoped>
/*Alerte*/
.div-alert {
  padding: 0.3rem 0.5rem !important;
  justify-content: space-between;
  align-items: center;
  display: flex;
}

.close-btn {
  padding: 0 0.4rem !important;
}

</style>