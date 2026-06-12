<template>
<el-form ref="ruleFormRef" :model="formData">
    <el-row :gutter="24">
        <!-- gutter: 表示组件之间的间距，默认是0 -->
        <template v-for="item in formItemAttrs" :key="item.prop">
            <el-col v-bind="item.col">
                <el-form-item :label="item.label" :prop="item.prop">
                    <!-- prop属性是必须要的，而且要和各个组件中的formItem中的prop属性保持一致，因此用item.prop绑定 -->
                    <component v-model="formData[item.prop]" :is="isComp(item.comp)" :placeholder="item.placeholder">
                    <!-- 表单框很多的情况下，可以使用component根据组件的名字来动态实现（使用is传入对应的组件）   比较少的情况下可以用v-if属性 -->
                        <template v-if="item.comp === 'select'">
                            <el-option label="全部" value="" />
                            <el-option v-for="opt in item.options"
                            :key="opt.value" 
                            :label="opt.label" 
                            :value="opt.value" />
                        </template>
                    </component>                
                </el-form-item>
            </el-col>
        </template>
    </el-row>
    <el-row>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <!-- 有primary属性的时候，按钮为蓝色，点击后会触发handleSearch方法，查询数据 -->
        <el-button @click="handleReset(ruleFormRef)">重置</el-button>
    </el-row>
    
    
</el-form>


</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
    formItem: {
        type: Array,
        default: () => []
    }
})
//接收各个组件中的formItem，作为数据源

const emit = defineEmits(['search'])
//在父组件中，使用@search="handleSearch"来接收事件，事件参数是formData表单数据

const formItemAttrs = computed(() =>{
    const {formItem} = props
    formItem.forEach(item => {
        item.col = {xs:24, sm:12, md:8, lg:6, xl:6}
        //表示不同的显示尺寸，xs：超小屏幕，sm：小屏幕，md：中屏幕，lg：大屏幕，xl：超大屏幕  后面的数字表示在该尺寸下，组件占用的列数
        // 与上面el-row的gutter属性保持一致
    })
    return formItem
})

//表单数据
const ruleFormRef = ref()
const formData = reactive({})
const isComp = (comp) =>{
    return {
        //使用映射的方式将comp转换为对应的组件名称
        input: 'elInput', 
        select: 'elSelect',
    }[comp]
}

const handleSearch = () =>{
    //此方法相当于一个回调函数，在组件内部调用，拿到form表单中输入的数据
    // console.log(formData)
    emit('search', formData)
}

const handleReset = (formEl) =>{
    //此方法相当于一个回调函数，在组件内部调用，重置form表单
    //实际运行的时候，可以先重置表单，然后再进行一次查询的操作
    if(!formEl) return
    formEl.resetFields()
    handleSearch()
}
</script>