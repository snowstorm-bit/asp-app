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
          <invalid-feedback :error="errors.placeTitle" />
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
        <div class="mb-3 row col-md-6">
          <div class="mb-3">
            <div>
              <label class="form-label input-required-lbl" for="difficultyLevel">
                {{ $t('fields.difficulty_level') }}
              </label>
            </div>
            <div aria-label="Basic example" class="btn-group d-flex justify-content-evenly" role="group">
              <button :class="decrementHiddenClass" class="btn btn-primary" type="button" @click="decrement">-</button>
              <div class="btn">{{ difficultyLevel }}</div>
              <button :class="incrementHiddenClass" class="btn btn-primary" type="button" @click="increment">+</button>
            </div>
            <invalid-feedback :error="errors.difficultyLevel" />
          </div>
          <div>
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
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('fields.images') }}</label>
          <input ref="fileInput" :class="hiddenClass.images" class="form-control" multiple
                 type="file" @change="onChangeInputFile" @focusin="resetValidationOnField('images')">
          <invalid-feedback :error="errors.images" />
        </div>
      </div>
      <div class="row">
        <div class="row col-sm-10">
          <div>
            <!-- TODO DELETE IMAGES IF TIME -->
            <div v-if="images.length > 0">
              <hr />
              <div class="fw-bold">Images enregistrées</div>
              <img v-for="filename in images" :src="`/api/${filename}`" alt="filename" class="col-md-3 pb-2" />
            </div>
            <hr />
            <div class="row">
              <div class="fw-bold mb-2">Images sélectionnées</div>
              <img v-for="image in selectedImages" :alt="image.objectURL" :src="image.objectURL"
                   class="col-md-3 pb-2" />
            </div>
          </div>
        </div>
        <div class="col-sm-2 ">
          <div class="d-flex justify-content-end">
            <button :disabled="formInValidation||formInSubmission" class="btn btn-lg fs-6 btn-submit" type="submit">
              <i v-show="formInValidation||formInSubmission" class="bi bi-hourglass-split"></i>
              {{ $t(getFormButtonSubmitCode) }}
            </button>
          </div>
        </div>
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
import { round } from '@/includes/utils';

