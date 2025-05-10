<template>
  <BasePage>
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
  </BasePage>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
// import {
//   ElMessage
// } from 'element-plus'
import BasePage from '@/components/layout/BasePage.vue'
import Swal from 'sweetalert2'
import request from '@/utils/request'


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
    Swal.fire({
      icon: 'warning',
      title: '部门名称不能为空',
      text: '请输入部门名称！'
    })
    return
  }

  if (dialogTitle.value === '新增部门') {
    request.post('/depts', {
      name: dialogForm.name.trim(),
    }).then((res) => {
      if(res.msg === '部门已存在') {
        Swal.fire({
          icon: 'error',
          title: '部门已存在',
          text: '请检查部门名称是否重复！'
        })
        return
      }
      console.log(res, 'res');
      fetchData()
    })
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
      fetchData()

    })
  }

  dialogVisible.value = false
  Swal.fire({
    icon: 'success',
    title: '提交成功',
    text: '部门信息已更新！'
  })
}

// Swal.fire({
//   title: `确定删除部门「${row.name}」吗？`,
//   text: "删除后将无法恢复！",
//   icon: 'warning',
//   showCancelButton: true,
//   confirmButtonColor: '#3085d6',
//   cancelButtonColor: '#d33',
//   confirmButtonText: '确定',
//   cancelButtonText: '取消'
// }).then((result) => {
//   if (result.isConfirmed) {
//     tableData.value = tableData.value.filter(item => item !== row)
//     Swal.fire(
//       '删除成功！',
//       `部门「${row.name}」已被删除。`,
//       'success'
//     )
//   } else {
//     Swal.fire(
//       '已取消',
//       '部门未被删除。',
//       'info'
//     )
//   }

// 删除操作
const onDelete = (row: Department) => {

  Swal.fire({
    title: `确定删除部门「${row.name}」吗？`,
    text: "删除后将无法恢复！",
    icon: 'warning',
    showCancelButton: true,
    heightAuto: false,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then((result) => {
    if (result.isConfirmed) {
      // 调用删除接口
      request.delete(`/depts/${row.id}`).then((res) => {
        console.log(res);
        // 从 tableData 中移除已删除的项
        tableData.value = tableData.value.filter(item => item.id !== row.id);
        Swal.fire(
          '删除成功！',
          `部门「${row.name}」已被删除。`,
          'success'
        );
      }).catch((err) => {
        console.error(err);
        Swal.fire(
          '删除失败！',
          '请稍后重试。',
          'error'
        );
      });
    } else {
      Swal.fire(
        '已取消',
        '部门未被删除。',
        'info'
      );
    }
  });
}

onMounted(fetchData)
</script>


<style scoped>
body.swal2-height-auto {
  height: auto !important;
  overflow: auto !important;
}
</style>
