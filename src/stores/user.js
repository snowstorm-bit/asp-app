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
            localStorage.setItem('user', JSON.stringify(data.result));

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
            localStorage.setItem('user', JSON.stringify(data.result));

            useAlertStore().setMessage('globalMessage', {
                code: data.code,
                status: data.status
            });

            return { status: status.success };
        },
        signOut() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.userLoggedIn = localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('user');

            useAlertStore().setMessage('globalMessage', {
                code: 'successes.routes.sign_out',
                status: status.success
            });

            return true;
        }
    }
});
