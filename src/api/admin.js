import request from '../utils/request'

// 获取管理员列表
export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}


// 获取分类树
export function categoryTree() {
    return request({
        url: '/knowledge/category/tree',
        method: 'get',
    })
}

// 获取知识列表
export function articlePage(params) {
    return request({
        url: '/knowledge/article/page',
        method: 'get',
        params
    })
}

export function uploadFile(file, businessInfo) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('businessType', "ARTICLE");
    formData.append('businessId', businessInfo.businessId);
    formData.append('businessField', "cover");
    return request({
        url: '/file/upload',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function createArticle(data) {
    return request({
        url: '/knowledge/article',
        method: 'post',
        data
    })
}

export function getArticleDetail(id) {
    return request({
        url: `/knowledge/article/${id}`,
        method: 'get'
    })
}

export function updateArticle(id, data) {
    return request({
        url: `/knowledge/article/${id}`,
        method: 'put',
        data
    })
}

export function changeArticleStatus(id, data) {
    return request({
        url: `/knowledge/article/${id}/status`,
        method: 'put',
        data
    })
}

export function deleteArticle(id) {
    return request({
        url: `/knowledge/article/${id}`,
        method: 'delete'
    })
}

export function getConsultationPage(params) {
    return request({
        url: '/psychological-chat/sessions',
        method: 'get',
        params
    })
}

export function getSessionDetail(sessionId) {
    return request({
        url: `/psychological-chat/sessions/${sessionId}/messages`,
        method: 'get'
    })
}

export function getEmotionPage(params) {
    return request({
        url: `/emotion-diary/admin/page`,
        method: 'get',
        params
    })
}

export function deleteEmotional(id) {
    return request({
        url: `/emotion-diary/admin/${id}`,
        method: 'delete'
    })
}

export function getAnalyticsOverview() {
    return request({
        url: '/data-analytics/overview',
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}