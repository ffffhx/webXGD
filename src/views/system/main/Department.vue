<template>
  <div>
    <!-- 新增部门按钮 -->
    <el-button type="primary" plain @click="openDialog('add')">新增部门</el-button>

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
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
<<<<<<<< <Temporary merge branch 1
import BasePage from '@/components/layout/BasePage.vue'
=========
import request from '@/utils/request'
import { id } from 'element-plus/es/locales.mjs'
>>>>>>>>> Temporary merge branch 2

// 表格数据结构
interface Department {
  name: string
  updateTime: string
  id?: number
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

<<<<<<<<< Temporary merge branch 1
// 初始化数据
const fetchData = () => {
  request.get('/depts').then(res => {
    console.log(res.data, 'res.data');
    // 对数组的每一项都执行后面那个回调函数
    const filtered = res.data.map((item: any) => {
      return {
        name: item.name,
        updateTime: item.updateTime,
        id: item.id
      }
    })
    console.log(filtered, 'fitered');
    tableData.value = filtered
  })
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
  Swal.fire({
    title: `确定删除部门「${row.name}」吗？`,
    text: "删除后将无法恢复！",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then((result) => {
    if (result.isConfirmed) {
      request.delete(`/depts/${row.id}`).then((res) => {
        console.log(res);
      })
      // tableData.value = tableData.value.filter(item => item !== row)
      Swal.fire(
        '删除成功！',
        `部门「${row.name}」已被删除。`,
        'success'
      )
    } else {
      Swal.fire(
        '已取消',
        '部门未被删除。',
        'info'
      )
    }
  })}
=========

// 初始化数据
const fetchData = () => {
  request.get('/depts').then(res => {
    console.log(res.data, 'res.data');
    // 对数组的每一项都执行后面那个回调函数
    const filtered = res.data.map((item: any) => {
      return {
        name: item.name,
        updateTime: item.updateTime,
        id: item.id
      }
    })
    console.log(filtered, 'fitered');
    tableData.value = filtered
  })

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
    request.post('/depts', {
      name: dialogForm.name
    }).then((res) => {
      console.log(res, 'res');
    })
    fetchData()
    // tableData.value.unshift({ name: dialogForm.name, updateTime: now })
    // 编辑部门
  } else {
    // const index = tableData.value.findIndex(item => item.name === dialogForm.name)
    // // 如果找到了
    // if (index !== -1) {
    //   tableData.value[index].updateTime = now
    // }
    request.put('/depts', {
      id: dialogForm.id,
      name: dialogForm.name
    }).then((res) => {
      console.log(res, 'res');

    })
  }

  dialogVisible.value = false
  ElMessage.success('操作成功')
}

// 删除操作
// const onDelete = (row: Department) => {
//   ElMessageBox.confirm(`确定删除部门「${row.name}」吗？`, '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning'
//   })
//     .then(() => {
//       // tableData.value = tableData.value.filter(item => item !== row)
//       console.log(row.id, 'row.id');


//       ElMessage.success('删除成功')
//     })
>>>>>>>>> Temporary merge branch 2
    // .catch(() => {
    //   ElMessage.info('已取消删除')
    // })
// }

onMounted(fetchData)
</script>
