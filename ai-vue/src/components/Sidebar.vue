<template>
    <el-aside :width="isCollapse ? '64px' : '264px'">
        <!-- 动态修改导航栏的宽度 -->
        <el-menu
            :collapse="isCollapse"
            :collapse-transition="false"
            default-active="2"
            class="menu-style"
            >
            <!--  通过isCollapse属性来实现导航栏的折叠和展开  collapse-transition="false" 用来关闭导航栏的折叠和展开的过渡动画(不要变形) -->
            <div class="brand"">
                <el-image style="width: 50px; height: 50px; margin-right: 10px;"  :src="iconUrl" alt="logo" />
                <div v-show="!isCollapse" class="info-card">
                    <!-- 如果菜单是展开的的，那它就折叠收起来  与菜单是相反的状态 -->
                    <h1 class="brand-title">心理健康AI助手</h1>
                    <p class="brand-subtitle">管理后台</p>
                </div>
            </div>
            <el-menu-item @click="selectMenu" v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
                <!-- 加冒号：将属性改为动态属性   eg:index="item.path" -->
            <el-icon><component :is="item.meta.icon" /></el-icon>
            <!-- 这边的icon与router文件中index.js 中为每一个子路由设置meta中的icon保持一致 -->
            <!-- 使用动态组件component-is属性传入组件名称来渲染图标 -->
            <span>{{item.meta.title}}</span>
            </el-menu-item>
      </el-menu>
    </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/admin'
import { computed } from 'vue';

const router = useRouter();

const iconUrl = new URL('@/assets/images/机器人.png', import.meta.url).href;
// import.meta.url（固定写法） 是当前模块的URL，new URL() 方法可以将相对路径转换为绝对路径  
// 它用来返回一个实例，通过获取当前实例的href属性来获取当前的图片地址以确保在打包的时候能够正确获取当前打包后路径的正确性

const selectMenu = (key) =>{
    console.log(key)
    const currentRoute = router.options.routes[0]
    // 用来获取需要获取的路由的父路由
    router.push(`${currentRoute.path}/${key.index}`)
}

console.log(router);


const isCollapse = computed(() => useAdminStore().isCollapse)
//先监听useAdminStore()获取到当前store实例，再通过实例中获取到isCollapse属性，最后通过computed()将isCollapse属性转换为响应式属性

</script>

<style lang="scss" scoped>
.menu-style {
    height: 100%;

    .brand{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        background-color: #fff;
        border-bottom: 1px solid #e5e7eb;

        .info-card{
            .brand-title{
                font-size: 20px;
                font-weight: bold;
                margin-top: 5px;
                color: #1f2937;
            }

            .brand-subtitle{
                font-size: 14px;
                color: #6b7280;
            }
        }
    }
}
</style>