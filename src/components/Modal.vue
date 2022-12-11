<template>
  <div :id="modalId" aria-hidden="true" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false"
       style="z-index: 99999999999;" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="modal-title">Modal title</slot>
        </div>
        <div class="modal-body m-4">
          <slot name="modal-body">Modal body text</slot>
        </div>
        <div class="modal-footer">
          <slot name="modal-footer">
            <slot name="modal-footer-dismiss">
              <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">
                {{ $t('buttons.cancel') }}
              </button>
            </slot>
            <slot name="modal-footer-confirm">
              <button class="btn btn-submit text-nowrap" data-bs-dismiss="modal" type="button" @click="confirm">
                {{ $t('buttons.confirm') }}
              </button>
            </slot>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MODAL_CONFIRMED } from '@/includes/events';

export default {
  name: 'Asp-Modal',
  props: ['modalId'],
  emits: [MODAL_CONFIRMED],
  methods: {
    confirm() {
      this.$emit(MODAL_CONFIRMED);
    }
  }
};
</script>

<style scoped>

</style>