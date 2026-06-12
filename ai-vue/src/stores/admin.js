import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () =>{
    //''中的是当前store的名字（唯一）， 返回的是一个对象，对象中包含当前store的所有属性和方法
    //响应式的状态通过ref来定义

    const isCollapse = ref(false)//默认状态

    const toggleCollapse = () =>{
        isCollapse.value = !isCollapse.value
    }//对原状态进行取反

    return {
        isCollapse,
        toggleCollapse//暴露以上两个属性和方法
    }
})
