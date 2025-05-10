<template>
  <BasePage>
    <!-- 查询条件 -->
    <el-form :model="form" inline>
      <el-form-item label="姓名">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="form.gender" placeholder="请选择" style="width: 80px;">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker v-model="form.createTime" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <div style="margin-bottom: 10px;">
      <el-button type="primary" plain @click="openDialog('add')">新增员工</el-button>
      <el-button type="danger" :disabled="!multipleSelection.length" plain @click="batchDelete">批量删除</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column label="图像" width="100">
        <template #default="{ row }">
          <el-image :src="row.image" style="width: 60px; height: 60px" v-if="row.image" />
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="job" label="职位" />
      <el-table-column prop="createTime" label="入职日期" />
      <el-table-column prop="updateTime" label="最后操作时间" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" size="small" text @click="openDialog('edit', row)">编辑</el-button>
          <el-button type="danger" size="small" text @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑员工弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="dialogForm" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dialogForm.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="dialogForm.gender" placeholder="请选择" width="80px">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="图像">
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="dialogForm.image" :src="dialogForm.image" class="avatar" />
            <el-icon v-else class="icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="dialogForm.job" />
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker v-model="dialogForm.createTime" type="date" />
        </el-form-item>
        <el-form-item label="归属部门">
          <el-input v-model="dialogForm.deptId" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </BasePage>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
// import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps } from 'element-plus'
import request from '@/utils/request'
import Swal from 'sweetalert2'
import BasePage from '@/components/layout/BasePage.vue'
import Noty from 'noty'
import 'noty/lib/noty.css'
const form = reactive({
  name: '',
  gender: '',
  createTime: [],

})

const tableData = ref<any[]>([])
const multipleSelection = ref<any[]>([])


const fetchData = () => {

  request.get('/emps', {
    params: {
      // page: 1,
      // pageSize: 10,
      name: form.name,
      gender: form.gender === '' ? '' : form.gender === '女' ? 1 : 2,
      begin: form.createTime[0],
      end: form.createTime[1]
      // a?? 1
    }
  }).then((res) => {
    console.log(res, 'res');
    res.data.rows && res.data.rows.forEach((item) => {
      item.gender === 1 ? item.gender = '女' : item.gender = '男'
    })
    tableData.value = res.data.rows

  })
}
const uploadAvatar = (rawFile: File) => {
  const formData = new FormData()
  formData.append('image', rawFile); // rawFile 应该是一个 File 对象
  request.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((res) => {
    console.log(res, 'res');
    dialogForm.image = res.data;
    console.log(dialogForm.image, 'dialogForm.image ');

  });
}

onMounted(fetchData)

const onSearch = () => {

  fetchData()

}

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

const batchDelete = () => {
  // Swal.fire({
  //   title: '确认删除选中的员工？',
  //   text: '删除后将无法恢复！',
  //   icon: 'warning',
  //   showCancelButton: true,
  //   confirmButtonColor: '#3085d6',
  //   cancelButtonColor: '#d33',
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消'
  // })
  alert ('确认删除选中的员工？').then((result) => {
    if (result.isConfirmed) {
      // 获取选中员工的 ID 列表
      const filtered = multipleSelection.value.map((item) => item.id);

      // 调用删除接口
      request.delete(`emps/${filtered}`).then((res) => {
        console.log(res, 'res');
        // 删除成功后刷新数据
        fetchData();
        // Swal.fire(
        //   '删除成功！',
        //   '选中的员工已被删除。',
        //   'success'
        // );
       new Noty({
          type: 'success',
          layout: 'center',
          modal: true,
          timeout: 3000, // 显示 3 秒后自动关闭
          text: '删除成功：选中的员工已被删除',
          closeWith: ['button'], // 只能点击按钮关闭
          buttons: [
            Noty.button('确定', 'btn btn-primary', () => {
              // 关闭提示
            })
          ]
        }).show();
      }).catch((err) => {
        console.error(err);
        // Swal.fire(
        //   '删除失败！',
        //   '请稍后重试。',
        //   'error'
        // );
        new Noty({
          type: 'error',
          layout: 'center',
          modal: true,
          timeout: 3000, // 显示 3 秒后自动关闭
          text: '删除失败：请稍后重试',
          closeWith: ['button'], // 只能点击按钮关闭
          buttons: [
            Noty.button('确定', 'btn btn-primary', () => {
              // 关闭提示
            })
          ]
        }).show();
      });
    } else {
      // Swal.fire(
      //   '已取消',
      //   '选中的员工未被删除。',
      //   'info'
      // );
      new Noty({
        type: 'info',
        layout: 'center',
        modal: true,
        timeout: 3000, // 显示 3 秒后自动关闭
        text: '已取消：选中的员工未被删除',
        closeWith: ['button'], // 只能点击按钮关闭
        buttons: [
          Noty.button('确定', 'btn btn-primary', () => {
            // 关闭提示
          })
        ]
      }).show();
    }
  });
};

// 弹窗逻辑
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const uploadUrl = 'https://mock-upload-url.com/upload'

