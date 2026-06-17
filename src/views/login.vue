<template>
    <div class="container">
        <div class="title">
            <div class="back-home">
                <el-icon><Back/></el-icon>
                <span>返回首页</span>
            </div>
            <div class="title-text">
                <h2>登录您的账户</h2>
                <p>请输入您的登录信息</p>
            </div>
        </div>
        <div class="form-container">
            <el-form 
            ref="ruleFormRef"
            :model="formData"
            :rules="rules"  
            label-position="top"
            >
                <el-form-item label="用户名或邮箱" prop="username">
                    <el-input v-model="formData.username" size="large" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password></el-input>
                </el-form-item>
                <el-button class="btn" size="large" type="primary" @click="submitForm(ruleFormRef)">
                    登录账户
                </el-button>
                <div class="footer">
                    <p>
                        还没有账户？<router-link to="/register">去注册</router-link>
                    </p>

                </div>
            </el-form>

        </div>
    </div>
</template>
<script setup>
import{ref,reactive} from 'vue'
import {login} from '../api/admin'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const ruleFormRef = ref()
const formData = reactive({
    username:'',
    password:''
})
const rules = reactive({
    username:[
        {required:true,message:'请输入用户名',trigger:'blur'}
    ],
    password:[
        {required:true,message:'请输入密码',trigger:'blur'}
    ]
})

//登录
const submitForm = async(formEl) => {
    await formEl.validate((valid,fields) => {
        if (valid) {
            console.log('formData',formData)
            login(formData).then(data => {
                //判断token是否存在
                if(!data.token){
                    ElMessage.error('登录失败，请重试')
                    return
                }
                //登陆成功，保存token和用户信息
                localStorage.setItem('token',data.token)
                localStorage.setItem('userInfo',JSON.stringify(data.userInfo))
                //根据用户角色跳转到不同的页面
                if(data.userInfo.userType === 2){
                   router.push('/back/dashboard')
                } else {
                    router.push('/')
               
            }

        })
        }
    })
}
</script>
<style lang="scss" scoped>
.container {
    width: 384px;
    .title{
        .back-home{
            margin-bottom: 60px;
        }
        .title-text{
            text-align: center;
            h2{
                font-size: 36px;
                margin-bottom: 10px;
            }
            p{
                font-size: 18px;
                color: #6b7280;
            }
        }
    }
    .form-container{
        margin-top: 30px;
        .btn{
            width: 100%;
            margin-top: 40px;
        }
        .footer{
            padding: 30px;
            text-align: center;
        }
        
    }
}
</style>