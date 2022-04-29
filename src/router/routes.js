
export default [
    {
        path:"/",
        redirect: "/login"
    },
    {
        path: '/login',
        name: 'auth',
        meta: {
            onlyWhenLogout: true,
        },
        component: ()=>import("@/views/auth/views/phone"),
    },
    {
        path: "/user",
        name: 'user',
        component: ()=>import('../views/user/main/main/mainView'),
        children: [
            {
                redirect: "/user/home",
                path: ''
            },
            {
                path: "home",
                name: 'user-home',
                component: ()=>import('../views/user/main/views/home'),
            },
            {
                path: "profile",
                name: 'user-profile',
                component: ()=>import('../views/user/main/views/user-profile'),
            },
            {
                path: "family",
                name: 'user-family',
                component: ()=>import('../views/user/main/views/user-family'),
            },
            {
                path: "history",
                name: 'user-history',
                component: ()=>import('../views/user/main/views/user-history'),
            },
        ]
    },
    {
        path: "/driver",
        name: 'driver',
        component: ()=>import('../views/driver/main/mainDriverTabs'),
        children: [
            {
                path:'',
                redirect:'/driver/home'
            },
            {
                path:"home",
                name:"driver-home",
                component:() => import("../views/driver/views/driver-home")
            },
            {
                path:"drivers",
                name:"driver-drivers",
                component:() => import("../views/driver/views/driver-drivers")
            },
            {
                path:"profile",
                name:"driver-profile",
                component:() => import("../views/driver/views/driver-profile")
            },
            {
                path:"dashboard",
                name:"driver-dashboard",
                component:() => import("../views/driver/views/driver-dashboard")
            },
            {
                path: "wallet",
                name: 'driver-wallet',
                component: ()=>import('../views/driver/views/driver-wallet'),
            },
        ]
    },
    {
        path: "/driver/select-car",
        name: 'driver-select-car',
        component: ()=>import('../views/driver/views/driver-selectCar'),
    },
    {
        path: "/driver/setup-data",
        name: 'driver-setup-data',
        component: ()=>import('../views/driver/views/driver-completeData'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
    // {
    //   path: "/messages",
    //   name: 'messages',
    //   component: ()=>import('../views/messages/views/chats'),
    // }
]