export default {
  name: 'Climb-Form',
  components: { InvalidFeedback, AspAlert },
  props: ['climbTitle'],
  data() {
    let data = getFormData(['title', 'description', 'difficultyLevel', 'style', 'placeTitle', 'images;array']);
    data.isUpdate = this.climbTitle !== undefined;
    data.selectedImages = [];
    data.climbTitleValid = false;
    data.difficultyLevelStep = 0.1;
    data.files = [];
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
    validateDifficultyLevel(value, getHiddenClass = false) {
      let [integer, decimal] = String(value).split('.');
      integer = Number(integer);
      decimal = Number(decimal);

      let minInvalid = decimal < 6;
      let maxInvalid = decimal > 15;

      if (getHiddenClass) {

        if (minInvalid) {
          this.decrementHiddenClass = 'disabled';
        } else {
          this.decrementHiddenClass = '';
        }
        if (maxInvalid) {
          this.incrementHiddenClass = 'disabled';
        } else {
          this.incrementHiddenClass = '';
        }
      } else return integer < 5 || integer > 5 || minInvalid || maxInvalid;
    },
    getDifficultyLevel(value, decrement) {
      value = Number(value);

      if (decrement) {
        if (value === 5.10) {
          this.difficultyLevelStep = 0.1;
        }
        value -= this.difficultyLevelStep;
      } else {
        value += this.difficultyLevelStep;
      }

      value = round(value);
      if (value === 6 || value === 5.1) {
        this.difficultyLevelStep = 0.01;
        return '5.10';
      } else if (value === 5) {
        this.difficultyLevelStep = 0.1;
        return 5.9;
      }
      return value;
    },
    increment() {
      let difficultyLevel = this.getDifficultyLevel(this.difficultyLevel, false);
      this.difficultyLevel = difficultyLevel;
      let difficultyLevelStep = this.difficultyLevelStep;
      let validateNext = this.getDifficultyLevel(difficultyLevel, false);
      this.validateDifficultyLevel(validateNext, true);
      this.difficultyLevelStep = difficultyLevelStep;
    },
    decrement() {
      let difficultyLevel = this.getDifficultyLevel(this.difficultyLevel, true);
      this.difficultyLevel = difficultyLevel;
      let difficultyLevelStep = this.difficultyLevelStep;
      let validateNext = this.getDifficultyLevel(difficultyLevel, true);
      this.validateDifficultyLevel(validateNext, true);
      this.difficultyLevelStep = difficultyLevelStep;
    },
    onChangeInputFile() {
      let indicateIsValid = 'wasValidated' in this.errors.images;
      this.errors.images = [];
      let invalidMessage = '';
      let existsAlready = '';

      for (let i = 0; i < this.$refs.fileInput.files.length; i++) {
        let file = this.$refs.fileInput.files[i];
        let filenames = this.selectedImages.map(value => value.filename);
        let fileInSelectedFiles = filenames.find(filename => filename === file.name) !== undefined;
        let fileInImages = this.images.find(filename => filename === file.name) !== undefined;
        if (fileInSelectedFiles || fileInImages) {
          if (existsAlready.length === 0) {
            existsAlready = errors.climb.images.exists_already;
          }
        } else if (!file.name.endsWith('jpg')) {
          if (invalidMessage.length === 0) {
            invalidMessage = errors.climb.images.invalid;
          }
        } else {
          this.selectedImages.push({
            filename: file.name,
            objectURL: URL.createObjectURL(file)
          });

          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => this.files.push({
            filename: file.name,
            base64: reader.result
          });
        }
      }

      if (invalidMessage.length > 0) {
        this.errors.images = invalidMessage;
      }
      if (existsAlready.length > 0) {
        if (this.errors.images.length > 0) {
          this.errors.images = [this.errors.images, existsAlready];
        } else {
          this.errors.images = existsAlready;
        }
      }

      this.setValidationOnField('images', indicateIsValid);

      this.$refs.fileInput.value = '';
    },
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
      } else if (this.validateDifficultyLevel(value)) {
        this.errors.difficultyLevel = errors.climb.difficulty_level.range;
      }

      this.setValidationOnField('difficultyLevel', indicateIsValid, false);
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
    validateImagesField() {
      let indicateIsValid = 'wasValidated' in this.errors.images;
      this.errors.images = [];

      if (this.images.length === 0 && Object.entries(this.selectedImages).length === 0) {
        this.errors.images = errors.climb.images.range;
      }

      this.setValidationOnField('images', indicateIsValid, false);
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
    async validateForm(event) {
      // Désactiver le bouton afin d'éviter que l'utilisateur 
      // appuie pleins de fois de suite sur le bouton de soumission
      this.formInValidation = true;

      this.validateTitleField();
      this.validatePlaceTitleField();
      this.validateDescriptionField();
      this.validateDifficultyLevelField();
      this.validateStyleField();
      this.validateImagesField();

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
            try {
              await fetch(`/api/upload`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': getHeaderAuthorization()
                },
                body: JSON.stringify({ files: this.files })
              });
            } catch {
              event.stopPropagation();
              let globalErrorCode = this.isUpdate ? 'update_climb' : 'create_climb';

              this.requestStatus = result.status;
              this.requestMessage = result.codes[globalErrorCode];
              // Map response to the component validation data
              this.formInSubmission = !this.formInSubmission;
            }

            this.formInSubmission = !this.formInSubmission;

            this.$router.go();
            // this.$router.push({ name: 'Home' });
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
    async create() {
      let payload = {
        'title': this.title,
        'description': this.description,
        'style': this.style,
        'difficultyLevel': Number(this.difficultyLevel),
        'placeTitle': this.placeTitle,
        'images': this.selectedImages.map(value => value.filename)
      };

      let response;
      try {
        response = await fetch('/api/climb', {
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
        'placeTitle': this.placeTitle,
        'images': this.selectedImages.map(value => value.filename)
      };

      let response;
      try {
        response = await fetch(`/api/${ this.climbTitle }`, {
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
        response = await fetch(`/api/climb`, {
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
        response = await fetch(`/api/climb/${ this.climbTitle }`, {
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

      if (this.images === '') {
        this.images = [];
      }
      if (this.difficultyLevel === '') {
        this.difficultyLevel = '5.6';
      }
      this.difficultyLevel = Number(this.difficultyLevel);
      this.validateDifficultyLevel(this.getDifficultyLevel(this.difficultyLevel, true), true);
      if (this.decrementHiddenClass === '') {
        this.validateDifficultyLevel(this.getDifficultyLevel(this.difficultyLevel, false), true);
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

img {
  height: 100%;
}
</style>