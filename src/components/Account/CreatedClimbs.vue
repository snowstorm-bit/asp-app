<template>
  <div v-if="dataLoaded">
    <asp-alert v-if="requestStatus.length > 0" :code="requestMessage" :status="requestStatus"
               @[alertClosed]="requestStatus = ''; requestMessage = '';" />

    <h2>{{ $t('account.created_climbs') }}</h2>
    <div class="mt-4">
      <div v-if="items.length > 0">
        <router-link v-for="climb in items" :key="climb.title"
                     :to="{name: 'ClimbDetails', params: {climbTitle: climb.title}}" class="asp-link m-1">
          {{ climb.title }}
        </router-link>
        <div v-if="hasMoreResult" class="d-flex justify-content-center mt-3">
          <button class="btn btn-lg fs-6 btn-submit" type="submit" @click.prevent.stop="getMore">
            {{ $t('buttons.load_more') }}
          </button>
        </div>
      </div>
      <div v-else>{{ $t('empty_result.climb.created') }}</div>
    </div>
  </div>
</template>

<script>
import { ALERT_CLOSED } from '@/includes/events';
import { getHeaderAuthorization, validateNeedsAuth } from '@/includes/validation';
import errors from '@/includes/errors.json';
import { status } from '@/includes/enums';
import useAlertStore from '@/stores/alert';

export default {
  name: 'Account-Created-Climbs',
  data() {
    return {
      dataLoaded: false,
      requestStatus: '',
      requestMessage: '',
      alertClosed: ALERT_CLOSED,
      items: [],
      climbTitle: '',
      hasMoreResult: true,
      offset: 0
    };
  },
  methods: {
    mapInvalidResponse(result) {
      let errorCode = 'authentication' in result.codes
          ? 'authentication'
          : 'created_climbs' in result.codes
              ? 'created_climbs' : '';

      if (errorCode.length > 0) {
        this.requestStatus = result.status;
        this.requestMessage = result.codes[errorCode];
      } else if ('refresh' in result.codes) { // authentication error
        this.$router.go();
      }
    },
    async getData(withOffset = true) {
      let response;
      try {
        let url = '/api/user/account/climbs';

        if (withOffset) {
          url += '?' + new URLSearchParams([['offset', this.offset]]);
        }

        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          }
        });
      } catch {
        return {
          codes: { 'created_climbs': errors.routes.get.details.account.created_climbs },
          status: status.error
        };
      }

      if (response.status === 500) {
        return {
          codes: { 'created_climbs': errors.routes.get.details.account.created_climbs },
          status: status.error
        };
      }

      let data = await response.json();

      if (!await validateNeedsAuth(response.status, data.codes?.authentication)) {
        return {
          codes: { refresh: true },
          status: status.error
        };
      }

      return data;
    },
    async getMore() {
      let data = await this.getData(false);
      if (data.status === status.error) {
        this.mapInvalidResponse(data);
        return;
      }

      data.result.items.forEach(item => {
        if (this.items.find(i => i.title === item.title) === undefined) {
          this.items.push(item);
        }
      });

      this.offset = data.result.offset;
      this.hasMoreResult = data.result.hasMoreResult;
    }
  },
  async mounted() {
    if (!useAlertStore().hasAuthInvalidMessage) {
      let data = await this.getData(false);
      if (data.status === status.error) {
        this.mapInvalidResponse(data, false);
        return;
      }

      for (const [key, value] of Object.entries(data.result)) {
        this[key] = value;
      }

      this.dataLoaded = true;
    }
  }
};
</script>

<style scoped>

</style>