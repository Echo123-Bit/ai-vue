import axios from 'axios';
import { ElMessage } from 'element-plus';
const request = axios.create({
    baseURL: '/api', // 请求前缀
    timeout: 5000, // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(config => {
    // 在请求发送之前可以添加一些公共的请求头或者参数
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['token'] = token;
    }
    return config;
}, error => {
    // 请求错误处理
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(response => {
    // 在响应数据返回之前可以进行一些处理
    const { data, config } = response;
    //处理业务状态码
    if (data.code === 200) {
        return data.data; // 直接返回业务数据
    } else {
        if (data.code == -1) {
            // 处理错误情况
            if (!config.url.includes('/login')) {
                ElMessage.error('登录状态已过期，请重新登录');

                //清楚登录信息
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                window.location.href = '/auth/login';
            }
            else {
                ElMessage.error(data.message || '登录失败');
                return Promise.reject('网络请求失败....');
            }
        }

    } return data.data; // 直接返回响应数据
},
    error => {
        // 响应错误处理
        return Promise.reject(error);
    });

export default request;