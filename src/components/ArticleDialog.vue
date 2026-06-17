<template>
    <el-dialog
    v-model="dialogVisible" 
    :title="isEdit ? '编辑文章' : '新增文章'" 
    width="50%"
    @close="handleClose"
    >    
    <el-form :model="formData" :rules="rules" ref="formRef" label-position="120px">
        <el-form-item label="文章标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
            <el-select v-model="formData.categoryId" placeholder="请选择所属分类">
                <el-option
                    v-for="item in props.categoryList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="文章摘要" prop="summary">
            <el-input v-model="formData.summary" type="textarea" placeholder="请输入文章摘要(可选)" maxlength="1000" :rows="4" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
            <el-select v-model="formData.tagArray" placeholder="请输入文章标签(逗号分隔)" multiple filterable allow-create style="width: 100%;">
                <el-option
                    v-for="tag in commonTags"
                    :key="tag"
                    :label="tag"
                    :value="tag"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="封面图片">
           <div class="cover-upload">
                <el-upload
                    class="avatar-upload"
                    action="#"
                    :before-upload="beforeUpload"
                    :http-request="handleUploadRequest"
                    :show-file-list="false"
                    accept="image/*"                   
                >
                    <div v-if="!imageUrl" class="cover-placeholder">
                        <p>点击上传封面</p>

                    </div>
                    <img v-else :src="imageUrl" class="cover-image" alt="封面图片"/>
                </el-upload>
                <div v-if="imageUrl" class="cover-remove">
                    <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
                </div>
           </div>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
            <RichTextEditor 
                v-model="formData.content"
                placeholder="请输入文章内容，支持富文本格式\n\n可以使用加粗、斜体、列表等格式来丰富文章内容。"
                :maxCharCount="5000"
                @change="handleContentChange"
                @created="handleEditorCreated"
                min-height="400px"
            >
            </RichTextEditor>

        </el-form-item>
    </el-form>
    <div v-if="btnPreview">
            <h3>预览效果：</h3>
        <div v-html="formData.content" class="preview-content"></div>
    </div>
    <template #footer>
        <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
        <el-button @click="handleClose">取消</el-button>
         <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '更新文章' : '创建文章' }}</el-button>
    </template>    
    </el-dialog>
</template>
<script setup>

import { ref ,reactive,computed,nextTick,watch} from 'vue';
import { ElMessage } from 'element-plus';
import { uploadFile , createArticle , updateArticle } from '../api/admin';
import { fileBaseUrl } from '../config/index';
import RichTextEditor from '../components/RichTextEditor.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categoryList: {
        type: Array,
        default: () => []
    },
    article: {
        type: Object,
        default: null
    }

})

const emit = defineEmits(['update:modelValue', 'success']);
const dialogVisible = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }

});

//表单数据
const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": "",
    "id": ""
}) 

const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择所属分类', trigger: 'change' }
    ],
    summary: [
        { max: 1000, message: '文章摘要最多1000个字符', trigger: 'blur' }
    ],
    tags: [
        { max: 200, message: '文章标签最多200个字符', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' },
        { max: 5000, message: '文章内容最多5000个字符', trigger: 'blur' }
    ]
})

const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

//上传
const imageUrl = ref('');



//封面图片上传前的处理
const beforeUpload = (file) => {
    // 这里可以添加对文件的验证，例如类型和大小
    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isImage) {
        ElMessage.error('上传封面图片，请选择图片文件');
        return false;
    }
    if (!isLt5M) {
        ElMessage.error('上传封面图片，图片大小不能超过 5MB');
        return false;
    }
    return true; // 验证通过，允许上传
}

const businessId = ref(''); // 用于关联文件的业务ID，可以是文章ID或者UUID
const handleUploadRequest =async ({file}) => {
    //UUID生成
    businessId.value = crypto.randomUUID();
    const fileRes = await uploadFile(file,{
        businessId:businessId.value
    })
    console.log(fileRes, '上传结果')

    //拼接完整的图片地址
    imageUrl.value = fileBaseUrl + fileRes.filePath
    formData.coverImage = fileRes.filePath; // 将文件路径保存到表单
}

//移除封面图片
const handleRemove = () => {
    imageUrl.value = '';
    formData.coverImage = '';
}

//富文本，内容变化时的处理
const handleContentChange = (data) => {
    formData.content = data.html; // 将富文本内容保存到表单
}

//富文本，编辑器创建时的处理
const editorInstance = ref(null);
const handleEditorCreated = (editor) => {
    editorInstance.value = editor;
    if (formData.content && editor) {
        nextTick(() => {
            editor.setHtml(formData.content); // 设置编辑器内容
        });
    }
}

//按钮预览
const btnPreview = ref(false);

//提交
const formRef = ref(null);
const loading = ref(false);
const handleSubmit = () => {
    formRef.value.validate((valid, fields) => {
        if (valid) {
            loading.value = true;
        }
        console.log(formData, '提交的表单数据');
        const submitData = {
            ...formData,
            tags: formData.tagArray.join(',') // 将标签数组转换为逗号分隔的字符串
        };
        delete submitData.tagArray; // 删除临时的标签数组字段

        if (!isEdit.value) {
            //新增
            submitData.id = businessId.value; // 使用生成的UUID作为文章ID
            createArticle(submitData).then(res => {
                loading.value = false;
                ElMessage.success('文章创建成功');
                emit('success');
            });
        }
        else {
            //编辑
            updateArticle(props.article.id, submitData).then(res => {
                loading.value = false;
                ElMessage.success('文章更新成功');
                emit('success');
            }).catch(err => {
                console.error('更新文章失败', err);
                ElMessage.error('文章更新失败，请稍后再试');
            }).finally(() => {
                loading.value = false;
            });
            return;
        }
    }
)}

//判断是新增还是编辑
const isEdit = computed(() =>!!props.article?.id)

//监听编辑数据
watch(() => props.article, (newVal) => {    
    if (newVal) {
        nextTick(() => {
            //如果有文章数据，说明是编辑，将数据赋值到表单
        Object.assign(formData, newVal);
        //使用现有的ID
        businessId.value = newVal.id;
        //封面图片设置地址
        imageUrl.value = fileBaseUrl + newVal.coverImage
            
        });
        
    } else {
        businessId.value = '';
    }
}, { immediate: true });

//取消按钮
const handleClose = () => {
    // 重置表单
    formRef.value.resetFields(); 
    //重置ID
    businessId.value = null;
    //重置标签
    formData.tagArray = [];
    //重置封面图片和数据
    handleRemove();
     // 关闭对话框
    emit('update:modelValue', false);

}
</script>
<style lang="scss" scoped>
.cover-placeholder {
    width: 200px;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #8b949e;
    background: #f6f8fa;
}
.cover-image {
    width: 200px;
    height: 120px;
    display: block;
}
</style>