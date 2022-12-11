const status = {
    success: 'success',
    error: 'error',
    warning: 'warning'
};

const colorClass = {
    success: 'success',
    error: 'danger',
    warning: 'warning'
};

const validationHiddenClass = {
    isValid: 'is-valid',
    isInvalid: 'is-invalid',
    wasValidated: 'was-validated'
};

const routeNames = {
    home: 'home',
    place: {
        create: 'place-create',
        update: 'place-update',
        details: 'place-details'
    },
    climb: {
        create: 'climb-create',
        update: 'climb-update',
        details: 'climb-details'
    },
    notFound: 'not-found'
};

export { status, colorClass, validationHiddenClass, routeNames };