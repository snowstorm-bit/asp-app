import useAlertStore from '@/stores/alert';
import { defineStore } from 'pinia';
import { status } from '@/includes/enums.js';
import errors from '@/includes/errors.json';

export default defineStore('user', {
    state: () => ({
        modalIsOpened: false,
        userLoggedIn: localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('user')
    }),
    actions: {
        validateUserIsAdmin() {
            if (this.userLoggedIn) {
                let user = JSON.parse(localStorage.getItem('user'));
                return user.isAdmin === undefined ? false : user.isAdmin;
            }
            return false;
        },
        async register(payload) {
            let response;
            try {
                response = await fetch('/api/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } catch {
                return {
                    codes: { 'register': errors.routes.register },
                    status: status.error
                };
            }

            let data = await response.json();

            if (data.status === status.error) {
                return data;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ username: data.result.username }));

            useAlertStore().setMessage('globalMessage', {
                code: data.code,
                status: data.status
            });

            return { status: status.success };
        },
        async authenticate(payload) {
            let response;
            try {
                response = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } catch {
                return {
                    codes: { 'login': errors.routes.login },
                    status: status.error
                };
            }

            let data = await response.json();

            if (data.status === status.error) {
                return data;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                username: data.result.username,
                isAdmin: data.result.accessLevel === 2
            }));

            useAlertStore().setMessage('globalMessage', {
                code: data.code,
                status: data.status
            });

            return { status: status.success };
        },
        signOut(setGlobalMessage = true) {
            if (localStorage.hasOwnProperty('user')) {
                localStorage.removeItem('user');
            } else if (localStorage.hasOwnProperty('token')) {
                localStorage.removeItem('token');
            }

            this.userLoggedIn = localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('user');

            if (setGlobalMessage) {
                useAlertStore().setMessage('globalMessage', {
                    code: 'successes.routes.sign_out',
                    status: status.success
                });
            }

            return true;
        },
        setAuthInvalid(errorCode) {
            useAlertStore().setMessage('authInvalid', {
                code: errorCode,
                status: status.error
            });
            return true;
        }
    }
});
