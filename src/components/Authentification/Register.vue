<template>
  <asp-alert v-if="requestStatus.length > 0" :message="requestMessage" :status="requestStatus" />
  <form class="px-4 py-3" @submit.prevent="validateForm">
    <div class="mb-3">
      <label class="form-label input-required-lbl" for="username">{{ $t('fields.username') }}</label>
      <input v-model="username" :class="hiddenClass.username" :placeholder="$t('fields.username')"
             class="form-control" name="username" required="required" type="text"
             @focusin="resetValidationOnField('username')" @focusout="validateUsernameField">
      <invalid-feedback :error="errors.username" />
    </div>
    <div class="mb-3">
      <label class="form-label input-required-lbl" for="email">{{ $t('fields.email') }}</label>
      <input v-model="email" :class="hiddenClass.email" :placeholder="$t('fields.email')" class="form-control"
             name="email" required="required" type="email" @focusin="resetValidationOnField('email')"
             @focusout="validateEmailField">
      <invalid-feedback :error="errors.email" />
    </div>
    <div class="mb-3">
      <label class="form-label input-required-lbl" for="password">{{ $t('fields.password') }}</label>
      <input v-model="password" :class="hiddenClass.password" :placeholder="$t('fields.password')"
             class="form-control" name="password" required="required" type="password"
             @focusin="resetValidationOnField('password')" @focusout="validatePasswordField">
      <invalid-feedback :error="errors.password" />
    </div>
    <div class="mb-3">
      <label class="form-label input-required-lbl" for="confirm_password">{{ $t('fields.confirm_password') }}</label>
      <input v-model="confirmPassword" :class="hiddenClass.confirmPassword"
             :placeholder="$t('fields.confirm_password')"
             class="form-control" name="confirm_password" required="required" type="password"
             @focusin="resetValidationOnField('confirmPassword')" @focusout="validateConfirmPasswordField">
      <invalid-feedback :error="errors.confirmPassword" />
    </div>
    <div class="d-flex justify-content-end">
      <button :disabled="formInValidation||formInSubmission" class="btn btn-lg fs-6 btn-submit" type="submit">
        <i v-show="formInValidation||formInSubmission" class="bi bi-hourglass-split"></i>
        {{ $t('buttons.register') }}
      </button>
    </div>
  </form>
</template>

<script>
import InvalidFeedback from '@/components/InvalidFeedback.vue';
import errors from '@/includes/errors.json';
import { mapActions } from 'pinia';
import useUserStore from '@/stores/user';
import {
  getFormData,
  validateEmail,
  validateEmptyOrWhiteSpace,
  validateForm,
  validatePassword,
  validateRange
} from '@/includes/validation.js';
import { status, validationHiddenClass } from '@/includes/enums.js';
import AspAlert from '@/components/Alert.vue';

export default {
  name: 'Auth-Register',
  components: { InvalidFeedback, AspAlert },
  data() {
    return getFormData(['username', 'email', 'password;array', 'confirmPassword']);
  },
  methods: {
    ...mapActions(useUserStore, ['register']),
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
        this.errors.username = errors.fields.username.empty_or_white_spaces;
      } else if (!validateRange(value, 3, 50)) {
        this.errors.username = errors.fields.username.length;
      }

      this.setValidationOnField('username', indicateIsValid);
    },
    validateEmailField() {
      let indicateIsValid = typeof this.errors.email !== 'string';
      this.errors.email = '';
      let value = this.email;

      this.errors.email = validateEmail(value);
      this.setValidationOnField('email', indicateIsValid);
    },
    validatePasswordField() {
      let indicateIsValid = typeof this.errors.password.length > 0;
      this.errors.password = [];
      let value = this.password;

      this.errors.password = validatePassword(value);
      this.setValidationOnField('password', indicateIsValid);
    },
    validateConfirmPasswordField() {
      let indicateIsValid = typeof this.errors.confirmPassword !== 'string';
      this.errors.confirmPassword = '';

      if (this.confirmPassword !== this.password) {
        this.errors.confirmPassword = errors.fields.password.not_equal;
      }

      this.setValidationOnField('confirmPassword', indicateIsValid, false);
    },
    async validateForm(event) {
      // Désactiver le bouton afin d'éviter que l'utilisateur 
      // appuie pleins de fois de suite sur le bouton de soumission
      this.formInValidation = true;

      this.validateUsernameField();
      this.validateEmailField();
      this.validatePasswordField();
      this.validateConfirmPasswordField();

      let formIsValid = validateForm(this.errors);

      if (formIsValid) {
        this.formInValidation = !formIsValid;
        this.formInSubmission = !this.formInValidation;

        // Manage userStore here
        try {
          let result = await this.register(
              {
                email: this.email,
                password: this.password
              });

          console.log('result', result);
          if (result.status === status.error) {
            event.stopPropagation();

            if ('register' in result.codes) {
              this.requestStatus = result.status;
              this.requestMessage = result.codes['register'];
            } else {
              for (const [key, value] of Object.entries(result.codes)) {
                this.errors[key] = value;
                this.hiddenClass[key] = validationHiddenClass.isInvalid;
              }
            }
            // Map response to the component validation data
            this.formInSubmission = !this.formInSubmission;
          } else {
            this.formInSubmission = !this.formInSubmission;
          }
        } catch {
          event.stopPropagation();
          this.formInSubmission = !this.formInSubmission;
        }

        console.log(this.$route);
        console.log(this.$router);
        // window.location.reload();
      } else {
        event.stopPropagation();
        this.formInValidation = formIsValid;
      }
    }
  }
};

</script>

<style scoped>
form {
  width: 100%;
}
</style>