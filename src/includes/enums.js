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

const routeName = {
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

const APIGlobalRouteCode = {
    auth: 'authentication',
    home: 'home'
};

const APIUserRouteCode = {
    register: 'register',
    login: 'login',
    account: {
        profile: 'profile',
        createdPlaces: 'created_places',
        createdClimbs: 'created_climbs',
        ratedClimbs: 'rated_climbs'
    }
};

const APIPlaceRouteCode = {
    details: 'place_details',
    create: 'create_place',
    update: 'update_place',
    delete: 'delete_place'
};

const APIClimbRouteCode = {
    all: 'climb_all',
    details: 'climb_details',
    create: 'create_climb',
    update: 'update_climb',
    delete: 'delete_climb',
    rate: 'rate_climb'
};

export {
    status,
    colorClass,
    validationHiddenClass,
    routeName,
    APIGlobalRouteCode,
    APIUserRouteCode,
    APIPlaceRouteCode,
    APIClimbRouteCode
};