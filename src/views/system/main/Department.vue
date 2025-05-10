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
            <el-button size="small" type="primary" link @click="openDialog('edit', scope.row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="onDelete(scope.row)">删除</el-button>
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
// import Swal from 'sweetalert2'
import request from '@/utils/request'
import Noty from 'noty'
import 'noty/lib/noty.css'


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


const handleDialogSubmit = () => {
  const now = new Date().toLocaleString();
  if (!dialogForm.name.trim()) {
    new Noty({
      type: 'warning',
      layout: 'center',
      modal: true,
      timeout: 1000, // 显示 1 秒后自动关闭
      text: '部门名称不能为空，请输入部门名称！'
    }).show();
    return;
  }

  if (dialogTitle.value === '新增部门') {
    request.post('/depts', {
      name: dialogForm.name
    }).then((res) => {
      console.log(res, 'res');
      fetchData();
    });
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
      fetchData();
    });
  }

  dialogVisible.value = false;
  new Noty({
    type: 'success',
    layout: 'center',
    modal: true,
    timeout: 1000, // 显示 1 秒后自动关闭
    text: '提交成功，部门信息已更新！'
  }).show();
};

const onDelete = (row) => {
  const notyConfirm = new Noty({
    type: 'warning',
    layout: 'center',
    modal: true,
    text: `确定删除部门「${row.name}」吗？删除后将无法恢复！`,
    closeWith: ['button', 'click'],
    buttons: [
      Noty.button('确定', 'btn btn-primary', () => {
        request.delete(`/depts/${row.id}`).then((res) => {
          console.log(res);
          // 从 tableData 中移除已删除的项
          tableData.value = tableData.value.filter(item => item.id !== row.id);
          new Noty({
            type: 'success',
            layout: 'center',
            modal: true,
            timeout: 1000, // 显示 1 秒后自动关闭
            text: `删除成功！部门「${row.name}」已被删除。`
          }).show();
        }).catch((err) => {
          console.error(err);
          new Noty({
            type: 'error',
            layout: 'center',
            modal: true,
            timeout: 1000, // 显示 1 秒后自动关闭
            text: '删除失败！请稍后重试。'
          }).show();
        });
        notyConfirm.close();
      }),
      Noty.button('取消', 'btn btn-danger', () => {
        new Noty({
          type: 'info',
          layout: 'center',
          modal: true,
          timeout: 1000, // 显示 1 秒后自动关闭
          text: '已取消：部门未被删除。'
        }).show();
        notyConfirm.close();
      })
    ]
  }).show();
};


onMounted(fetchData)
</script>


<style scoped>
/* body.swal2-height-auto {
  height: auto !important;
  overflow: auto !important;
} */
</style>
