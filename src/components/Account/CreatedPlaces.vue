<template>
  {{ $t('account.created_places') }}

</template>

<script>
import useAlertStore from '@/stores/alert';
import { status } from '@/includes/enums';

export default {
  name: 'Account-Created-Places',
  async mounted() {
    console.log('place mounted');
  }
};
</script>

<style scoped>

</style>