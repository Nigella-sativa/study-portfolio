import axios from 'axios'
import { ElMessage } from 'element-plus'

//创建axios实例
const service = axios.create({
    baseURL: '/api',   //请求的前缀
    timeout: 5000,  //请求超时时间
})

//请求拦截器
service.interceptors.request.use(  //固定写法
    (config) => {
        //在发送请求之前做些什么
        const token = localStorage.getItem('token')
        //后期将会把token的内容存在缓存里面（localStorage）
        if(token){
            config.headers['token'] = token
        }
        return config
    },
    (error) => {
        //对请求错误做些什么
        console.log(error)
        //返回失败的Promise
        return Promise.reject(error)
    }
)

//响应拦截器
service.interceptors.response.use(
    (response) => {
        //对响应数据做点什么
        const {data, config} = response
        //处理业务状态码
        if(data.code === '200'){
            return data.data
        }else{
            if(data.code === '-1'){
                //请求超时  eg:登录状态过期等
                if(!config.url?.includes('/login')){
                    //不是登录接口，说明登录状态过期
                    //清空token
                    // localStorage.removeItem('token')
                    ElMessage.error(data.mag || '登录过期，请重新登录')

                    //清除登录信息
                    localStorage.removeItem('token')
                    localStorage.removeItem('userInfo')
                    //跳转到登录页
                    window.location.href = '/auth/login'
                }else{
                    //接口异常的情况
                    ElMessage.error(data.mag || '接口异常，请联系管理员')
                    return Promise.reject('网络请求失败')
                }
            }
        }
        return response
    },
    (error) => {
        //对响应错误做点什么
        console.log(error)
        //返回失败的Promise
        return Promise.reject(error)
    }
)

export default service
