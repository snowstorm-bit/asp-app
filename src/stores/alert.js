import { defineStore } from 'pinia';

export default defineStore('alert', {
    state: () => ({
        hasGlobalMessage: localStorage.hasOwnProperty('globalMessage'),
        hasAuthInvalidMessage: localStorage.hasOwnProperty('authInvalid')
    }),
    actions: {
        getAuthInvalid() {
            let message = JSON.parse(localStorage.getItem('authInvalid'));
            localStorage.removeItem('authInvalid');
            this.hasAuthInvalidMessage = localStorage.hasOwnProperty('authInvalid');
            return message;
        },
        getGlobalMessage() {
            let message = JSON.parse(localStorage.getItem('globalMessage'));
            localStorage.removeItem('globalMessage');
            this.hasGlobalMessage = localStorage.hasOwnProperty('globalMessage');
            return message;
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