<template>
    <div class="container">
        <div class="title">
            <div class="title-text">
                <h2>创建您的账户</h2>
                <p>请填写注册信息</p>
            </div>
        </div>
        <div class="form-container">
            <el-form :model="formData" :rules="rules" ref="submitFormRef" label-position="top" class="register-form">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="formData.username" placeholder="请输入用户名或邮箱" size="large"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" placeholder="请输入邮箱" size="large"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="formData.nickname" placeholder="请输入昵称（可选）" size="large"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="formData.phone" placeholder="请输入手机号（可选）" size="large"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" type="password" placeholder="请输入密码" size="large" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="formData.confirmPassword" type="password" placeholder="请再次输入密码" size="large" show-password></el-input>
                </el-form-item>
                <el-button type="primary" class="btn" size="large" @click="submitForm(submitFormRef)">注册</el-button>
            </el-form>
            <div class="footer">
                已有账户？<a href="/login">立即登录</a>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { register } from '../api/frontend'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'

const formData = ref({
    "username": "",
    "email": "",
    "nickname": "",
    "phone": "",
    "password": "",
    "confirmPassword": "",
    "gender": 0,
    "userType": 1
})

// 表单验证规则
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度必须在 3-20 个字符之间', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度必须在 6-20 个字符之间', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        { validator: (rule, value, callback) => {
            if (value !== form.value.password) {
                callback(new Error('两次输入的密码不一致'))
            } else {
                callback()
            }
        }, trigger: 'blur' }
     ]
})

// 提交表单
const router = useRouter()
const submitFormRef = ref(null)
const submitForm = async (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        register(formData.value).then(({data}) => {
            console.log(data)
            if (!data) {
                ElMessage.success('注册成功')
                router.push('/auth/login')
            }
            if (data.code === "BUSINESS_ERROR") {
                ElMessage.error(data.message || '注册失败')
            }
        })   
    })
}
</script>

<style lang="scss" scoped>
.container {
    width: 384px;
    .flex-box {
        display: flex;
        align-items: center;
    }
    .title {
        .title-text {
            text-align: center;
            h2 {
                font-size: 36px;
                margin-bottom: 10px;
            }
            p {
                font-size: 18px;
                color: #6b7280;
            }
        }
    }
    .form-container {
        margin-top: 30px;
        .btn {
            margin-top: 40px;
            width: 100%;
        }
        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}
</style>