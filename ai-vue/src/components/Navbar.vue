<template>
    <div class="navbar">
        <div class="flex-box">
            <button @click="handleCollapse">
                <el-icon><Expand /></el-icon>
            </button>
            <!-- route代表的是当前路由的信息 -->
            <p class="page-title">{{ route.meta.title }}</p>
        </div>
        <div class="flex-box">
            <el-dropdown @command="handleCommand">
                <!-- 通过el-dropdown组件实现下拉菜单效果  command事件处理函数 -->
                <div class="flex-box">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <p class="user-name">admin</p>
                    <el-icon><ArrowDown /></el-icon>
                </div>
                 <template #dropdown>
                    <!-- 上面的#代表的是v-slot:dropdown -简写 -->
                     <el-dropdown-menu>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                     </el-dropdown-menu>
                 </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminStore } from '@/stores/admin'
//通过调用useRouter拿到路由的实例,useRoute用来拿取当前路由的对象
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { logout } from '@/api/admin'

const router = useRouter()
const route = useRoute()


const handleCommand = (command) => {
    // 点击command的时候会含有一个回调参数，参数中包含当前点击的command值，点击的内容通过插槽渲染（在上面e-dropdown下面的template中）
    console.log(command)
    if(command === 'logout') {
        //处理退出登录逻辑
        ElMessageBox.confirm('确定退出登录吗？', '提示', {
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
        }).then(() =>{
            //确认退出登录
            logout().then(() =>{
                //清除缓存
                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')

                //跳转到登录页
                router.push('/auth/login')
            })
        })
    }
}

const handleCollapse = () => {
    useAdminStore().toggleCollapse()  //通过调用实例-调用实例中修改状态的方法来实现导航栏的折叠和展开
}
</script>



<style lang="scss" scoped>
.navbar {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background: white;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    border-bottom: 1px solid #e5e7eb;

    .flex-box {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .page-title {
        margin-left: 20px;
        font-size: 26px;
        font-weight: bold;  //字体粗细
        color: #292b2f;
    }
}
</style>
