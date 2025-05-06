<template>
    <BasePage>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="班级名称">
            <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="结课时间">
            <el-col :span="11">
            <el-date-picker
                v-model="form.dateRange[0]"
                type="date"
                placeholder="开始时间"
                style="width: 100%"
            />
            </el-col>
            <el-col :span="2" class="text-center">
            <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
            <el-date-picker
                v-model="form.dateRange[1]"
                type="date"
                placeholder="结束时间"
                style="width: 100%"
            />
            </el-col>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        </el-form>
    
        <el-button type="primary" @click="openDialog('add')">新增班级</el-button>
    
        <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" :index="1" />
        <el-table-column prop="classname" label="班级名称" width="180" />
        <el-table-column prop="classroom" label="班级教室" width="180" />
        <el-table-column prop="starttime" label="开课时间" />
        <el-table-column prop="endtime" label="结课时间" />
        <el-table-column prop="teacher" label="班主任" />
        <el-table-column label="操作" fixed="right" width="250">
            <template #default="scope">
            <el-button size="small" type="primary" text @click="openDialog('edit', scope.row)">编辑</el-button>
            <el-button size="small" type="danger" text @click="onDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>
    
        <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>共 {{ total }} 条</div>
        <el-pagination
            background
            layout="prev, pager, next, jumper, ->, total, sizes"
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            :total="total"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
        />
        </div>
    
        <!-- 新增/编辑班级对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
        <el-form :model="dialogForm" label-width="100px">
            <el-form-item label="班级名称">
            <el-input v-model="dialogForm.classname" />
            </el-form-item>
            <el-form-item label="班级教室">
            <el-input v-model="dialogForm.classroom" />
            </el-form-item>
            <el-form-item label="开课时间">
            <el-date-picker v-model="dialogForm.starttime" type="date" placeholder="开课时间" style="width: 100%" />
            </el-form-item>
            <el-form-item label="结课时间">
            <el-date-picker v-model="dialogForm.endtime" type="date" placeholder="结课时间" style="width: 100%" />
            </el-form-item>
            <el-form-item label="班主任">
            <el-input v-model="dialogForm.teacher" />
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
  import { ElMessageBox, ElMessage } from 'element-plus'
  import BasePage from '@/components/layout/BasePage.vue'

  interface TableData {
    classname: string
    classroom: string
    starttime: string
    endtime: string
    teacher: string
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
    page.value = 1
    fetchData()
  }
  
  const fetchData = async () => {
    tableData.value = Array.from({ length: pageSize.value }, (_, i) => ({
      classname: '生物',
      classroom: `高三${i + 1}班`,
      starttime: '2024-09-01',
      endtime: '2025-01-01',
      teacher: '徐华松'
    }))
    total.value = 100
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
  
  // ------------------------ 弹窗逻辑 ------------------------
  const dialogVisible = ref(false)
  const dialogTitle = ref('')
  
  const dialogForm = reactive<TableData>({
    classname: '',
    classroom: '',
    starttime: '',
    endtime: '',
    teacher: ''
  })
  
  const openDialog = (type: 'add' | 'edit', row?: TableData) => {
    dialogTitle.value = type === 'add' ? '新增班级' : '编辑班级'
    if (type === 'edit' && row) {
      Object.assign(dialogForm, row)
    } else {
      Object.assign(dialogForm, {
        classname: '',
        classroom: '',
        starttime: '',
        endtime: '',
        teacher: ''
      })
    }
    dialogVisible.value = true
  }
  
  const handleDialogSubmit = () => {
    if (dialogTitle.value === '新增班级') {
      tableData.value.unshift({ ...dialogForm })
    } else {
      // 模拟更新逻辑
      const index = tableData.value.findIndex(item => item.classname === dialogForm.classname)
      if (index !== -1) {
        tableData.value[index] = { ...dialogForm }
      }
    }
    dialogVisible.value = false
  }

  const onDelete = (row: TableData) => {
  ElMessageBox.confirm(
    `确认删除班级「${row.classname}」吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 模拟删除：从 tableData 中移除
    tableData.value = tableData.value.filter(item => item !== row)
    ElMessage.success('删除成功')
    fetchData() // 刷新数据
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

  </script>
  