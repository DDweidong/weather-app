import { createWebHashHistory, createRouter } from 'vue-router'

//
import layout from '@/views/layout.vue'
import weather from '@/views/weather.vue'
import air from '@/views/air.vue'

const routes=[
    {
        path:'/',
        name:'layout',
        component:layout,
        children:[
            {
                path:'/weather',
                name:'weather',
                component:weather
            },
            {
                path:'/air',
                name:'air',
                component:air
            }
        ]
    }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

//
export default router 