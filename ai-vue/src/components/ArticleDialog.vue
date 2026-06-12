<template>
    <el-dialog 
        :title="isEdit ? '编辑文章' : '新增文章'"
        v-model="dialogVisible"
        width="50%"
        @close="handleClose"
    >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="文章标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
            <el-select v-model="formData.categoryId" placeholder="请选择所属分类">
                <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="文章摘要" prop="summary">
            <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)"  maxlength="1000" :rows="4" show-word-limit />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
            <el-select v-model="formData.tagArray" placeholder="请输入文章标签(逗号分离)" multiple filterable allow-create style="width: 100%" > 
                <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
            </el-select>
        </el-form-item>
        <el-form-item label="封面图片">
            <div class="cover-upload">
                <el-upload               
                    class="avatar-uploader"
                    action="#"
                    :before-upload="beforeUpload"
                    :http-request="handleUploadRequest"
                    :show-file-list="false"
                    accept="image/*"
                >
                <!-- :action=# --用来自定义上传以后图片在后端的保存位置以及上传前的校验（例如：校验文件类型、大小等） -->
                <!-- :before-upload="beforeUpload" --上传前的校验函数，返回true表示校验通过，返回false表示校验不通过 -->
                <!-- :http-request="handleUploadRequest" --上传请求的方法，用于自定义上传逻辑 -->
                <!-- :show-file-list="false" --是否显示上传文件列表，false表示不显示 -->
                <div v-if="!imgUrl" class="cover-placehoder">
                    <p>点击上传封面</p>
                </div>
                <img v-else :src="imgUrl" class="cover-image" alt="封面图片">
            </el-upload>
            <div v-if="imgUrl" class="cover-remove">
                <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
            </div>
            </div>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
            <RichTextEditor 
                v-model="formData.content" 
                placeholder="请输入文章内容，支持富文本格式\n\n可以使用加粗/斜体/列表/标题等格式来丰富文章内容"
                :maxCharCount="5000"
                @change="handleContentChange"
                @created="handleEditorCreated"
                min-height="400px"
                />
                 <!-- maxCharCount --最大字符数 -->
        </el-form-item>
    </el-form>
    <div v-if="btnPreview">
        <h3>内容预览</h3>
        <div v-html="formData.content"></div>
        <!-- v-html:接受一个html字符串，将它转化成真实的dom元素，挂载在指定的层级下 -->
    </div>
    <template #footer>
        <!-- 具名插槽footer：用于自定义弹窗的底部按钮 -->
        <el-button @click="btnPreview = !btnPreview">{{btnPreview ? '隐藏预览' : '预览效果'}}</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">{{isEdit ? '更新文章' : '创建文章' }}</el-button>
        <!-- loading:用于在按钮点击后显示加载状态，防止重复提交 -->
    </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile, createArticle, updateArticle } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'

const props = defineProps({
    modelValue:{
        type:Boolean,
        default:false
    },
    categories:{
        type:Array,
        default:()=> []
    },
    article:{
        type:Object,
        default:null
        // 在弹窗中床架一个字段，用来辨别是新增还是编辑
    }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
    get(){
        return props.modelValue
    },
    set(val){
        emit('update:modelValue', val)
    }
})

const isEdit = computed(() => !!props.article?.id)
//!!:一个！是取反，两个是将当前数据转成布尔类型

//监听编辑数据
watch(() => props.article, (newVal) => {
//第一个参数：传入一个函数，返回一个需要监听的数据；第二个参数:触发一个修改之后的数据
    if(newVal){
        nextTick(() => {
            Object.assign(formData, newVal)
            //formData是一个reactive 响应式的对象，整体赋值会丢失响应式
            // 因此这边使用Object.assign方法接收多个参数，从第二个参数开始，将后面的参数即对象的属性 注入到第一个参数中 =》也就是进行对象属性的合并

            //使用现有id
            businessId.value = newVal.id
            //封面URL
            imgUrl.value = fileBaseUrl + newVal.coverImage
        })

    }
})

const handleClose = () =>{
    //重置表单
    formRef.value.resetFields()
    //重置id ==重置操作都要给它重置成为初值
    formData.value = null
    //重置标签
    formData.tagArray = []
    //重置封面和数据
    handleRemove()
    emit('update:modelValue', false)
    // dialogVisible.value = false
}

