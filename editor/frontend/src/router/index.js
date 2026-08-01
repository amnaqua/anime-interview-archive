import {
    createRouter,
    createWebHistory
} from "vue-router";

import People from "../pages/People.vue";
import Companies from "../pages/Companies.vue";
import Works from "../pages/Works.vue";
import Publishers from "../pages/Publishers.vue";
import Languages from "../pages/Languages.vue"

const router =
    createRouter({
        history: createWebHistory(),

        routes: [
            {
                path: "/",
                redirect: "/people"
            },
            {
                path: "/people",
                component: People
            },
            {
                path: "/companies",
                component: Companies
            },
            {
                path: "/works",
                component: Works
            },
            {
                path: "/publishers",
                component: Publishers
            },
            {
                path: "/languages",
                component: Languages
            }
        ]
    });

export default router;