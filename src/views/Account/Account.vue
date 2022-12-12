<template>
  <div v-if="true">
    <div class="row">
      <!-- Account menu -->
      <div class="col-sm-4">
        <ul class="nav nav-pills flex-column">
          <li v-for="tab in tabs" v-if="Array.isArray(tabs)" :key="tab" class="nav-item">
            <a :class="{' active': currentTab === tab }" class="nav-link" @click="currentTab = tab">
              {{ getTabDisplayName(tab) }}
            </a>
          </li>
          <li v-else class="nav-item">
            <a class="nav-link active">
              {{ $t('account.profile') }}
            </a>
          </li>
        </ul>
      </div>
      <!-- Content of selected tab -->
      <div class="col-sm-8">
        <KeepAlive>
          <component :is="currentTab"></component>
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<script>
import AccountProfile from '@/components/Account/Profile.vue';
import AccountCreatedPlaces from '@/components/Account/CreatedPlaces.vue';
import AccountCreatedClimbs from '@/components/Account/CreatedClimbs.vue';
import AccountRatedClimbs from '@/components/Account/RatedClimbs.vue';
import { status } from '@/includes/enums';
import { mapActions, mapWritableState } from 'pinia';
import useUserStore from '@/stores/user';

let profileTab = 'Account-Profile';
let createdPlaceTab = 'Account-Created-Places';
let createdClimbsTab = 'Account-Created-Climbs';
let ratedClimbsTab = 'Account-Rated-Climbs';

export default {
  name: 'Asp-Account',
  components: {
    AccountProfile,
    AccountCreatedPlaces,
    AccountCreatedClimbs,
    AccountRatedClimbs
  },
  data() {
    return {
      currentTab: profileTab,
      tabs: this.isAdmin
          ? profileTab
          : [profileTab,
            createdPlaceTab,
            createdClimbsTab,
            ratedClimbsTab]
      ,
      dataLoaded: false
    };
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn', 'isAdmin']),
    getTabDisplayName() {
      return value => {
        switch (value) {
          case profileTab:
            return this.$t('account.profile');
          case createdPlaceTab:
            return this.$t('account.created_places');
          case createdClimbsTab:
            return this.$t('account.created_climbs');
          case ratedClimbsTab:
            return this.$t('account.rated_climbs');
        }
      };
    }
  },
  methods: {
    ...mapActions(useUserStore, { validateIsAdmin: 'validateUserIsAdmin' })
  },
  async mounted() {
    this.isAdmin = this.validateIsAdmin();

    // True to display data once it has been loaded
    this.dataLoaded = true;
  }
};
</script>

<style scoped>

</style>