//表单数据
const formData = reactive({
    "title" : "",
    "content" : "",
    "coverImage" : "",
    "categoryId" : 1,
    "summary" : "",
    "tags" : "",
    "id" : "",
    "tagArray" : []
})

const rules = reactive({
    title : [
        {required:true, message:'请输入文章标题', trigger:'blur'},
        {max:200, message:'文章标题最多30个字符', trigger:'blur'}
    ],
    categoryId : [
        {required:true, message:'请选择所属分类', trigger:'change'}
    ],
    content:[
        {required:true, message:'请输入文章内容', trigger:'blur'},
        {max:5000, message:'文章内容最多5000个字符', trigger:'blur'}
    ]
})

const commonTags = [
    '情绪管理', '焦虑', '抑郁', '压力', '睡眠',
    '冥想', '正念', '放松', '心理健康', '自我成长', 
    '人际关系', '工作压力', '学习方法', '生活技巧'
]

//上传
const imgUrl = ref('')
const beforeUpload = (file) =>{
    //针对上传的文件进行校验
    console.log(file)
    const isImage = file.type.startsWith('image/')
    const isLt5MB = file.size / 1024 / 1024 < 5
    //校验图片大小不能小于5MB  后面时进行单位转换 从字节-》KB-》MB
    if(!isImage){
        ElMessage.error('上传封面图片，请选择图片文件')
        return false
    }
    if(!isLt5MB){
        ElMessage.error('上传封面图片大小不能大于5MB')
        return false
    }
    return true
}


//上传请求
const businessId = ref(null)
const handleUploadRequest = async ({file}) =>{
    //唯一标识符UUID生成
    businessId.value = crypto.randomUUID()
    //crypto:专门用来加密的对象，可以用来生成随机数
    const fileRes = await uploadFile(file, {
        businessId : businessId.value
    })
    console.log(fileRes)

    //拼接完整的图片地址 前端图片存储地址与后端返回的图片路径拼接
    imgUrl.value = fileBaseUrl + fileRes.filePath
    // = imgUrl.value = `${fileBaseUrl}${fileRes.filePath}`
    formData.coverImage = fileRes.filePath
    // formData中coverImage是我们传给后端的地址，因此这边的值应该是后端返回的地址
}
const handleRemove = () =>{
    imgUrl.value = ''
    formData.coverImage = ''
    //清空图片数据以及提交到formData中的数据
}

//富文本
const handleContentChange = (data) =>{
    formData.content = data.html
}

//创建之后需要做的事情
const editorInstance = ref(null)
const handleEditorCreated = (editor) =>{
    editorInstance.value = editor
    //进行编辑
    if(formData.content && editor){
        //当存储富文本的实例存在并且编辑器editor正常创建的情况下：将内容填充到编辑器中
        // 由于富文本editor的创建是异步的，需要确保editor创建之后再进行调用<--使用nextTick方法
        nextTick(() => {
            editor.setHtml(formData.content)
        })
    }
}

const btnPreview = ref(false)

//提交表单
const formRef = ref()   
const loading = ref(false)
const handleSubmit = () =>{
    //通过调用validate方法进行校验
    formRef.value.validate((valid, fields) =>{
        //两个参数分别是校验的状态， 以及表单元素
        if(valid){
            loading.value = true
        }
        console.log(formData, 'formData')
        const submitData = {
            ...formData,
            //先将formData解构出来
            tags : formData.tagArray.join(',')
            //将tags转换为数组，再添加到submitData中  这两步骤是对象属性的合并
        }
        delete submitData.tagArray

        if(!isEdit.value){
            submitData.id = businessId.value
            createArticle(submitData).then(res =>{
                loading.value = false
                emit('success')
            })
        } else{
            updateArticle(props.article.id, submitData).then(res =>{
                loading.value = false
                emit('success')
            })
        }
    })
}
</script>

<style scoped lang="scss">
.cover-placehoder{
    width: 200px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #8b949e;
    background: #f6f8fa;
}
.cover-image{
    width: 200px;
    height: 120px;
    display: block;
}
</style>