<template>
  <div v-if="climbTitleValid">
    <h2 class="text-center">{{ getFormTitle }}</h2>
    <asp-alert v-if="requestStatus.length > 0" :code="requestMessage" :status="requestStatus" />
    <form class="px-4 py-3" @submit.prevent="validateForm">
      <div class="mb-3 row">
        <div class="col-md-6">
          <label class="form-label input-required-lbl" for="title">{{ $t('fields.title') }}</label>
          <input v-model="title" :class="hiddenClass.title" :placeholder="$t('fields.title')"
                 class="form-control" name="title" required="required" type="text"
                 @focusin="resetValidationOnField('title')" @focusout="validateTitleField">
          <invalid-feedback :error="errors.title" />
        </div>
        <div class="col-md-6">
          <label class="form-label input-required-lbl" for="placeTitle">{{ $t('fields.place_title') }}</label>
          <select v-model="placeTitle" :class="hiddenClass.placeTitle" class="form-select" required="required"
                  @focusin="resetValidationOnField('placeTitle')" @focusout="validatePlaceTitleField">
            <option :selected="placeTitle.length > 0" value="">{{ $t('fields.place_title') }}</option>
            <option v-for="onePlaceTitle in placeTitles" :key="onePlaceTitle.title"
                    :selected="placeTitle === onePlaceTitle.title" :value="onePlaceTitle.title">
              {{ onePlaceTitle.title }}
            </option>
          </select>
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
          <label class="form-label input-required-lbl" for="difficultyLevel">{{ $t('fields.difficulty_level') }}</label>
          <input v-model="difficultyLevel" :class="hiddenClass.difficultyLevel"
                 :placeholder="$t('fields.difficulty_level')"
                 class="form-control" name="difficultyLevel" required="required" type="text"
                 @focusin="resetValidationOnField('difficultyLevel')" @focusout="validateDifficultyLevelField">
          <invalid-feedback :error="errors.difficultyLevel" />
        </div>
      </div>
      <div class="row">
        <div class="mb-3 col-sm-6">
          <label class="form-label input-required-lbl" for="title">{{ $t('fields.style') }}</label>
          <select v-model="style" :class="hiddenClass.style" class="form-select" required="required"
                  @focusin="resetValidationOnField('style')" @focusout="validateStyleField">
            <option :selected="style.length > 0" value="">{{ $t('fields.style') }}</option>
            <option v-for="oneStyle in styles" :key="oneStyle" :selected="style === oneStyle" :value="oneStyle">
              {{ $t(`climb_style.${ oneStyle }`) }}
            </option>
          </select>
          <invalid-feedback :error="errors.style" />
        </div>
        <div class="mb-3 col-sm-6">
          <!--          <label class="form-label input-required-lbl" for="longitude">-->
          <!--            {{ $t('fields.longitude') }}-->
          <!--          </label>-->
          <!--          <input v-model="longitude" :class="hiddenClass.longitude" :placeholder="$t('fields.longitude')"-->
          <!--                 class="form-control" name="longitude" required="required" type="number"-->
          <!--                 @focusin="resetValidationOnField('longitude')" @focusout="validateLongitudeField">-->
          <!--          <invalid-feedback :error="errors.longitude" />-->
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
  name: 'Climb-Form',
  components: { InvalidFeedback, AspAlert },
  props: ['climbTitle'],
  data() {
    let data = getFormData(['title', 'description', 'difficultyLevel', 'style', 'placeTitle']);
    data.isUpdate = this.climbTitle !== undefined;
    data.climbTitleValid = false;
    data.difficultyLevel = 5.9;
    data.decrementHiddenAttibute = '';
    data.incrementHiddenAttibute = '';
    data.style;
    return data;
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    getFormButtonSubmitCode() {
      return this.isUpdate ? 'buttons.save_changes' : 'buttons.create';
    },
    getFormTitle() {
      let title = this.$t(this.isUpdate ? 'update.climb' : 'create.climb');
      return this.isUpdate ? `${ title } - ${ this.climbTitle }` : title;
    }
  },
  methods: {
    redirectTo404(error = null) {
      // useAlertStore to create error message if necessary
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
      let value = `${ this.title }`;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.title = errors.climb.title.empty_or_white_spaces;
      } else if (!validateRange(value, 3, 50)) {
        this.errors.title = errors.climb.title.length;
      }

      this.setValidationOnField('title', indicateIsValid);
    },
    validatePlaceTitleField() {
      let indicateIsValid = typeof this.errors.placeTitle !== 'string';
      this.errors.placeTitle = '';
      let value = `${ this.placeTitle }`;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.placeTitle = errors.climb.place_title.empty_or_white_spaces;
      } else if (!validateRange(value, 3, 50)) {
        this.errors.placeTitle = errors.climb.place_title.length;
      }

      this.setValidationOnField('placeTitle', indicateIsValid);
    },
    validateDescriptionField() {
      let indicateIsValid = typeof this.errors.description !== 'string';
      this.errors.description = '';
      let value = this.description;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.description = errors.climb.description.empty_or_white_spaces;
      } else if (!validateRange(value, 3, 500)) {
        this.errors.description = errors.climb.description.length;
      }

      this.setValidationOnField('description', indicateIsValid);
    },
    validateDifficultyLevelField() {
      let indicateIsValid = typeof this.errors.difficultyLevel !== 'number';
      this.errors.difficultyLevel = '';
      let value = this.difficultyLevel;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.difficultyLevel = errors.climb.difficulty_level.empty_or_white_spaces;
      }

      let [integer, decimal] = value.split('.');
      integer = Number(integer);
      decimal = Number(decimal);
      let expression = integer < 5 || integer > 5 || decimal < 6 || decimal > 15;

      if (expression) {
        this.difficultyLevel = 5.9;
        this.errors.difficultyLevel = errors.climb.difficulty_level.range;
      }

      this.setValidationOnField('difficultyLevel', indicateIsValid);
    },
    validateStyleField() {
      let indicateIsValid = typeof this.errors.style !== 'string';
      this.errors.style = '';
      let value = this.style;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.style = errors.climb.style.empty_or_white_spaces;
      }

      this.setValidationOnField('style', indicateIsValid);
    },
    async validateForm(event) {
      // Désactiver le bouton afin d'éviter que l'utilisateur 
      // appuie pleins de fois de suite sur le bouton de soumission
      this.formInValidation = true;

      this.validateTitleField();
      this.validatePlaceTitleField();
      this.validateDescriptionField();
      this.validateDifficultyLevelField();
      this.validateStyleField();

      let formIsValid = validateForm(this.errors);

      if (formIsValid) {
        this.formInValidation = !formIsValid;
        this.formInSubmission = !this.formInValidation;

        // Manage creation here
        try {
          let result = this.isUpdate ? await this.update() : await this.create();

          if (result.status === status.error) {
            event.stopPropagation();

            this.mapInvalidResponse(result);

            // Map response to the component validation data
            this.formInSubmission = !this.formInSubmission;
          } else if (result.status === status.success) {
            this.formInSubmission = !this.formInSubmission;

            // TODO : Replace redirection to go to places view
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
    mapInvalidResponse(result, mapInvalidFields = true) {
      let globalErrorCode = this.isUpdate ? 'update_climb' : 'create_climb';
      if (globalErrorCode in result.codes) {
        this.requestStatus = result.status;
        this.requestMessage = result.codes[globalErrorCode];
      } else if ('refresh' in result.codes) {
        this.$router.go();
      } else if ('not_found' in result.codes) {
        this.redirectTo404(result.codes.not_found);
      } else if (mapInvalidFields) {
        // Map errors returned by the request
        for (const [key, value] of Object.entries(result.codes)) {
          this.errors[key] = value;
          this.hiddenClass[key] = validationHiddenClass.isInvalid;
        }
      }
    },
    async create() {
      let payload = {
        'title': this.title,
        'description': this.description,
        'style': this.style,
        'difficultyLevel': Number(this.difficultyLevel),
        'placeTitle': this.placeTitle
      };

      let response;
      try {
        response = await fetch('http://localhost:8080/climb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          },
          body: JSON.stringify(payload)
        });
      } catch {
        return {
          codes: { 'create_climb': errors.routes.create.climb },
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
        'style': this.style,
        'difficultyLevel': Number(this.difficultyLevel),
        'placeTitle': this.placeTitle
      };

      let response;
      try {
        response = await fetch(`http://localhost:8080/climb/${ this.climbTitle }`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          },
          body: JSON.stringify(payload)
        });
      } catch {
        return {
          codes: { 'update_climb': errors.routes.update.climb },
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
    async getCreateData() {
      let response;
      try {
        response = await fetch(`http://localhost:8080/climb`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          }
        });
      } catch {
        return {
          codes: { 'create_climb': errors.routes.get.create.climb },
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
          codes: { not_found: errors.climb.not_found },
          status: status.error
        };
      }

      return data;
    },
    async getUpdateData() {
      let response;
      try {
        response = await fetch(`http://localhost:8080/climb/${ this.climbTitle }`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          }
        });
      } catch {
        return {
          codes: { 'update_climb': errors.routes.get.update.climb },
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
          codes: { not_found: errors.climb.not_found },
          status: status.error
        };
      }

      return data;
    }
  },
  async mounted() {
    if (!useAlertStore().hasAuthInvalidMessage) {
      let data = this.isUpdate ? await this.getUpdateData() : await this.getCreateData();
      if (data.status === status.error) {
        this.mapInvalidResponse(data, false);
        return;
      }

      let resultObjectEntries = Object.entries(data.result);
      for (const [key, value] of resultObjectEntries) {
        this[key] = value;
      }

      this.climbTitleValid = true;
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