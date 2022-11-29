import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotFound from '@/views/NotFound.vue';
import PlaceForm from '@/views/Place/PlaceForm.vue';
import ClimbForm from '@/views/Climb/ClimbForm.vue';

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
        path: '/place/update/:placeTitle',
        name: 'PlaceUpdate',
        props: true,
        component: PlaceForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/climb/create',
        name: 'ClimbCreate',
        component: ClimbForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/climb/update/:climbTitle',
        name: 'ClimbUpdate',
        props: true,
        component: ClimbForm,
        meta: { requiresAuth: true }
    },
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
