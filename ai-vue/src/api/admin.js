import service from '@/utils/request'

export function login(data){
    return service.post('/user/login', data)
}

export function categoryTree(){
    return service.get('/knowledge/category/tree')
}


//携带参数的请求，因为使用的是axios，对于query的参数，必须在params中传递
export function articlePage(params){
    return service.get('/knowledge/article/page', {params})
    // {params:params} 简写为 {params}  因为params是一个对象，所以可以省略params
}

export function uploadFile(file, businessInfo){
    // 方法中需要接收文件还有当前文件相关参数
    const formData = new FormData()
    //创建一个FormData对象，用来存储文件和参数
    formData.append('file', file)
    //两个参数：当前文件的标签&内容
    formData.append('businessType', 'ARTICLE')
    //由后端要求传入的参数，本项目中是一个写死的字符串
    formData.append('businessId', businessInfo.businessId)
    formData.append('businessField', 'cover')

    return service.post('/file/upload', formData, {
        headers:{
            'Content-Type': 'multipart/form-data'
            //将请求头设置成form-data类型
            // 上传文件时，必须设置Content-Type为multipart/form-data
            // 否则会报错，提示Content-Type错误
        }
    })

}

export function createArticle(data){
    return service.post('/knowledge/article', data)
}


export function getArticleDetail(id){
    return service.get(`/knowledge/article/${id}`)
}


export function updateArticle(id, data){
    return service.put(`/knowledge/article/${id}`, data)
}


export function changeArticleStatus(id, data){
    return service.put(`/knowledge/article/${id}/status`, data)
}

export function deleteArticle(id){
    return service.delete(`/knowledge/article/${id}`)
}

export function getConsultationPage(params){
    return service.get('/psychological-chat/sessions', { params })
}

export function getSessionDetail(sessionId){
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getEmotionalPage(params){
    return service.get('/emotion-diary/admin/page', { params })
}

export function deleteEmotional(id){
    return service.delete(`/emotion-diary/admin/${id}`)
}

export function getAnalyticsOverview(){
    return service.get(`/data-analytics/overview`)
}

export function logout(){
    return service.post('/user/logout')
}