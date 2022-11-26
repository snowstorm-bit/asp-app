import { defineStore } from 'pinia';
import { status } from '@/includes/enums.js';
import errors from '@/includes/errors.json';

export default defineStore('user', {
    state: () => ({
        userLoggedIn: false,
        user: {}
    }),
    actions: {
        async register(payload) {
            let response;
            try {
                response = await fetch('http://localhost:8080/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } catch (e) {
                return {
                    code: errors.routes.register,
                    status: status.error
                };
            }

            if (response.status === 401) {
                let errorCode = this.userLoggedIn
                    ? errors.auth.session_expired
                    : errors.auth.login_required;

                return {
                    code: errorCode,
                    status: status.error
                };
            } else if (response.status === 403) {
                return {
                    code: errors.auth.unauthorized,
                    status: status.error
                };
            }

            let data = await response.json();

            if (data.status === status.error) {
                return data;
            }

            localStorage.setItem('token', data.token);
            this.user = data.result;
            this.userLoggedIn = true;
            localStorage.setItem('globalMessage', JSON.stringify({ code: data.code, status: data.status }));

            return { status: status.success };
        },
        async authenticate(payload) {
            console.log(payload);

            // await auth.signInWithEmailAndPassword(values.email, values.password);
            // mapper.mapfromObject(codes, errors);
            // this.userLoggedIn = true;
        },
        async signOut() {
            this.userLoggedIn = false;
            localStorage.removeItem('token');
        }
    }
});
