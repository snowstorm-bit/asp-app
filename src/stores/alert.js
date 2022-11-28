import { defineStore } from 'pinia';

export default defineStore('alert', {
    state: () => ({
        hasMessage: localStorage.hasOwnProperty('globalMessage')
    }),
    actions: {
        getMessage() {
            let message = JSON.parse(localStorage.getItem('globalMessage'));
            localStorage.removeItem('globalMessage');
            return message;
        },
        setMessage(data) {
            localStorage.setItem('globalMessage', JSON.stringify(data));
        }
    }
});