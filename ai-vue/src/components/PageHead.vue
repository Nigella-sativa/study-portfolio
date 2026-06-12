<template>
    <div class="page-head">
        <p class="page-title">{{props.title}}</p>
        <div class="action-btn">
            <slot name="buttons"></slot>
            <!-- 使用具名插槽渲染按钮内容--通过多个name属性来实现多个按钮的渲染 -->
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: '页面标题'
    }
})
//通过defineProps方法接受具体页面中设置的title中的值，将其赋值给pageTitle变量 ，并将其动态地渲染到页面上
</script>

<style lang="scss" scoped>
.page-head {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .page-title{
        font-size: 24px;
        color: #2d3748;
    }
}
</style>
