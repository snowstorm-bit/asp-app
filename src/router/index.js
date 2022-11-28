import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotFound from '@/views/NotFound.vue';
import PlaceForm from '@/views/Place/PlaceForm.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/home',
        redirect: { name: 'Home' }
    },
    {
        path: '/place/create',
        name: 'PlaceCreate',
        component: PlaceForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/places/update/:title',
        name: 'PlaceUpdate',
        props: true,
        component: PlaceForm,
        meta: { requiresAuth: true }
    },
    // {
    //     path: '/climbs/create',
    //     name: 'climbCreate',
    //     component: HomeView,
    //     meta: { requiresAuth: true }
    // },
    // {
    //     path: '/climbs/update/:title',
    //     name: 'climbsCreate',
    //     props: true,
    //     component: HomeView,
    //     meta: { requiresAuth: true }
    // },
    {
        path: '/:notFound(.*)*',
        name: 'NotFound',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;
