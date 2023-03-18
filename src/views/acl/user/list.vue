<template>
  <el-card>
    <el-form inline>
      <el-form-item>
        <el-input v-model="input" placeholder="请输入员工姓名" />
      </el-form-item>
      <el-select v-model="empPosition" placeholder="请选择员工的position">
        <el-option
          v-for="item in options"
          :key="item.value"
          ref="op"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-search"
        style="margin-left: 20px"
        round
        color="#D6A557"
        @click="searchEmployee"
      >查询</el-button>
      <el-button
        type="default"
        round
        color="#D6A557"
        @click="resetSearch"
      >清空</el-button>
    </el-form>

    <div style="margin-bottom: 20px">
      <el-button
        round
        color="#D6A557"
        type="primary"
        icon="el-icon-plus"
        style="margin: 10px 0"
        @click="showEmployeeDialog"
      >添加</el-button>
      <el-button
        round
        color="#D6A557"
        type="danger"
        icon="el-icon-remove"
        style="margin-left: 10px"
        @click="removeEmployees"
      >批量删除</el-button>
      <!--        :disabled="selectedId.length===0"-->
    </div>
    <!--
        表格组件
        data:表格组件将来需要展示的数据------数组类型
        border:给表格添加边框
        align：标题对齐方式
        -->
    <el-table
      style="width: 100%"
      border
      stripe
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50px" />
      <el-table-column type="index " label="序号" width="100px" align="center">
        <template scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ID" label="员工ID" width="" align="center" />
      <el-table-column prop="name" label="员工name" width="" align="center" />
      <!--      <el-table-column prop="password" label="员工密码" width="" align="center" />-->
      <el-table-column
        prop="position"
        label="员工position"
        width=""
        align="center"
      />
      <el-table-column
        prop="shopId"
        label="隶属门店ID"
        width=""
        align="center"
      />
      <el-table-column prop="email" label="员工email" width="" align="center" />
      <el-table-column prop="" label="操作" width="220px" align="center">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-edit"
            @click="clickEdit(row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="clickDel(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页器-->
    <!--当前页
        数据总条数
     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10, 20]"
      :page-size="limit"
      :total="total"
      :page-count="7"
      layout="prev, pager, next, jumper,->, sizes, total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--对话框-->
    <el-dialog title="添加员工" :visible.sync="dialogFormVisible1">
      <el-form style="width: 90%">
        <el-form-item label="员工ID" label-width="120px">
          <el-input v-model="ID" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="员工name" label-width="120px">
          <el-input v-model="name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="员工password" label-width="120px">
          <el-input v-model="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="员工position" label-width="120px">
          <el-input v-model="position" autocomplete="off" />
        </el-form-item>
        <el-form-item label="隶属门店ID" label-width="120px">
          <el-input v-model="shopId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="员工email" label-width="120px">
          <el-input v-model="email" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改员工" :visible.sync="dialogFormVisible2">
      <el-form style="width: 90%">
        <el-form-item label="员工ID" label-width="120px">
          <el-input v-model="ID2" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="员工name" label-width="120px">
          <el-input v-model="name2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="员工password" label-width="120px">
          <el-input v-model="password2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="员工position" label-width="120px">
          <el-input v-model="position2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="隶属门店ID" label-width="120px">
          <el-input v-model="shopId2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="员工email" label-width="120px">
          <el-input v-model="email2" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogFormVisible3">
      <el-form style="width: 90%">
        <el-form-item label="是否确认修改" label-width="100px" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogFormVisible4">
      <el-form style="width: 90%">
        <el-form-item label="是否确认删除？" label-width="120px" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="sureDel()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// import { getStoreList } from '@/api/store'
