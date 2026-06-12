<template>
    <div>
        <PageHead title="知识文章">
            <template #buttons>
                <!-- #为v-slot:buttons -简写 -->
                <el-button type="primary" @click="handleEdit({})">
                    新增
                </el-button>
            </template>
        </PageHead>

        <TableSearch :formItem="formItem" @search="handleSearch" />
        <el-table :data="tableData" style="width: 100%;margin-top:25px">
            <el-table-column label="文章标题" fixed="left">
                <!-- fixed：设置在某一个位置固定显示 -->
                <template #default="scope">
                    <div style="display: flex; align-items: center;">
                        <el-icon> <timer /></el-icon>
                        <span>{{ scope.row.title }}</span>
                        <!-- scope是随便定义的名字，接收的是由子组件传递过来的数据 -->
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="分类" width="200">
                <template #default="scope">
                    <div style="display: flex; align-items: center;">
                        <el-icon> <timer /></el-icon>
                        <span>{{ categoryMap[scope.row.categoryId]}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="authorName" label="作者" width="150" />
            <el-table-column prop="readCount" label="阅读量" width="150" />
            <el-table-column prop="updatedAt" label="发布时间" width="150" />
            <el-table-column label="操作" width="240" fixed="right">
                <template #default="scope">
                    <!-- text：文本按钮  type：按钮的类型(这边直接的体现就是按钮的颜色) -->
                    <el-button @click="handleEdit(scope.row)" text type="primary">编辑</el-button>
                    <!-- 把当前行数据作为参数进行编辑 -->
                    <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 || scope.row.status === 2" text type="success">发布</el-button>
                    <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status === 1" text type="warning">下线</el-button>
                    <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 25px;"
            :total="pagination.total"
            :page-size="pagination.size"
            layout="prev, pager, next"
            @change="handleChange"
        />
        <!-- layout：分页器的布局(如可以使用下一页、上一页、跳转到指定页码的按钮)，total：总条数，size：每页条数，current-page：当前页码 -->
        <ArticleDialog v-model:modelValue="dialogVisible" :article="currentArticle" :categories="categories" @success="handleSuccess" />
         <!-- v-model是一个简写，是v-bind:modelValue和v-on:update:modelValue的组合，用于在子组件中使用v-model绑定一个属性 -->
        <!-- 使用自定义属性modelValue隐式地向子组件传递一个v-on事件，事件名是update:modelValue，事件参数是visible的值 -->
    </div>
</template>

<script setup>
import { ref, onMounted , reactive} from 'vue'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { categoryTree, articlePage, getArticleDetail, changeArticleStatus, deleteArticle } from '@/api/admin'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const emit = defineEmits(['search'])

const formItem = [
    {comp:'input', prop:'title', label:'文章标题', placeholder:'请输入文章标题'},
    //comp：组件类型  prop：绑定的属性  label：组件的标签（也就是输入框前面的提示）  placeholder：输入框的占位符（也就是输入框中显示的提示）
    {comp:'select', prop:'categoryId', label:'分类',placeholder:'请选择分类'},
    {comp:'select', prop:'status', label:'状态',placeholder:'请选择状态', options:[{
        label:'草稿',
        value:'0'
    },{
        label:'已发布',
        value:'1'
    },{
        label:'下线',
        value:'2'
    }
]}
]

//分页参数
const pagination =reactive({
    currentPage:1,
    size:10,
    total:0
})

const handleSearch = async(formData) =>{
    //此方法相当于一个回调函数，在组件内部调用，拿到form表单中输入的数据
    console.log(formData, '查询参数')

    const params = {
        ...pagination,
        ...formData
        //...:扩展运算符，将pagination和formData进行合并
    }

    const {records, total} = await articlePage(params)
    tableData.value = records
    //由于调用接口赋值的时候是通过.value的方式，因此在定义的时候不使用reactive的方式（reactive的方式定义的是一个对象，赋值的时候是通过点的方式整体赋值），而使用ref的方式
    pagination.total = total
    
    // 触发事件，将formData表单数据传递给父组件
    // emit('search', formData)
}

//分页器的change事件
const handleChange = (page) =>{
    pagination.currentPage = page
    handleSearch()
}


//分类映射
const categoryMap = reactive({})
//区分什么时候用reactive，什么时候用ref
//reactive：用于响应式数据的定义，ref：用于响应式数据的定义，但是只能定义一个值

// 分类列表
const categories = ref([])

//列表数据
const tableData = ref([])

//新增和编辑
const dialogVisible = ref(false)
const handleSuccess = () => {
    dialogVisible.value = false
    //取消弹窗后👆，需要刷新列表👇
    handleSearch()
}
const currentArticle = ref(null)
// 进行父传子，在子组件中创建一个属性currentArticle，用于接收父组件传递过来的文章详情
const handleEdit = (row) =>{
    console.log(row, '编辑参数')
    if(!row.id){
        //新增文章
        currentArticle.value = null
        //重置数据
        dialogVisible.value = true
        //将弹窗显示出来
    }else{
        //编辑文章
        getArticleDetail(row.id).then(res =>{
            console.log(res, '编辑详情')
            currentArticle.value = res
            //由于res是对象，因此可以直接赋值给currentArticle.value
            dialogVisible.value = true
            //将弹窗显示出来
        })
    }
}

//发布
const handlePublish = (row) =>{
    ElMessageBox.confirm(
        //进行二次确认
        `确认发布文章${row.title}吗？`,
        //标题
        `确认`,
        //按钮的一些配置项
        {
            confirmButtonText:'确认发布',
            cancelButtonText:'取消',
            type:'info'
        }
        //用户点击确认以后进入then方法
    ).then(() =>{
        changeArticleStatus(row.id, { status: 1}).then(res =>{
            ElMessage.success('发布成功')
            handleSearch()
        })
    })
}

const handleUnpublish = (row) =>{
    ElMessageBox.confirm(
        `确认下线文章${row.title}吗？`
        ,
        `确认`
        ,
        {
            confirmButtonText:'确认下线',
            cancelButtonText:'取消',
            type:'warning'
        }
    ).then(() =>{
        changeArticleStatus(row.id, { status: 2}).then(res =>{
            ElMessage.success('下线成功')
            handleSearch()
        })
    })
}

const handleDelete = (row) =>{
    ElMessageBox.confirm(
        `确认删除文章${row.title}吗？`,
        '确认',
        {
            confirmButtonText: '确认删除',
            cancelButtonText: '取消',
            type: 'danger'
        }
    ).then(() =>{
        deleteArticle(row.id).then(res =>{
            ElMessage.success('删除成功')
            handleSearch()
        })
    })
}

onMounted (async() => {
    const data = await categoryTree()
    
    categories.value = data.map(item =>{
        categoryMap[item.id] = item.categoryName
        //把当前的id作为对象的key，item.categoryName作为对象的名字，后期调用列表的时候可以直接使用这边映射好的数据
        return {
            label:item.categoryName,
            value:item.id
        }
    })
    formItem[1].options = categories.value

    //获取列表
    handleSearch()
})
</script>
