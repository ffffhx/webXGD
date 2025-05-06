<template>
  <BasePage>
    <div>
      <!-- 新增部门按钮 -->
      <el-button type="primary" @click="openDialog('add')">新增部门</el-button>

      <!-- 部门表格 -->
      <el-table :data="tableData" border style="width: 100%; margin-top: 20px;">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="部门名称" />
        <el-table-column prop="updateTime" label="最后操作时间" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="small" type="primary" text @click="openDialog('edit', scope.row)">编辑</el-button>
            <el-button size="small" type="danger" text @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑弹窗 -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
        <el-form :model="dialogForm" label-width="100px">
          <el-form-item label="部门名称" required>
            <el-input v-model="dialogForm.name" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDialogSubmit">确认</el-button>
        </template>
      </el-dialog>
    </div>
  </BasePage>

</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import BasePage from '@/components/layout/BasePage.vue'

// 表格数据结构
interface Department {
  name: string
  updateTime: string
}

// 表格状态
const tableData = ref<Department[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')

// 弹窗表单
const dialogForm = reactive<Department>({
  name: '',
  updateTime: ''
})

// 初始化数据
const fetchData = () => {
  tableData.value = [
    { name: '人事部', updateTime: '2025-05-01 10:00' },
    { name: '教务部', updateTime: '2025-05-01 11:00' }
  ]
}

// 打开新增或编辑弹窗
const openDialog = (type: 'add' | 'edit', row?: Department) => {
  dialogTitle.value = type === 'add' ? '新增部门' : '编辑部门'
  if (type === 'edit' && row) {
    Object.assign(dialogForm, { ...row })
  } else {
    Object.assign(dialogForm, { name: '', updateTime: '' })
  }
  dialogVisible.value = true
}

// 提交新增/编辑表单
const handleDialogSubmit = () => {
  const now = new Date().toLocaleString()
  if (!dialogForm.name.trim()) {
    ElMessage.warning('部门名称不能为空')
    return
  }

  if (dialogTitle.value === '新增部门') {
    tableData.value.unshift({ name: dialogForm.name, updateTime: now })
  } else {
    const index = tableData.value.findIndex(item => item.name === dialogForm.name)
    if (index !== -1) {
      tableData.value[index].updateTime = now
    }
  }

  dialogVisible.value = false
  ElMessage.success('操作成功')
}

// 删除操作
const onDelete = (row: Department) => {
  ElMessageBox.confirm(`确定删除部门「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      tableData.value = tableData.value.filter(item => item !== row)
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

onMounted(fetchData)
</script>
