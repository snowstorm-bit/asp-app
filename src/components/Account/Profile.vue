<template>
  <div v-if="dataLoaded">
    <asp-alert v-if="requestStatus.length > 0" :code="requestMessage" :status="requestStatus"
               @[alertClosed]="requestStatus = ''; requestMessage = '';" />
    <form novalidate @submit.prevent="validateForm">
      <h2>{{ $t('account.profile') }}</h2>
      <div class="mb-3 mt-4">
        <label class="form-label input-required-lbl" for="username">{{ $t('fields.username') }}</label>
        <input v-model="username" :class="hiddenClass.username" :placeholder="$t('fields.username')"
               class="form-control"
               name="username" type="text" @focusin="resetValidationOnField('username')"
               @focusout="validateUsernameField">
        <invalid-feedback :error="errors.username" />
      </div>
      <div class="d-flex justify-content-end mt-4">
        <button :disabled="formInValidation||formInSubmission" class="btn btn-lg fs-6 btn-submit" type="submit">
          <i v-show="formInValidation||formInSubmission" class="bi bi-hourglass-split"></i>
          {{ $t('buttons.save_changes') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import {
  getFormData,
  getHeaderAuthorization,
  validateEmptyOrWhiteSpace,
  validateForm,
  validateNeedsAuth,
  validateRange
} from '@/includes/validation';
import InvalidFeedback from '@/components/InvalidFeedback.vue';
import AspAlert from '@/components/Alert.vue';
import { status, validationHiddenClass } from '@/includes/enums';
import errors from '@/includes/errors.json';
import { ALERT_CLOSED } from '@/includes/events';
import useAlertStore from '@/stores/alert';

export default {
  name: 'Account-Profile',
  components: { InvalidFeedback, AspAlert },
  data() {
    let data = getFormData(['username']);
    data.dataLoaded = false;
    data.alertClosed = ALERT_CLOSED;
    return data;
  },
  methods: {
    resetForm() {
      let defaultData = getFormData(['username']);

      for (const [key, value] of Object.entries(defaultData)) {
        this[key] = value;
      }
    },
    resetValidationOnField(field) {
      if (this.hiddenClass[field].length > 0)
        this.errors[field] = { wasValidated: '' };
      this.hiddenClass[field] = '';
    },
    setValidationOnField(field, indicateIsValid, trim = true) {
      if (this.errors[field].length > 0) {
        this.hiddenClass[field] = validationHiddenClass.isInvalid;
      } else if (indicateIsValid) {
        this.hiddenClass[field] = validationHiddenClass.isValid;

        if (trim) {
          this[field].trim();
        }
      }
    },
    validateUsernameField() {
      let indicateIsValid = typeof this.errors.username !== 'string';
      this.errors.username = '';
      let value = this.username;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.username = errors.user.username.empty_or_white_spaces;
      } else if (!validateRange(value, 3, 50)) {
        this.errors.username = errors.user.username.length;
      }

      this.setValidationOnField('username', indicateIsValid);
    },
    mapInvalidResponse(result, mapInvalidFields = true) {
      let errorCode = 'authentication' in result.codes
          ? 'authentication'
          : 'profile' in result.codes
              ? 'profile' : '';

      if (errorCode.length > 0) {
        this.requestStatus = result.status;
        this.requestMessage = result.codes[errorCode];
        this.formInSubmission = false;
      } else if ('refresh' in result.codes) { // authentication error
        this.$router.go();
      } else if (mapInvalidFields) {
        // Map errors returned by the request
        for (const [key, value] of Object.entries(result.codes)) {
          this.errors[key] = value;
          this.hiddenClass[key] = validationHiddenClass.isInvalid;
        }
        this.formInSubmission = false;
      }
    },
    async validateForm(event) {
      // Désactiver le bouton afin d'éviter que l'utilisateur 
      // appuie pleins de fois de suite sur le bouton de soumission
      this.formInValidation = true;
      this.validateUsernameField();

      let formIsValid = validateForm(this.errors);

      if (formIsValid) {
        this.formInValidation = !formIsValid;
        this.formInSubmission = !this.formInValidation;

        // Manage userStore here
        try {
          let result = await this.updateProfile();

          if (result.status === status.error) {
            event.stopPropagation();
            this.mapInvalidResponse(result);
          } else {
            this.formInSubmission = !this.formInSubmission;
            this.$router.go();
          }
        } catch {
          event.stopPropagation();
          this.formInSubmission = !this.formInSubmission;
        }
      } else {
        event.stopPropagation();
        this.formInValidation = false;
      }
    },
    async updateProfile() {
      let response;
      try {
        response = await fetch('/api/user/account/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          },
          body: JSON.stringify({ username: this.username })
        });
      } catch {
        return {
          codes: { 'profile': errors.routes.update.account_profile },
          status: status.error
        };
      }

      if (response.status === 500) {
        return data;
      }

      let data = await response.json();

      if (!await validateNeedsAuth(response.status, data.codes?.authentication)) {
        return {
          codes: { refresh: true },
          status: status.error
        };
      }

      if (data.status === status.error) {
        return data;
      }

      useAlertStore().setMessage('globalMessage', {
        code: data.code,
        status: data.status
      });

      // replacing username
      let user = JSON.parse(localStorage.getItem('user'));
      user.username = this.username;
      localStorage.setItem('user', JSON.stringify(user));

      return { status: status.success };
    },
    async getData() {
      let response;
      try {
        response = await fetch('/api/user/account/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          }
        });
      } catch {
        return {
          codes: { 'profile': errors.routes.get.details.account.profile },
          status: status.error
        };
      }

      if (response.status === 500) {
        return {
          codes: { 'profile': errors.routes.get.details.account.profile },
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
    }
  },
  async mounted() {
    if (!useAlertStore().hasAuthInvalidMessage) {
      let data = await this.getData();
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
