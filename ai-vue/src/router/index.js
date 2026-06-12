import {createRouter, createWebHistory} from 'vue-router'
//createWebHistory & createWebHashHistory两种模式前者项目中路由连接符没有#，后者有，如：localhost:5173/#/back...
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'

// 路由配置-后台路由
const backendRoutes = [
    {
        path:'/back',
        //（已登录的情况下）配置重定向逻辑:当访问back的时候，会自动跳转到back/dashboard页面--首页
        redirect:'back/dashboard',
        component:BackendLayout,
        children:[
            {
                path:'dashboard',
                component:()=>import('@/view/dashboard.vue'),
                meta:{
                    title:'数据分析',
                    icon:'PieChart'
                }
            },
            {
                path:'knowledge',
                component:()=>import('@/view/knowledge.vue'),
                meta:{
                    title:'知识文章',
                    icon:'ChatLineSquare'
                }
            },
            {
                path:'consultations',
                component:()=>import('@/view/consultations.vue'),
                meta:{
                    title:'咨询记录',
                    icon:'Message'
                }
            },
            {
                path:'emotional',
                component:()=>import('@/view/emotional.vue'),
                meta:{
                    title:'情绪日志',
                    icon:'User'
                }
            },
        ]
    },
    {
        path:'/auth',
        component:AuthLayout,
        children:[
            {
                path:'login',
                component:() => import('@/view/login.vue'),
                meta:{
                    title:'登录'
                }
            },
            {
                path:'register',
                component:() => import('@/view/register.vue'),
                meta:{
                    title:'注册'
                }
            }
        ]
    }
]

//前台路由
const frontendRoutes = [
    {
       path: '/',
       component: FrontendLayout,
       children:[
            {
                path: '/',
                component:() => import('@/view/home.vue')
            },
            {
                path: 'consultation',
                component: () => import('@/view/consultation.vue')
            },
            {
                path: 'emotion-diary',
                component: () => import('@/view/emotionDiary.vue')
           },
           {
                path: 'knowledge',
                component: () => import('@/view/frontendKnowledge.vue')
           }
       ]
}]

const router = createRouter({
    history:createWebHistory(),
    //将前后台路由合并--使用扩展运算符进行数组的合并
    routes:[...backendRoutes, ...frontendRoutes]
})

//路由前置守卫：输入url页面跳转之前需要做的事情
router.beforeEach((to, from, next) =>{
    const token = localStorage.getItem('token')
    //当前用户是否登录
    if(token){
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))

        //如果是后台用户
        if(userInfo.userType == 2){
            if(to.path.startsWith('/back')){
                next()
            }else{
                //相当于做一个限制，如：后台用户在登陆情况下，在url中随便访问，会跳转到back/dashboard页面
            next('/back/dashboard')
            }            
        }else if(userInfo.userType == 1){
            //用户端账户只能访问前台路由（/back）,也不允许再次进行登录(/auth)
            if(to.path.startsWith('/back') || to.path.startsWith('/auth')){
                //用户访问不被允许的路径-》直接跳转到首页
                next('/')
            }else{
                //跳转到正常的用户页面
                next()
            }
        }
    }else{
        // 通过路径区分是前台用户还是后台用户
        // 通过to对象的path属性：代表的是即将跳转的路径     下面代码的意思是判断接下来需要跳转的路径是否存在back，存在就代表是后台用户
        if(to.path.startsWith('/back')){
            //访问后台页面-》跳至登录页
            next('/auth/login')
        }else{
            // 前台-》直接返回
            next()
        }
    }
})

export default router