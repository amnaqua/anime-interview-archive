import {
    createRouter,
    createWebHistory
} from "vue-router";

import People from "../pages/People.vue";

const router = createRouter({
    history:createWebHistory(),

    routes:[
        {
            path:"/",
            redirect:"/people"
        },
        {
            path:"/people",
            component:People
        }
    ]
});

export default router;