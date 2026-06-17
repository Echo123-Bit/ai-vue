<template>
    <div class="knowledge">
        <PageHead title="知识文章">
            <template #buttons>
                <el-button @click="handleEdit({})" type="primary">新增</el-button>
            </template>
        </PageHead>
        <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
        <el-table :data="tableData" style="width: 100%;margin-top: 25px;">
            <el-table-column label="文章标题" width="450" fixed="left">
                <template #default="scope">
                    <div style="display:flex;align-items: center">
                        <el-icon><timer /></el-icon>
                        <span>{{ scope.row.title }}</span>
                    </div>
                </template>                  
            </el-table-column>
            <el-table-column label="分类" width="200">
                <template #default="scope">
                    <div style="display:flex;align-items: center">
                        <el-icon><timer /></el-icon>
                        <span>{{ categoryMap[scope.row.categoryId] }}</span>
                    </div>
                </template>                  
            </el-table-column>
            <el-table-column prop="authorName" width="150" label="作者"></el-table-column>
            <el-table-column prop="readCount" width="150" label="阅读量"></el-table-column>
            <el-table-column prop="updatedAt" width="150" label="发布时间"></el-table-column>
            <el-table-column label="操作" width="240" fixed="right">
                <template #default="scope">
                    <el-button @click="handleEdit(scope.row)" text type="primary">编辑</el-button>
                    <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 ||scope.row.status=== 2" text type="success">发布</el-button>
                    <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status === 1" text type="warning">下线</el-button>
                    <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
                </template>                  
            </el-table-column>
        </el-table>
        <el-pagination
            :page-size="pagination.size"
            layout="total, prev, pager, next"
            :total="pagination.total"
            @change="handleChange"
            />
        <ArticleDialog v-model:modelValue="dialogVisible" :categoryList="categoryList" :article="currentArticle" @success="handleSuccess"></ArticleDialog>
    </div>
</template>
<script setup>
import { onMounted, ref, reactive} from 'vue';
import PageHead from '../components/PageHead.vue';
import TableSearch from '../components/TableSearch.vue';
import { categoryTree, articlePage, getArticleDetail ,changeArticleStatus, deleteArticle } from '../api/admin';
import ArticleDialog from '../components/ArticleDialog.vue';
import { ElMessageBox, ElMessage } from 'element-plus';
const formItem = [
    {
        label: '文章标题',
        prop: 'title',
        comp: 'input',
        placeholder: '请输入文章标题'
    },
    {
        label: '分类',
        prop: 'categoryId',
        comp: 'select',
        placeholder: '请选择分类',
        
    },
    {
        label: '状态',
        prop: 'status',
        comp: 'select',
        placeholder: '请输入文章内容',
        options: [
            { label: '草稿', value: 0 },
            { label: '已发布', value: 1 },
            { label: '已下线', value: 2 }
        ]
    }
]

//分页参数
const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})

const handleSearch = async(formData) => {
  console.log(formData, '查询参数');
    // 调用接口获取数据
    const params = {...pagination, ...formData};  
    const {records, total} = await articlePage(params)
    tableData.value = records;
    pagination.total = total;
}
const handleChange = (page) => {
    pagination.currentPage = page;
    handleSearch();
}

//分类映射
const categoryMap = reactive({}); 

//分类列表
const categoryList = ref([]);

//列表数据
const tableData = ref([]);

//新增和编辑
const dialogVisible = ref(false);
const currentArticle = ref(null); // 当前编辑的文章数据
const handleSuccess = () => {
    dialogVisible.value = false;
    handleSearch({});
}
//编辑
const handleEdit = (row) => {
    console.log('编辑文章', row);
    // 这里可以打开编辑对话框，并将选中的文章数据传递给对话框组件
    if(!row.id){
        //新增
        currentArticle.value = null; // 新增时，当前编辑的文章数据为空
        dialogVisible.value = true;
        
    }
    else{    
        //编辑
        getArticleDetail(row.id).then(res => {
        console.log('文章详情', res);
        currentArticle.value = res; // 将文章详情数据保存到当前编辑的文章数据中
        // 这里可以将文章详情数据传递给对话框组件，例如通过事件或props
        dialogVisible.value = true;
    }).catch(err => {
        console.error('获取文章详情失败', err);
        ElMessage.error('获取文章详情失败，请稍后再试');
    })
}

    }

//发布
const handlePublish = (row) => {
    console.log('发布文章', row);
    // 这里可以调用接口发布文章，并刷新列表数据
    ElMessageBox.confirm('确定要发布文章${row.title}吗？', '确认', {
        confirmButtonText: '确定发布',
        cancelButtonText: '取消',
        type: 'info',
    }).then(() => {
        changeArticleStatus(row.id, { status: 1 }).then(res => {
            ElMessage.success('文章发布成功');
            handleSearch();
        }).catch(err => {
            console.error('发布文章失败', err);
            ElMessage.error('文章发布失败，请稍后再试');
        })
})

}

//下线
const handleUnpublish = (row) => {
    console.log('下线文章', row);
    // 这里可以调用接口下线文章，并刷新列表数据
    ElMessageBox.confirm('确定要下线文章${row.title}吗？', '确认', {
        confirmButtonText: '确定下线',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        changeArticleStatus(row.id, { status: 2 }).then(res => {
            ElMessage.success('文章下线成功');
            handleSearch();
        }).catch(err => {
            console.error('下线文章失败', err);
            ElMessage.error('文章下线失败，请稍后再试');
        })
})
}

//删除
const handleDelete = (row) => {
    console.log('删除文章', row);
    // 这里可以调用接口删除文章，并刷新列表数据
    ElMessageBox.confirm(`确定要删除文章${row.title}吗？`, '确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'danger',
    }).then(() => {
        // 调用接口删除文章，例如 deleteArticle(row.id)
        // 删除成功后刷新列表数据，例如 handleSearch()
        deleteArticle(row.id).then(() => {
            ElMessage.success('文章删除成功');
            handleSearch();
        }).catch(err => {
            console.error('删除文章失败', err);
            ElMessage.error('文章删除失败，请稍后再试');
        });
    })
}


onMounted(async() => {
    const data = await categoryTree();
    categoryList.value = data.map(item=>{
        categoryMap[item.id] = item.categoryName;
        return {
            label: item.categoryName,
            value: item.id

        }
        
    })
    formItem[1].options = categoryList.value;
    
    handleSearch({});
})


</script>