// import { searchEmployee } from '@/api/searchemployee'
import axios from 'axios'
import { getEmployeeList } from '@/api/employee'
import { searchEmployee } from '@/api/searchemployee'
// import { searchEmployee } from '@/api/searchemployee'
export default {
  name: 'AclUserList',
  // inject: ['reload'],
  data() {
    return {
      options: [
        {
          value: '普通员工',
          label: '普通员工'
        },
        {
          value: '员工组长',
          label: '员工组长'
        },
        {
          value: '店长',
          label: '店长'
        }
      ],
      empPosition: '',
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      tableData: [],
      input: '', // 查询输入框内容
      ID: '',
      name: '',
      password: '',
      password2: '',
      position2: '',
      shopId2: '',
      position: '',
      shopId: '',
      email: '',
      //
      ID2: '',
      name2: '',
      email2: '',
      delrow: '',
      multipleSelection: [],
      // employeePosition: '',
      //
      //
      //
      page: 1,
      limit: 5,
      total: 0,
      list: [],
      tokenShopID: ''
      // pagesize: 10, //    每页的数据
      // tableData: [],
      // currentPage: 1, // 第几页
      // totalCount: 1 // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
    }
  },
  mounted() {
    // this.getPageList()
    // console.log(this.$API)
    //  获取列表数据
    //   this.getPageList()
  },
  async created() {
    const token = localStorage.getItem('token')
    const { data: res } = await this.$http.get('/emp/' + token)
    this.tokenShopID = res.data.shopId
    // this.getData(this.pagesize, this.currentPage)
    this.fetchData()
  },
  methods: {
    // async getPageList() {
    //   const result = await this.$API.employee.getEmployeeList(this.page, this.limit)
    //   console.log(result)
    // },
    async fetchData() {
      // this.page = pager
      const employeeDate = await getEmployeeList(this.tokenShopID, this.page, this.limit)
      // console.log(employeeDate)
      if (employeeDate.flag) {
        this.total = employeeDate.data.total
        this.list = employeeDate.data.records
        this.tableData = this.list
        // console.log(this.total)
        // console.log(this.list)
      }
    },
    handleCurrentChange(pager) {
      // console.log(pager)
      this.page = pager
      if (this.input === '' && this.empPosition === '') {
        this.fetchData()
      } else {
        this.searchEmployee()
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      if (this.input === '' && this.empPosition === '') {
        this.fetchData()
      } else {
        this.searchEmployee()
      }
    },
    async showEmployeeDialog() {
      this.dialogFormVisible1 = true
      const emp = await axios.get('/emp/recommend')
      // console.log(a)
      this.ID = emp.data.data
    },
    sureAdd() {
      const suc = axios.post('/emp', {
        name: this.name,
        password: this.password,
        position: this.position,
        shopId: this.shopId,
        email: this.email,
        ID: this.ID
      })
      // console.log(suc)
      suc.then((res) => {
        if (res.data.flag) {
          this.dialogFormVisible1 = false
          this.$message({ message: '添加成功！', type: 'success' })
          location.reload()
        }
      })
    },
    async searchEmployee() {
      // const test = axios.get()
      // eslint-disable-next-line no-empty
      if (this.input === '' && this.empPosition === '') {
        await this.$alert('请输入员工姓名和员工position', '提示', {
          confirmButtonText: '确定',
          callback: () => {}
        })
      } else {
        this.tableData = []
        const b = await searchEmployee(
          this.tokenShopID,
          this.page,
          this.limit,
          this.input,
          this.empPosition
        )
        if (b.flag) {
          this.total = b.data.total
          this.list = b.data.records
          this.tableData = this.list
        }
      }
    },
    async resetSearch() {
      this.input = ''
      const empData = this.fetchData()
      this.tableData = empData.data
      this.empPosition = null
      // console.log(this.$refs.op.key)
      // this.$refs.op.value = ''
      // this.setValueNull()
    },
    handleSelectionChange(selection) {
      // console.log(selection)
      this.multipleSelection = selection
    },
    async removeEmployees() {
      this.$confirm('此操作将永久删除员工信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定执行 then 方法
        const idList = []
        // 遍历数组得到每个 id 值，设置到 idList 里面
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const obj = this.multipleSelection[i]
          const id = obj.ID
          idList.push(id)
        }
        axios.delete('/emp/delIds', { data: idList }).then((response) => {
          if (response.data.flag) {
            this.$message({
              type: 'success',
              message: '批量删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '批量删除失败!'
            })
          }
          location.reload()
        })
      })
    },
    clickEdit(row) {
      this.dialogFormVisible2 = true
      this.name2 = row.name
      this.password2 = row.password // 待修改
      this.position2 = row.position
      this.shopId2 = row.shopId
      this.email2 = row.email
      this.ID2 = row.ID
    },
    clickDel(row) {
      // console.log(row)
      this.dialogFormVisible4 = true
      this.delrow = row
    },
    sureEdit() {
      this.dialogFormVisible3 = true
    },
    sure() {
      axios.put('/emp', {
        name: this.name2,
        password: this.password2, // 待修改
        position: this.position2,
        shopId: this.shopId2,
        email: this.email2,
        ID: this.ID2
      })
      this.dialogFormVisible2 = false
      location.reload()
    },
    sureDel() {
      axios.delete('/emp/' + this.delrow.ID)
      this.dialogFormVisible4 = false
      location.reload()
      this.$message({ message: '删除成功！', type: 'success' })
    }
  }
}
</script>

<style scoped></style>
