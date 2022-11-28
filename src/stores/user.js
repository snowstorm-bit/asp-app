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
                response = await fetch('http://localhost:8080/user/registr', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } catch (e) {
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

            useAlertStore().setMessage({
                code: data.code,
                status: data.status
            });

            return { status: status.success };
        },
        async authenticate(payload) {
            console.log(payload);
            let response;
            try {
                response = await fetch('http://localhost:8080/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } catch (e) {
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

            useAlertStore().setMessage({
                code: data.code,
                status: data.status
            });

            return { status: status.success };
        },
        signOut() {
            this.userLoggedIn = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            useAlertStore().setMessage({
                code: 'successes.routes.sign_out',
                status: status.success
            });

            return true;
        }
    }
});
