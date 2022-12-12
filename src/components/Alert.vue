<template>
  <div :class="getHiddenClass" class="alert fade show opacity-75" role="alert">
    <template v-if="getHiddenClass === 'div-global-alert'">
      <span class="text-center">{{ $t(code) }}</span>
    </template>
    <template v-else>
      <span class="text-center">{{ $t(code) }}</span>
    </template>

    <button aria-label="Close" class="btn-close btn-sm btn" data-bs-dismiss="alert" type="button"
            @click="close"></button>
  </div>
</template>

<script>

import { mapState } from 'pinia';
import useAlertStore from '@/stores/alert';
import { colorClass } from '@/includes/enums';
import { ALERT_CLOSED } from '@/includes/events';

export default {
  name: 'Asp-Alert',
  props: {
    status: String,
    code: String
  },
  emits: [ALERT_CLOSED],
  computed: {
    ...mapState(useAlertStore, ['hasGlobalMessage', 'hasAuthInvalidMessage']),
    getHiddenClass() {
      let alertColorClass = `alert-${ colorClass[this.status] }`;

      if (this.hasAuthInvalidMessage
          || this.code.includes('errors.auth')
          || this.code.includes('errors.routes.register')
          || this.code.includes('errors.routes.login')) {
        return `${ alertColorClass } div-alert`;
      }
      if (this.hasGlobalMessage) {
        return `${ alertColorClass } div-global-alert`;
      }

      return `${ alertColorClass } div-alert`;
    }
  },
  methods: {
    close() {
      this.$emit(ALERT_CLOSED);
    }
  }
};
</script>

<style lang="scss" scoped>
/*Alerte*/

.div-alert {
  padding: 0.5rem 0.3rem 0.5rem 0.4rem !important;
  justify-content: space-between;
  align-items: center;
  display: flex;
}

.div-global-alert {
  @extend .div-alert;

  position: fixed;
  margin: 1rem auto;
  top: 3.5rem;
  left: 12.5%;
  width: 75%;
  z-index: 99999998;
  padding: 0.4rem 0.5rem !important;
}

</style>