import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        username: localStorage.getItem('username'),
        balance: 1000,
    }),
    actions: {
        setUser(username: string) {
            this.username = username;
            localStorage.setItem('username', username);
        },

    }
});