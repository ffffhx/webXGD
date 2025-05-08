<template>
  <BasePage>
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <!-- 查询表单 -->
        <el-form :model="form" inline>
          <el-form-item label="学员姓名:">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="学号:">
            <el-input v-model="form.studentId" placeholder="请输入学号" />
          </el-form-item>
          <el-form-item label="最高学历:" style="width: 160px;">
            <el-select v-model="form.education" placeholder="请选择">
              <el-option v-for="item in educationOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属班级:" style="width: 210px;">
            <el-select v-model="form.className" placeholder="请选择">
              <el-option v-for="item in classOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>

        <!-- 操作按钮 -->
        <div style="margin: 0 1px; display: flex; justify-content: flex-end;">
          <el-button type="primary" plain @click="openDialog('add')">添加学员</el-button>
          <el-button type="danger" @click="onBatchDelete" :disabled="!multipleSelection.length">批量删除</el-button>
        </div>
      </div>


      <!-- 学员表格 -->
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="studentId" label="学号" />
        <el-table-column prop="className" label="班级" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="education" label="最高学历" />
        <el-table-column prop="disciplineCount" label="违纪次数" />
        <el-table-column prop="disciplineScore" label="违纪扣分" />
        <el-table-column prop="lastOperateTime" label="最后操作时间" />
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button size="small" @click="openDialog('edit', scope.row)" text>编辑</el-button>
            <el-button size="small" @click="handleDiscipline(scope.row)" text type="warning">违纪</el-button>
            <el-button size="small" @click="handleDelete(scope.row)" text type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 学员分页 -->
      <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>共 {{ total }} 条</div>
        <el-pagination background layout="prev, pager, next, jumper, ->, total, sizes" :current-page="page"
          :page-size="pageSize" :page-sizes="[5, 10, 20]" :total="total" @current-change="handlePageChange"
          @size-change="handleSizeChange" />
      </div>

      <!-- 添加/编辑弹窗 -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
        <el-form :model="dialogForm" :rules="dialogRules" label-width="100px" ref="dialogFormRef">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="dialogForm.name" />
          </el-form-item>
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="dialogForm.studentId" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="dialogForm.gender">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="dialogForm.phone" />
          </el-form-item>
          <el-form-item label="最高学历">
            <el-select v-model="dialogForm.education" placeholder="可选">
              <el-option v-for="item in educationOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属班级" prop="className">
            <el-select v-model="dialogForm.className">
              <el-option v-for="item in classOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" plain @click="submitForm">确认</el-button>
        </template>
      </el-dialog>

      <!-- 违纪弹窗 -->
      <el-dialog v-model="disciplineDialogVisible" title="违纪处理" width="400px">
        <el-form>
          <el-form-item label="扣分">
            <el-input-number v-model="disciplineScoreInput" :min="1" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="disciplineDialogVisible = false">取消</el-button>
          <el-button type="warning" plain @click="confirmDiscipline">确认</el-button>
        </template>
      </el-dialog>
    </div>
  </BasePage>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import Swal from 'sweetalert2'
import BasePage from '@/components/layout/BasePage.vue'


interface Student {
  name: string
  studentId: string
  gender: string
  phone: string
  education?: string
  className: string
  disciplineCount: number
  disciplineScore: number
  lastOperateTime: string
}

const form = reactive({
  name: '',
  studentId: '',
  education: '',
  className: ''
})

const educationOptions = ['初中', '高中', '大专', '本科', '硕士', '博士']
const classOptions = ['高三1班', '高三2班', '高三3班']

