'use strict';

import errors from '@/includes/errors.json';
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

function toString(value) {
    if (typeof value !== 'string')
        value = String(value);

    value.trim();
}

function validateEmptyOrWhiteSpace(value) {
    toString(value);
    return value.length >= 1;
}

function validateMaxLength(value, max) {
    toString(value);
    return value.length <= max;
}

function validateRange(value, min, max) {
    toString(value);
    return value.length >= min && value.length <= max;
}

function validateEmail(value) {
    let emailRegex = '^\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$';

    if (!validateEmptyOrWhiteSpace(value)) {
        return errors.fields.email.empty_or_white_spaces;
    } else if (!validateMaxLength(value, 50)) {
        return errors.fields.email.length_exceeded;
    } else if (value.match(emailRegex) === null) {
        return errors.fields.email.invalid;
    }

    return '';
}

function validatePassword(value) {
    if (!validateEmptyOrWhiteSpace(value)) {
        return errors.fields.password.empty_or_white_spaces;
    } else if (!validateRange(value, 6, 12)) {
        return errors.fields.password.length;
    }

    let errorsToThrow = [];

    if (value.match('[0-9]') === null) {
        errorsToThrow.push(errors.fields.password.no_number);
    }
    if (value.match('[#?!@$%^&*-]') === null) {
        errorsToThrow.push(errors.fields.password.no_symbol);
    }
    if (value.match('[A-Z]') === null) {
        errorsToThrow.push(errors.fields.password.no_uppercase_letter);
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

function validateAuthFromResponse(responseStatus, userLoggedIn) {
    let errorCode;

    if (responseStatus === 401) {
        errorCode = userLoggedIn
            ? errors.auth.session_expired
            : errors.auth.login_required;
    } else if (responseStatus === 403) {
        errorCode = errors.auth.unauthorized;
    }

    if (errorCode > 0) {
        this.userLoggedIn = false;
        this.user = {};
        localStorage.setItem('authInvalid', JSON.stringify({ code: errorCode, status: status.error }));
        return false;
    }

    return true;
}

let a = () => {
    let validation = validateAuthFromResponse(401, true);
    if ('code' in validation) {
        return false;
    }
};

export {
    toString,
    validateEmptyOrWhiteSpace,
    validateMaxLength,
    validateRange,
    validateEmail,
    validatePassword,
    validateForm,
    getFormData,
    validateAuth
};