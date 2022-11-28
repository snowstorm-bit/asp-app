<template>
  <!--  {{ a }}-->
  <asp-alert v-if="requestStatus.length > 0" :code="requestMessage" :status="requestStatus" />
  <form class="px-4 py-3" @submit.prevent="validateForm">
    <div class="mb-3 d-flex justify-content-center">
      <label class="form-label input-required-lbl" for="title">{{ $t('fields.username') }}</label>
      <input v-model="title" :class="hiddenClass.title" :placeholder="$t('fields.title')"
             class="form-control" name="title" required="required" type="text"
             @focusin="resetValidationOnField('title')" @focusout="validateTitleField">
      <invalid-feedback :error="errors.title" />
    </div>
    <div class="row">
      <div class="mb-3 col-md-6">
        <label class="form-label input-required-lbl" for="description">{{ $t('fields.description') }}</label>
        <input v-model="description" :class="hiddenClass.description" :placeholder="$t('fields.description')"
               class="form-control" name="description" required="required" type="text"
               @focusin="resetValidationOnField('description')" @focusout="validateDescriptionField">
        <invalid-feedback :error="errors.description" />
      </div>
      <div class="mb-3 col-md-6">
        <label class="form-label input-required-lbl" for="steps">{{ $t('fields.steps') }}</label>
        <input v-model="steps" :class="hiddenClass.steps" :placeholder="$t('fields.password')"
               class="form-control" name="steps" required="required" type="text"
               @focusin="resetValidationOnField('steps')" @focusout="validateStepsField">
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
</template>

<script>

import { getFormData, validateEmptyOrWhiteSpace, validateForm, validateRange } from '@/includes/validation';
import { status, validationHiddenClass } from '@/includes/enums';
import errors from '@/includes/errors.json';
import InvalidFeedback from '@/components/InvalidFeedback.vue';
import AspAlert from '@/components/Alert.vue';

export default {
  name: 'Place-Form',
  components: { InvalidFeedback, AspAlert },
  data() {
    return {
      isUpdate: ''
    };
  },
  computed: {
    getFormButtonSubmitCode() {
      return this.isUpdate ? 'buttons.create' : 'buttons.save_changes';
    }
  },
  methods: {
    redirectTo404(error = null) {
      // TODO use useAlertStore to create error message if necessary
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
        this.errors.latitude = errors.place.latitude.length;
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
        this.errors.longitude = errors.place.longitude.length;
      }

      this.setValidationOnField('longitude', indicateIsValid);
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
        this.formInValidation = !formIsValid;
        this.formInSubmission = !this.formInValidation;

        // Manage creation here
        try {
          let result = await this.create(
              {
                email: this.email,
                password: this.password
              });

          if (result.status === status.error) {
            event.stopPropagation();

            let globalErrorCode = this.isUpdate ? 'update_place' : 'create_place';
            if (globalErrorCode in result.codes) {
              this.requestStatus = result.status;
              this.requestMessage = result.codes[globalErrorCode];
            } else {
              for (const [key, value] of Object.entries(result.codes)) {
                this.errors[key] = value;
                this.hiddenClass[key] = validationHiddenClass.isInvalid;
              }
            }

            // Map response to the component validation data
            this.formInSubmission = !this.formInSubmission;
          } else if (result.status === status.success) {
            this.formInSubmission = !this.formInSubmission;
            this.$router.go();
          }
        } catch {
          event.stopPropagation();
          this.formInSubmission = !this.formInSubmission;
        }
      } else {
        event.stopPropagation();
        this.formInValidation = formIsValid;
      }
    },
    async create(){
      let response;
      try {
        response = await fetch('http://localhost:8080/user/registr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        return {
          codes: { 'create_place': errors.routes.create.place },
          status: status.error
        };
      }

      let data = await response.json();

      if (data.status === status.error) {
        return data;
      }
    },
    async update(){
      
    },
    async getData(){
      
    },
    async validateAuthForResponse(){
      
    },
    
  },
  created() {
    console.log('this.$route.params', this.$route.params);

    if (Object.entries(this.$route.params).length > 0) {
      this.isUpdate = this.$route.params.title;
    }
    // TODO : Validate request is ok
    console.log(getFormData(['title', 'description', 'steps', 'latitude', 'longitude']));
    // TODO : Initialize form data
    // this.a = 'a';
  }
};
</script>

<style scoped>

</style>