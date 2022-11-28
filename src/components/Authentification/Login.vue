<template>
  <asp-alert v-if="requestStatus.length > 0" :code="requestMessage" :status="requestStatus" />
  <form class="px-4 py-3" @submit.prevent="validateForm">
    <div class="mb-3">
      <label class="form-label input-required-lbl" for="email">{{ $t('fields.email') }}</label>
      <input v-model="email" :class="hiddenClass.email" :placeholder="$t('fields.email')" class="form-control"
             name="email" type="email" @focusin="resetValidationOnField('email')"
             @focusout="validateEmailField">
      <invalid-feedback :error="errors.email" />
    </div>
    <div class="mb-3">
      <label class="form-label input-required-lbl" for="password">{{ $t('fields.password') }}</label>
      <input v-model="password" :class="hiddenClass.password" :placeholder="$t('fields.password')"
             class="form-control" name="password" type="password"
             @focusin="resetValidationOnField('password')" @focusout="validatePasswordField">
      <invalid-feedback :error="errors.password" />
    </div>
    <div class="d-flex justify-content-end">
      <button :disabled="formInValidation||formInSubmission" class="btn btn-lg fs-6 btn-submit" type="submit">
        <i v-show="formInValidation||formInSubmission" class="bi bi-hourglass-split"></i>
        {{ $t('buttons.sign_in') }}
      </button>
    </div>
  </form>
</template>

<script>
import InvalidFeedback from '@/components/InvalidFeedback.vue';
import AspAlert from '@/components/Alert.vue';
import { mapActions } from 'pinia';
import useUserStore from '@/stores/user';
import { getFormData, validateEmail, validateForm, validatePassword } from '@/includes/validation.js';
import { status, validationHiddenClass } from '@/includes/enums.js';

export default {
  name: 'Auth-Login',
  components: { InvalidFeedback, AspAlert },
  data() {
    return getFormData(['email', 'password;array']);
  },
  methods: {
    ...mapActions(useUserStore, ['authenticate']),
    resetForm() {
      let defaultData = getFormData(['username', 'email', 'password;array', 'confirmPassword']);

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
    async validateForm(event) {
      // Désactiver le bouton afin d'éviter que l'utilisateur 
      // appuie pleins de fois de suite sur le bouton de soumission
      this.formInValidation = true;

      this.validateEmailField();
      this.validatePasswordField();

      let formIsValid = validateForm(this.errors);

      if (formIsValid) {
        this.formInValidation = !formIsValid;
        this.formInSubmission = !this.formInValidation;

        // Manage userStore here
        try {
          let result = await this.authenticate(
              {
                email: this.email,
                password: this.password
              });

          if (result.status === status.error) {
            event.stopPropagation();

            if ('login' in result.codes) {
              this.requestStatus = result.status;
              this.requestMessage = result.codes.login;
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
    }
  }
};
</script>

<style scoped>
form {
  width: 100%;
}
</style>