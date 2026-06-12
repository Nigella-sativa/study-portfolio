<template>
<div class="container">
    <div class="title">
        <div class="back-home">
            <el-icon><Back /></el-icon>    
            <!-- //回退图标 -->
            <span>返回首页</span>
        </div>
        <div class="title-text">
            <h2>登录您的账户</h2>
            <p>请输入你的登录信息</p>
        </div>
    </div>
    <div class="form-container">
        <el-form
            ref="ruleFormRef"
            :model="formData"
            :rules="rules"
            label-position="top"
        >
            <el-form-item label="用户名或邮箱" prop="username">
                <!-- 设置表单域   上面的prop属性要与下面formData中设置的字段一样 -->
                <el-input v-model="formData.username" size="large" placeholder="请输入用户名" />
                <!-- v-model：实现双向绑定 -->
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password />
                <!-- show-password：显示密码是否可见  type="password"：密码类型为隐式密码 -->
            </el-form-item>

            <el-button class="btn" type="primary" size="large" @click="submitForm(ruleFormRef)">登录</el-button>
        </el-form>
        <div class="footer">
            <p>还没有账户？ <router-link to="/auth/register">去注册</router-link></p>
            <!-- 路由中提供的组件：router-link  to:点击-跳转路由 -->
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { login } from '@/api/admin'
import { useRouter } from 'vue-router'

const ruleFormRef = ref()
const formData = reactive({
    username: '',
    password: ''
})
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
        //设置校验的触发条件：required：校验是否必填，没有必填，提示的信息message  触发的方式：blur：失去焦点时触发校验，change：值改变时触发校验
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

//登录
const router = useRouter()
const submitForm = async(formEl) =>{
    // 先判断FormEl（当前的form元素）是否存在，不存在则直接返回  
    // 在validate中会接收两个参数：valid：校验是否通过（true：校验通过，false：校验不通过），fields：校验通过的字段值
    if(!formEl) return
    await formEl.validate((valid, fields) =>{
        if(valid){
            login(formData).then(data =>{
                //判断token是否存在
                if(!data.token){
                    return console.log('登录失败')
                }
                //登录成功，保存token和用户信息
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
                //通过JSON.stringify将对象类型的用户信息转成字符串--在缓存中，只能以字符串的形式存储

                //根据用户角色决定跳转的路由
                if(data.userInfo.userType === 2){
                    router.push('/back/dashboard')
                }else {

                }
            })
        }
    })
}

</script>

<style scoped lang="scss">
.container{
    width: 384px;

    .title{
        .back-home{
            margin-bottom: 60px;
        }
    
        .title-text{
            text-align: center;

            h2{
                font-size: 36px;
                margin-bottom: 10px;
            }

            p{
                font-size: 18px;
                color: #6b7280;
            }
        }
    }

    .form-container{
        margin-top: 30px;
        .btn{
            margin-top: 40px;
            width: 100%;
        }
        
        .footer{
            padding: 30px;
            text-align: center;
        }
    }
}
</style>