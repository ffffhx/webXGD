<template>
  <BasePage>
    <div>
      <!-- 查询表单 -->
      <el-form :model="form" label-width="100px" inline>
        <el-form-item label="学员姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.studentNumber" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="最高学历">
          <el-select v-model="form.highestEducation" placeholder="请选择" style="width: 100px;">
            <el-option v-for="item in highestEducationOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属班级">
          <el-select v-model="form.classId" placeholder="请选择" style="width: 100px;">
            <el-option v-for="item in classOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 2px; margin-right:5px ;">
        <el-button type="primary" plain @click="openDialog('add')">添加学员</el-button>
      </div>

      <!-- 学员表格 -->
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="studentNumber" label="学号" />
        <el-table-column prop="classId" label="班级" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="highestEducation" label="最高学历" />
        <el-table-column prop="violationCount" label="违纪次数" />
        <el-table-column prop="violationScore" label="违纪扣分" />
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
      <div style="margin-top: 20px; display: flex; justify-content: end; align-items: center;">
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
          <el-form-item label="学号" prop="studentNumber">
            <el-input v-model="dialogForm.studentNumber" />
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
            <el-select v-model="dialogForm.highestEducation" placeholder="可选">
              <el-option v-for="item in highestEducationOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属班级" prop="classId">
            <el-select v-model="dialogForm.classId">
              <el-option v-for="item in classOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </template>
      </el-dialog>

      <!-- 违纪弹窗 -->
      <el-dialog v-model="disciplineDialogVisible" title="违纪处理" width="400px">
        <el-form>
          <el-form-item label="扣分">
            <el-input-number v-model="violationScoreInput" :min="1" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="disciplineDialogVisible = false">取消</el-button>
          <el-button type="warning" @click="confirmDiscipline">确认</el-button>
        </template>
      </el-dialog>
    </div>
  </BasePage>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import request from '@/utils/request'
import BasePage from '@/components/layout/BasePage.vue'

interface Student {
  id: number
  name: string
  studentNumber: string
  gender: string
  phone: string
  highestEducation?: string
  classId: string
  violationCount: number
  violationScore: number
  lastOperateTime: string
}

const form = reactive({
  name: '',
  studentNumber: '',
  highestEducation: '',
  classId: ''
})

const highestEducationOptions = ['初中', '高中', '大专', '本科', '硕士', '博士']
const classOptions = [1, 2, 3]

const tableData = ref<Student[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const multipleSelection = ref<Student[]>([])

const fetchData = () => {
  request.post('/student/list', {
    page: page.value,
    pageSize: pageSize.value,
    name: form.name,
    studentNumber: form.studentNumber,
    highestEducation: form.highestEducation,
    classId: form.classId,
  }).then((res: any) => {
    tableData.value = res.data.rows
  })
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

const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogFormRef = ref<FormInstance>()
const dialogForm = reactive<Student>({
  id: 0,
  name: '',
  studentNumber: '',
  gender: '',
  phone: '',
  highestEducation: '',
  classId: '',
  violationCount: 0,
  violationScore: 0,
  lastOperateTime: ''
})

const dialogRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  studentNumber: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  classId: [{ required: true, message: '请选择班级', trigger: 'change' }]
}

const openDialog = (type: 'add' | 'edit', row?: Student) => {
  dialogTitle.value = type === 'add' ? '添加学员' : '编辑学员'
  if (type === 'edit' && row) {
    Object.assign(dialogForm, row)
  } else {
    Object.assign(dialogForm, {
      id: 0,
      name: '',
      studentNumber: '',
      gender: '',
      phone: '',
      highestEducation: '',
      classId: '',
      violationCount: 0,
      violationScore: 0,
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
      if (!tableData.value.find(item => item.studentNumber === dialogForm.studentNumber)) {
        request.post('/student/add', { ...dialogForm }).then(() => {
          fetchData()
          ElMessage.success('添加成功')
        }).catch(() => {
          ElMessage.error('添加失败')
        })
      } else {
        request.put('/student', { ...dialogForm }).then(() => {
          fetchData()
          ElMessage.success('编辑成功')
        }).catch(() => {
          ElMessage.error('编辑失败')
        })
      }
    }
  })
}

const handleDelete = (row: Student) => {
  ElMessageBox.confirm(`确定删除学员「${row.name}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    request.delete(`/student/delete/${row.id}`).then(() => {
      fetchData()
      ElMessage.success(`学员「${row.name}」已被删除`)
    }).catch(() => {
      ElMessage.error('删除失败')
    })
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

const disciplineDialogVisible = ref(false)
const violationScoreInput = ref(1)
const currentStudent = ref<Student | null>(null)

const handleDiscipline = (row: Student) => {
  currentStudent.value = row
  violationScoreInput.value = 1
  disciplineDialogVisible.value = true
}

const confirmDiscipline = () => {
  if (currentStudent.value) {
    currentStudent.value.violationCount += 1
    currentStudent.value.violationScore += violationScoreInput.value
    currentStudent.value.lastOperateTime = new Date().toLocaleString()
    request.put('/student/violation', null, {
      params: {
        id: currentStudent.value.id,
        score: currentStudent.value.violationScore
      }
    }).then(() => {
      fetchData()
      ElMessage.success(`学员「${currentStudent.value!.name}」的违纪扣分已更新`)
    }).catch(() => {
      ElMessage.error('违纪处理失败')
    })
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
