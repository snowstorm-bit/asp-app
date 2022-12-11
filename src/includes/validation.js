'use strict';

import errors from '@/includes/errors.json';
import useUserStore from '@/stores/user';
import { toString } from '@/includes/utils';
import warnings from '@/includes/warnings.json';
import { status } from '@/includes/enums';

/**
 * Return the validation data for a form for the specified fields
 * @param fields An array containing the fields name with,
 * if the case, the custom default value for the error
 */
function getFormData(fields) {
    let data = {};
    data.formInValidation = false;
    data.formInSubmission = false;
    data.requestStatus = '';
    data.requestMessage = '';
    data.hiddenClass = {};
    data.errors = {};

    fields.forEach(field => {
        if (typeof field === 'string') {
            if (field.includes(';')) {
                let [key, value, ...rest] = field.split(';');

                if (rest.length > 0) {
                    throw new Error(`The value ${ field } passed to the methods cannot contain more than one ';'`);
                }
                data[key] = '';
                data.hiddenClass[key] = '';

                if (value === 'array')
                    data.errors[key] = [];
            } else {
                data[field] = '';
                data.hiddenClass[field] = '';
                data.errors[field] = '';
            }
        } else {
            throw new Error(`The value ${ field } passed to the methods must be a string`);
        }
    });

    return data;
}

function validateEmptyOrWhiteSpace(value) {
    value = toString(value);
    return value.length >= 1;
}

function validateMaxLength(value, max) {
    value = toString(value);
    return value.length <= max;
}

function validateRange(value, min, max, validateLength = true) {
    let valueToEvaluate = value;
    if (validateLength) {
        valueToEvaluate = toString(value).length;
    }
    return valueToEvaluate >= min && valueToEvaluate <= max;
}

function validateEmail(value) {
    let emailRegex = '^\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$';

    if (!validateEmptyOrWhiteSpace(value)) {
        return errors.user.email.empty_or_white_spaces;
    } else if (!validateMaxLength(value, 50)) {
        return errors.user.email.length_exceeded;
    } else if (value.match(emailRegex) === null) {
        return errors.user.email.invalid;
    }

    return '';
}

function validatePassword(value) {
    if (!validateEmptyOrWhiteSpace(value)) {
        return errors.user.password.empty_or_white_spaces;
    } else if (!validateRange(value, 6, 12)) {
        return errors.user.password.length;
    }

    let errorsToThrow = [];

    if (value.match('[0-9]') === null) {
        errorsToThrow.push(errors.user.password.no_number);
    }
    if (value.match('[#?!@$%^&*-]') === null) {
        errorsToThrow.push(errors.user.password.no_symbol);
    }
    if (value.match('[A-Z]') === null) {
        errorsToThrow.push(errors.user.password.no_uppercase_letter);
    }

    return errorsToThrow;
}

function validateForm(errors) {
    let i = 0;
    let formIsValid = true;

    do {
        let [_, value] = Object.entries(errors)[i];
        formIsValid = value.length < 1;
        i++;
    } while (i < Object.entries(errors).length && formIsValid);

    return formIsValid;
}

function validateAuth(requiresAuth, userLoggedIn) {
    let authRequired = requiresAuth || false;
    return !authRequired || authRequired && userLoggedIn;
}

function getHeaderAuthorization() {
    return 'Bearer ' + localStorage.getItem('token');
}

/** Deprecated */
async function validateAuthFromResponse(responseStatusCode, userLoggedIn, alertStoreSetMessage = true) {
    let errorCode = '';

    if (responseStatusCode === 401) {
        if (userLoggedIn) {
            errorCode = errors.auth.session_expired;
        } else {
            errorCode = errors.auth.login_required;
        }
        if (localStorage.hasOwnProperty('user')) {
            localStorage.removeItem('user');
        } else if (localStorage.hasOwnProperty('token')) {
            localStorage.removeItem('token');
        }
    }
    if (responseStatusCode === 403) {
        errorCode = errors.auth.unauthorized;
    }

    if (errorCode.length > 0) {
        if (alertStoreSetMessage) {
            useAlertStore().setMessage('authInvalid', {
                code: errorCode,
                status: status.error
            });

            return false;
        }
    }

    return true;
}

async function validateNeedsAuth(responseStatusCode, responseErrorCode) {
    if (responseStatusCode === 401) {
        useUserStore().signOut(false);
    }

    if (responseErrorCode && responseErrorCode.length > 0) {
        useUserStore().setAuthInvalid(responseErrorCode);
        return false;
    }

    return true;
}

async function validateIsAuth(isCreator, errorCodeKey) {
    if (isCreator.status && isCreator.status === 401) {
        if (isCreator.code === errors.auth.session_expired) {
            useUserStore().signOut(false);

            return {
                codes: { [errorCodeKey]: warnings.auth.login_again },
                status: status.warning
            };
        }
        return false;
    }
    return true;
}

export {
    toString,
    validateEmptyOrWhiteSpace,
    validateMaxLength,
    validateRange,
    validateEmail,
    validatePassword,
    validateForm,
    getFormData,
    validateAuth,
    getHeaderAuthorization,
    validateAuthFromResponse,
    validateNeedsAuth,
    validateIsAuth
};