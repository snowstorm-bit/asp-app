<template>
  <div v-if="placeTitleValid">
    <h2 class="text-center">{{ getFormTitle }}</h2>
    <asp-alert v-if="requestStatus.length > 0" :code="requestMessage" :status="requestStatus" />
    <form class="px-4 py-3" @submit.prevent="validateForm">
      <div class="mb-3 d-flex justify-content-center">
        <div>
          <label class="form-label input-required-lbl" for="title">{{ $t('fields.title') }}</label>
          <input v-model="title" :class="hiddenClass.title" :placeholder="$t('fields.title')"
                 class="form-control" name="title" required="required" type="text"
                 @focusin="resetValidationOnField('title')" @focusout="validateTitleField">
          <invalid-feedback :error="errors.title" />
        </div>
      </div>
      <div class="row">
        <div class="mb-3 col-md-6">
          <div class="form-floating">
          <textarea v-model="description" :class="hiddenClass.description"
                    :placeholder="$t('fields.description')" class="form-control" name="description"
                    required="required" @focusin="resetValidationOnField('description')"
                    @focusout="validateDescriptionField"></textarea>
            <label for="description">{{ $t('fields.description') }}</label>
          </div>
          <invalid-feedback :error="errors.description" />
        </div>
        <div class="mb-3 col-md-6">
          <div class="form-floating">
          <textarea v-model="steps" :class="hiddenClass.steps"
                    :placeholder="$t('fields.steps')" class="form-control" name="steps"
                    required="required" @focusin="resetValidationOnField('steps')"
                    @focusout="validateStepsField"></textarea>
            <label for="steps">{{ $t('fields.steps') }}</label>
          </div>
          <invalid-feedback :error="errors.steps" />
        </div>
      </div>
      <div class="row">
        <div class="mb-3 col-sm-6">
          <label class="form-label input-required-lbl" for="latitude">
            {{ $t('fields.latitude') }}
          </label>
          <input v-model="latitude" :class="hiddenClass.latitude" :placeholder="$t('fields.latitude')"
                 class="form-control" name="latitude" required="required" type="number"
                 @focusin="resetValidationOnField('latitude')" @focusout="validateLatitudeField">
          <invalid-feedback :error="errors.latitude" />
        </div>
        <div class="mb-3 col-sm-6">
          <label class="form-label input-required-lbl" for="longitude">
            {{ $t('fields.longitude') }}
          </label>
          <input v-model="longitude" :class="hiddenClass.longitude" :placeholder="$t('fields.longitude')"
                 class="form-control" name="longitude" required="required" type="number"
                 @focusin="resetValidationOnField('longitude')" @focusout="validateLongitudeField">
          <invalid-feedback :error="errors.longitude" />
        </div>
      </div>
      <div class="d-flex justify-content-end">
        <button :disabled="formInValidation||formInSubmission" class="btn btn-lg fs-6 btn-submit" type="submit">
          <i v-show="formInValidation||formInSubmission" class="bi bi-hourglass-split"></i>
          {{ $t(getFormButtonSubmitCode) }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import {
  getFormData,
  getHeaderAuthorization,
  validateAuthFromResponse,
  validateEmptyOrWhiteSpace,
  validateForm,
  validateRange
} from '@/includes/validation';
import { status, validationHiddenClass } from '@/includes/enums';
import errors from '@/includes/errors.json';
import InvalidFeedback from '@/components/InvalidFeedback.vue';
import AspAlert from '@/components/Alert.vue';
import { mapState } from 'pinia';
import useUserStore from '@/stores/user';
import useAlertStore from '@/stores/alert';

export default {
  name: 'Place-Form',
  components: { InvalidFeedback, AspAlert },
  props: ['placeTitle'],
  data() {
    let data = getFormData(['title', 'description', 'steps', 'latitude', 'longitude']);
    data.isUpdate = this.placeTitle !== undefined;
    data.placeTitleValid = false;
    return data;
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    getFormButtonSubmitCode() {
      return this.isUpdate ? 'buttons.save_changes' : 'buttons.create';
    },
    getFormTitle() {
      let title = this.$t(this.isUpdate ? 'update.place' : 'create.place');
      return this.isUpdate ? `${ title } - ${ this.placeTitle }` : title;
    }
  },
  methods: {
    redirectTo404(error = null) {
      if (error !== null) {
        useAlertStore().setMessage('globalMessage', {
          code: error,
          status: status.error
        });
      }
      this.$router.push({ name: 'NotFound' });
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
    validateTitleField() {
      let indicateIsValid = typeof this.errors.title !== 'string';
      this.errors.title = '';
      let value = this.title;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.title = errors.place.title.empty_or_white_spaces;
      } else if (!validateRange(value, 3, 50)) {
        this.errors.title = errors.place.title.length;
      }

      this.setValidationOnField('title', indicateIsValid);
    },
    validateDescriptionField() {
      let indicateIsValid = typeof this.errors.description !== 'string';
      this.errors.description = '';
      let value = this.description;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.description = errors.place.description.empty_or_white_spaces;
      } else if (!validateRange(value, 3, 500)) {
        this.errors.description = errors.place.description.length;
      }

      this.setValidationOnField('description', indicateIsValid);
    },
    validateStepsField() {
      let indicateIsValid = typeof this.errors.steps !== 'string';
      this.errors.steps = '';
      let value = this.steps;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.steps = errors.place.steps.empty_or_white_spaces;
      } else if (!validateRange(value, 3, 500)) {
        this.errors.steps = errors.place.steps.length;
      }

      this.setValidationOnField('steps', indicateIsValid);
    },
    validateLatitudeField() {
      let indicateIsValid = typeof this.errors.latitude !== 'string';
      this.errors.latitude = '';
      let value = this.latitude;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.latitude = errors.place.latitude.empty_or_white_spaces;
      } else if (!validateRange(value, -90, 90, false)) {
        this.errors.latitude = errors.place.latitude.range;
      }

      this.setValidationOnField('latitude', indicateIsValid);
    },
    validateLongitudeField() {
      let indicateIsValid = typeof this.errors.longitude !== 'string';
      this.errors.longitude = '';
      let value = this.longitude;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.longitude = errors.place.longitude.empty_or_white_spaces;
      } else if (!validateRange(value, -180, 180, false)) {
        this.errors.longitude = errors.place.longitude.range;
      }

      this.setValidationOnField('longitude', indicateIsValid);
    },
    mapInvalidResponse(result, mapForInvalidFields = true) {
      let globalErrorCode = this.isUpdate ? 'update_place' : 'create_place';
      if (globalErrorCode in result.codes) {
        this.requestStatus = result.status;
        this.requestMessage = result.codes[globalErrorCode];
        this.formInSubmission = false;
      } else if ('refresh' in result.codes) { // authentification error
        this.$router.go();
      } else if ('not_found' in result.codes) {
        this.redirectTo404(result.codes.not_found);
      } else if (mapForInvalidFields) {
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

      this.validateTitleField();
      this.validateDescriptionField();
      this.validateStepsField();
      this.validateLatitudeField();
      this.validateLongitudeField();

      let formIsValid = validateForm(this.errors);

      if (formIsValid) {
        this.formInValidation = false;
        this.formInSubmission = true;

        try {
          let result = this.isUpdate ? await this.update() : await this.create();

          if (result.status === status.error) {
            event.stopPropagation();
            this.mapInvalidResponse(result);
          } else if (result.status === status.success) {
            // submission of form valid at this point
            this.formInSubmission = false;
            this.$router.push({ name: 'PlaceDetails', params: { placeTitle: this.title } });
          }
        } catch {
          event.stopPropagation();
          this.mapInvalidResponse({ codes: this.isUpdate ? 'update_place' : 'create_place' });
        }
      } else {
        event.stopPropagation();
        this.formInValidation = false;
      }
    },
    async create() {
      let payload = {
        'title': this.title,
        'description': this.description,
        'steps': this.steps,
        'latitude': this.latitude,
        'longitude': this.longitude
      };

      let response;
      try {
        response = await fetch('/api/place', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          },
          body: JSON.stringify(payload)
        });
      } catch {
        return {
          codes: { 'create_place': errors.routes.create.place },
          status: status.error
        };
      }

      if (response.status === 500) {
        return {
          codes: { 'create_place': errors.routes.create.place },
          status: status.error
        };
      }

      if (!await validateAuthFromResponse(response.status, this.userLoggedIn)) {
        return {
          codes: { refresh: true },
          status: status.error
        };
      }

      let data = await response.json();

      if (data.status === status.error) {
        return data;
      }

      useAlertStore().setMessage('globalMessage', {
        code: data.code,
        status: data.status
      });

      return { status: status.success };
    },
    async update() {
      let payload = {
        'title': this.title,
        'description': this.description,
        'steps': this.steps,
        'latitude': this.latitude,
        'longitude': this.longitude
      };

      let response;
      try {
        response = await fetch(`/api/place/${ this.placeTitle }`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          },
          body: JSON.stringify(payload)
        });
      } catch {
        return {
          codes: { 'update_place': errors.routes.update.place },
          status: status.error
        };
      }

      if (response.status === 500) {
        return {
          codes: { 'update_place': errors.routes.update.place },
          status: status.error
        };
      }

      if (!await validateAuthFromResponse(response.status, this.userLoggedIn)) {
        return {
          codes: { refresh: true },
          status: status.error
        };
      }

      let data = await response.json();

      if (data.status === status.error) {
        return data;
      }

      useAlertStore().setMessage('globalMessage', {
        code: data.code,
        status: data.status
      });

      return { status: status.success };
    },
    async getData() {
      let response;
      try {
        response = await fetch(`/api/place/${ this.placeTitle }`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          }
        });
      } catch {
        return {
          codes: { 'update_place': errors.routes.get.update.place },
          status: status.error
        };
      }

      if (response.status === 500) {
        return {
          codes: { 'update_place': errors.routes.get.update.place },
          status: status.error
        };
      }

      if (!await validateAuthFromResponse(response.status, this.userLoggedIn)) {
        return {
          codes: { refresh: true },
          status: status.error
        };
      }

      let data = await response.json();

      if (response.status === 404) {
        return {
          codes: { not_found: errors.place.not_found },
          status: status.error
        };
      }

      return data;
    }
  },
  async mounted() {
    if (!useAlertStore().hasAuthInvalidMessage) {
      if (this.isUpdate) {
        let updateData = await this.getData();
        if (updateData.status === status.error) {
          this.mapInvalidResponse(updateData, false);
          return;
        }

        for (const [key, value] of Object.entries(updateData.result)) {
          this[key] = value;
        }
      }
      this.placeTitleValid = true;
    }
  }
};
</script>

<style scoped>
h2 {
  margin-top: 4rem;
}

form {
  margin: 0 5rem 5rem;
}

textarea {
  height: 10rem !important;
  max-height: 20rem;
}
</style>