const dialogForm = reactive<any>({
  username: '',
  name: '',
  gender: '',
  image: '',
  job: '',
  createTime: '',
  deptId: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
}

const openDialog = (type: 'add' | 'edit', row?: any) => {
  dialogTitle.value = type === 'add' ? '新增员工' : '编辑员工'
  // 编辑员工
  if (type === 'edit' && row) {
    Object.assign(dialogForm, row) //把row的全部复制到dialogForm中
  }
  // 新增员工
  else {
    Object.assign(dialogForm, {
      username: '',
      name: '',
      gender: '',
      image: '',
      job: '',
      createTime: '',
      updateTime: '',
      deptId: ''
    })
  }
  dialogVisible.value = true
}

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (dialogTitle.value === '新增员工') {
        // tableData.value.unshift({ ...dialogForm, updateTime: new Date().toLocaleString() })
        request.post('/emps', {
          username: dialogForm.username,
          name: dialogForm.name,
          gender: dialogForm.gender === '女' ? 1 : 2,
          id: dialogForm.id,
          password: dialogForm.password,
          image: dialogForm.image,
          job: dialogForm.job,
          entrydate: dialogForm.entrydate,
          deptId: dialogForm.deptId,
          createTime: dialogForm.createTime,
          updateTime: dialogForm.updateTime,
        }).then((res) => {
          fetchData()
          console.log(res, 'res');

        })

      } else {
        // 修改员工 编辑
        console.log(dialogForm, 'dialogForm');

        request.put('/emps', {
          id: dialogForm.id,
          username: dialogForm.username,
          name: dialogForm.name,
          gender: dialogForm.gender === '男' ? 1 : 2,
          image: dialogForm.image,
          job: dialogForm.job,
          createTime: dialogForm.createTime,
          updateTime: dialogForm.updateTime,
          deptId: dialogForm.deptId
        }).then((res) => {
          fetchData()
          console.log(res, 'res');

        })
        // const idx = tableData.value.findIndex(item => item.username === dialogForm.username)
        // if (idx !== -1) tableData.value[idx] = { ...dialogForm, updateTime: new Date().toLocaleString() }
      }
      dialogVisible.value = false
      // Swal.fire({
      //   title: '操作成功',
      //   text: '员工信息已保存',
      //   icon: 'success',
      //   confirmButtonText: '确定'
      // })
     new Noty({
        type: 'success',
        layout: 'center',
        modal: true,
        timeout: 1000, // 显示 1 秒后自动关闭
        text: '操作成功：员工信息已保存',
        closeWith: [ 'click'], // 点击按钮或者外部区域关闭
      }).show();
    }
  })
}

// const onDelete = (row: any) => {
//   Swal.fire({
//     title: `确认删除员工「${row.name}」吗？`,
//     text: "删除后将无法恢复！",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: '确定',
//     cancelButtonText: '取消'
//   })
//   .then((result) => {
//     if (result.isConfirmed) {
//       request.delete(`/emps/${row.id}`).then((res) => {
//         console.log(res, 'res');
//         fetchData()
//       }).catch(err => {
//         console.log(err, 'err');
//       })
//       tableData.value = tableData.value.filter(item => item !== row)
//       Swal.fire(
//         '删除成功！',
//         `员工「${row.name}」已被删除。`,
//         'success'
//       )
//     } else {
//       Swal.fire(
//         '已取消',
//         '员工未被删除。',
//         'info'
//       )
//     }
//   })
// }
const onDelete = (row) => {
  const notyConfirm = new Noty({
    type: 'warning',
    layout: 'center',
    modal: true,
    text: `确认删除员工「${row.name}」吗？删除后将无法恢复！`,
    closeWith: ['button', 'click'],
    buttons: [
      Noty.button('确定', 'btn btn-primary', () => {
        request.delete(`/emps/${row.id}`).then((res) => {
          console.log(res, 'res');
          fetchData();
        }).catch(err => {
          console.log(err, 'err');
          new Noty({
            type: 'error',
            layout: 'center',
            modal: true,
            timeout: 1000, // 显示 1 秒后自动关闭
            closeWith: ['button', 'click'],
            text: '删除失败，请重试。'
          }).show();
        });
        tableData.value = tableData.value.filter(item => item !== row);
        new Noty({
          type: 'success',
          layout: 'center',
          modal: true,
          timeout: 1000, // 显示 1 秒后自动关闭
          text: `删除成功！员工「${row.name}」已被删除。`
        }).show();
        notyConfirm.close();
      }),
      Noty.button('取消', 'btn btn-danger', () => {
        new Noty({
          type: 'info',
          layout: 'center',
          modal: true,
          timeout: 1000, // 显示 1 秒后自动关闭
          closeWith: ['button', 'click'],
          text: '已取消：员工未被删除。'
        }).show();
        notyConfirm.close();
      })
    ]
  }).show();
};


// 上传图片逻辑
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, file) => {
  console.log('handleAvatarSuccess');
}

const beforeAvatarUpload = (rawFile) => {
  console.log(rawFile.type, 'rawFile.type');

  const isJpgOrPng = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png' || rawFile.type === 'image/jpg';
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!isJpgOrPng) {
    const noty = new Noty({
      type: 'error',
      layout: 'center',
      modal: true,
      timeout: 1000, // 显示 1 秒后自动关闭
      text: '格式错误：只能上传 JPG/PNG 格式的图片',
      closeWith: ['button', 'click'],
      buttons: [
        Noty.button('确定', 'btn btn-primary', () => {
          // 关闭提示
          noty.close();
        })
      ]
    }).show();
    return false;
  }
  if (!isLt2M) {
    new Noty({
      type: 'error',
      layout: 'center',
      modal: true,
      // timeout: 1000, // 显示 1 秒后自动关闭
      text: '大小错误：图片大小不能超过 2MB',
      closeWith: ['button', 'click'], // 点击按钮或者外部区域关闭
      // buttons: [
      //   Noty.button('确定', 'btn btn-primary', () => {
      //     // 关闭提示
      //     noty.close();
      //   })
      // ]
    }).show();
    return false;
  }
  console.log('图片符合要求');
  uploadAvatar(rawFile);

  return true;
};


</script>

<style scoped>
.avatar-uploader {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  line-height: 100px;
}

.avatar-uploader img.avatar {
  width: 100%;
  height: 100%;
  display: block;
}

.icon {
  width: 100px;
  height: 100px;
}
</style>