const tableData = ref<Student[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const multipleSelection = ref<Student[]>([])

const fetchData = () => {
  // 模拟数据
  tableData.value = Array.from({ length: pageSize.value }, (_, i) => ({
    name: `学生${i + 1}`,
    studentId: `20250${i + 1}`,
    gender: i % 2 === 0 ? '男' : '女',
    phone: `18888888${i + 10}`,
    education: '本科',
    className: '高三1班',
    disciplineCount: 0,
    disciplineScore: 0,
    lastOperateTime: new Date().toLocaleString()
  }))
  total.value = 40
}

fetchData()

const onSearch = () => {
  page.value = 1
  fetchData()
}

const handlePageChange = (val: number) => {
  page.value = val
  fetchData()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}

const handleSelectionChange = (val: Student[]) => {
  multipleSelection.value = val
}

const onBatchDelete = () => {
  Swal.fire({
    title: '确定批量删除所选学员吗？',
    text: "删除后将无法恢复！",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then((result) => {
    if (result.isConfirmed) {
      tableData.value = tableData.value.filter(item => !multipleSelection.value.includes(item))
      Swal.fire(
        '删除成功！',
        '所选学员已被删除。',
        'success'
      )
      fetchData()
    } else {
      Swal.fire(
        '已取消',
        '所选学员未被删除。',
        'info'
      )
    }
  })
}

// 编辑/添加对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogFormRef = ref<FormInstance>()
const dialogForm = reactive<Student>({
  name: '',
  studentId: '',
  gender: '',
  phone: '',
  education: '',
  className: '',
  disciplineCount: 0,
  disciplineScore: 0,
  lastOperateTime: ''
})

const dialogRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  className: [{ required: true, message: '请选择班级', trigger: 'change' }]
}

const openDialog = (type: 'add' | 'edit', row?: Student) => {
  dialogTitle.value = type === 'add' ? '添加学员' : '编辑学员'
  if (type === 'edit' && row) {
    Object.assign(dialogForm, row)
  } else {
    Object.assign(dialogForm, {
      name: '',
      studentId: '',
      gender: '',
      phone: '',
      education: '',
      className: '',
      disciplineCount: 0,
      disciplineScore: 0,
      lastOperateTime: ''
    })
  }
  dialogVisible.value = true
}

const submitForm = () => {
  dialogFormRef.value?.validate(valid => {
    if (valid) {
      dialogForm.lastOperateTime = new Date().toLocaleString()
      dialogVisible.value = false
      if (!tableData.value.find(item => item.studentId === dialogForm.studentId)) {
        tableData.value.unshift({ ...dialogForm })
      } else {
        const index = tableData.value.findIndex(item => item.studentId === dialogForm.studentId)
        if (index !== -1) tableData.value[index] = { ...dialogForm }
      }
      ElMessage.success('保存成功')
    }
  })
}

// const handleDelete = (row: Student) => {
//   ElMessageBox.confirm(`确定删除学员「${row.name}」吗？`, '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning'
//   }).then(() => {
//     tableData.value = tableData.value.filter(item => item !== row)
//     ElMessage.success('删除成功')
//     fetchData()
//   })
// }

const handleDelete = (row: Student) => {
  Swal.fire({
    title: `确定删除学员「${row.name}」吗？`,
    text: "删除后将无法恢复！",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then((result) => {
    if (result.isConfirmed) {
      tableData.value = tableData.value.filter(item => item !== row)
      Swal.fire(
        '删除成功！',
        `学员「${row.name}」已被删除。`,
        'success'
      )
      fetchData()
    } else {
      Swal.fire(
        '已取消',
        '学员未被删除。',
        'info'
      )
    }
  })
}

const disciplineDialogVisible = ref(false)
const disciplineScoreInput = ref(1)
const currentStudent = ref<Student | null>(null)

const handleDiscipline = (row: Student) => {
  currentStudent.value = row
  disciplineScoreInput.value = 1
  disciplineDialogVisible.value = true
}

const confirmDiscipline = () => {
  if (currentStudent.value) {
    currentStudent.value.disciplineCount += 1
    currentStudent.value.disciplineScore += disciplineScoreInput.value
    currentStudent.value.lastOperateTime = new Date().toLocaleString()
    ElMessage.success('违纪记录成功')
    disciplineDialogVisible.value = false
  }
}
</script>

<style scoped>
.el-form-item {
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
