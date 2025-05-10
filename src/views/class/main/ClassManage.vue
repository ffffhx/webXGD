<template>
  <BasePage>
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="班级名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="结课时间">
        <el-col :span="11">
          <el-date-picker v-model="form.dateRange[0]" type="date" placeholder="开始时间" style="width: 100%" />
        </el-col>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-date-picker v-model="form.dateRange[1]" type="date" placeholder="结束时间" style="width: 100%" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" plain @click="openDialog('add')" style="margin-bottom: 2px;">新增班级</el-button>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" :index="1" />
      <el-table-column prop="name" label="班级名称" width="180" />
      <el-table-column prop="classRoom" label="班级教室" width="180" />
      <el-table-column prop="startTime" label="开课时间" />
      <el-table-column prop="endTime" label="结课时间" />
      <el-table-column prop="classLeader" label="班主任" />
      <el-table-column label="操作" fixed="right" width="250">
        <template #default="scope">
          <el-button size="small" type="primary" text @click="openDialog('edit', scope.row)">编辑</el-button>
          <el-button size="small" type="danger" text @click="onDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px; display: flex; justify-content: end; align-items: center;">
      <el-pagination background layout="prev, pager, next, jumper, ->, total, sizes" :current-page="page"
        :page-size="pageSize" :page-sizes="[5, 10, 20, 50]" :total="total" @current-change="handlePageChange"
        @size-change="handleSizeChange" />
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="dialogForm" label-width="100px">
        <el-form-item label="班级名称">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="班级教室">
          <el-input v-model="dialogForm.classRoom" />
        </el-form-item>
        <el-form-item label="开课时间">
          <el-date-picker v-model="dialogForm.startTime" type="date" placeholder="开课时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结课时间">
          <el-date-picker v-model="dialogForm.endTime" type="date" placeholder="结课时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="班主任">
          <el-input v-model="dialogForm.classLeader" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDialogSubmit">确认</el-button>
      </template>
    </el-dialog>
  </BasePage>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BasePage from '@/components/layout/BasePage.vue'
import request from '@/utils/request'

interface TableData {
  id?: number
  name: string
  classRoom: string
  startTime: string
  endTime: string
  classLeader: string
}

const form = reactive({
  name: '',
  dateRange: [] as [string, string] | []
})

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref<TableData[]>([])

const onSubmit = () => {
  if(form.dateRange[0] && form.dateRange[1]) {
    if (form.dateRange[0] > form.dateRange[1]) {
      ElMessage({
        message: '开始时间不能大于结束时间',
        type: 'warning'
      })
      return
    }
  }
  page.value = 1
  fetchData()
}

const fetchData = async () => {
  request.post('/class/list', {
    page: page.value,
    pageSize: pageSize.value,
    name: form.name,
    startTime: form.dateRange[0],
    endTime: form.dateRange[1]
  }).then((res) => {
    tableData.value = res.data.rows
    total.value = res.data.total
  }).catch((err) => {
    console.log(err)
  })
}

const handlePageChange = (val: number) => {
  page.value = val
  fetchData()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}

onMounted(() => {
  fetchData()
})

const dialogVisible = ref(false)
const dialogTitle = ref('')

const dialogForm = reactive<TableData>({
  name: '',
  classRoom: '',
  startTime: '',
  endTime: '',
  classLeader: ''
})

const openDialog = (type: 'add' | 'edit', row?: TableData) => {
  dialogTitle.value = type === 'add' ? '新增班级' : '编辑班级'
  if (type === 'edit' && row) {
    Object.assign(dialogForm, row)
  } else {
    Object.assign(dialogForm, {
      name: '',
      classRoom: '',
      startTime: '',
      endTime: '',
      classLeader: ''
    })
  }
  dialogVisible.value = true
}

const handleDialogSubmit = () => {
  if (dialogTitle.value === '新增班级') {
    request.post('class/add', {
      name: dialogForm.name,
      classRoom: dialogForm.classRoom,
      startTime: dialogForm.startTime,
      endTime: dialogForm.endTime,
      classLeader: dialogForm.classLeader
    }).then(res => {
      if (res.code === 0) {
        ElMessage.error('新增班级失败：班主任不在员工列表内部')
        return
      }
      ElMessage.success(`新增班级成功，班级「${dialogForm.name}」已被添加`)
      fetchData()
    }).catch(err => {
      console.log(err)
    });
  } else {
    request.put('class', {
      id: dialogForm.id,
      name: dialogForm.name,
      classRoom: dialogForm.classRoom,
      startTime: dialogForm.startTime,
      endTime: dialogForm.endTime,
      classLeader: dialogForm.classLeader,
    }).then(() => {
      ElMessage.success(`班级「${dialogForm.name}」已更新`)
      fetchData()
    })
  }
  dialogVisible.value = false
}

const onDelete = (row: TableData) => {
  ElMessageBox.confirm(
    `确认删除班级「${row.name}」吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      request.delete(`/class/delete/${row.id}`).then(() => {
        ElMessage.success(`班级「${row.name}」已被删除`)
        fetchData()
      }).catch(() => {
        ElMessage.error('班级里有学员，删除失败')
      })
    })
    .catch(() => {
      ElMessage.info('班级未被删除')
    })
}
</script>
