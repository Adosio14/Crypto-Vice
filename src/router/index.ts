import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import TransactionsView from "../views/TransactionsView.vue";

const routes = [
    {
        path: "/",
        name: "login",
        component: LoginView
    },
    {
        path: "/home",
        name: "home",
        component: HomeView
    },
    {
        path: "/transactions",
        name: "transactions",
        component: TransactionsView
    },

];



const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router;