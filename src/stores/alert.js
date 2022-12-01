import { defineStore } from 'pinia';

export default defineStore('alert', {
    state: () => ({
        hasGlobalMessage: localStorage.hasOwnProperty('globalMessage'),
        hasAuthInvalidMessage: localStorage.hasOwnProperty('authInvalid')
    }),
    actions: {
        getAuthInvalid() {
            if (localStorage.hasOwnProperty('authInvalid')) {
                let message = JSON.parse(localStorage.getItem('authInvalid'));
                localStorage.removeItem('authInvalid');
                return message;
            }
            this.hasAuthInvalidMessage = localStorage.hasOwnProperty('authInvalid');
            return undefined;
        },
        getGlobalMessage() {
            if (localStorage.hasOwnProperty('globalMessage')) {
                let message = JSON.parse(localStorage.getItem('globalMessage'));
                localStorage.removeItem('globalMessage');
                return message;
            }
            this.hasGlobalMessage = localStorage.hasOwnProperty('globalMessage');
            return undefined;
        },
        setMessage(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
            if (key === 'globalMessage') {
                this.hasGlobalMessage = localStorage.hasOwnProperty('globalMessage');
            } else if (key === 'authInvalid') {
                this.hasAuthInvalidMessage = localStorage.hasOwnProperty('authInvalid');
            }
        }
    }
});