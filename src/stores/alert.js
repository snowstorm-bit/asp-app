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
            return message;
        },
        getGlobalMessage() {
            let message = JSON.parse(localStorage.getItem('globalMessage'));
            localStorage.removeItem('globalMessage');
            return message;
        },
        setMessage(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }
});