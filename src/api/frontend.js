import request from '../utils/request'

export function register(data) {
    return request({
        url: '/user/add',
        method: 'post',
        data
    })
}

export function startSession(data) {
    return request({
        url: '/psychological-chat/session/start',
        method: 'post',
        data
    })
}

export function getSessionList(params) {
    return request({
        url: '/psychological-chat/sessions',
        method: 'get',
        params
    })
}

export function deleteSession(sessionId) {
    return request({
        url: `/psychological-chat/sessions/${sessionId}`,
        method: 'delete'
    })
}

export function getMessageList(sessionId) {
    return request({
        url: `/psychological-chat/sessions/${sessionId}/messages`,
        method: 'get'
    })
}

export function getSessionEmotion(sessionId) {
    return request({
        url: `/psychological-chat/session/${sessionId}/emotion`,
        method: 'get'
    })
}

export function submitMessage(data) {
    return request({
        url: `/emotion-diary`,
        method: 'post',
        data
    })
}

export function getKnowledgeList(params) {
    return request({
        url: `/knowledge/article/page`,
        method: 'get',
        params
    })
}

export function getArticleDetail(id) {
    return request({
        url: `/knowledge/article/${id}`,
        method: 'get'
    })
}
