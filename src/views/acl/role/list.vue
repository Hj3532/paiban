<template>
  <el-card>
    <el-form inline>
      <el-form-item>
        <el-input v-model="input" placeholder="请输入门店ID" />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        round
        color="#D6A557"
        @click="searchStore"
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
        style="margin: 10px 0px"
        @click="showStoreDialog"
      >添加</el-button>
      <el-button
        round
        color="#D6A557"
        type="danger"
        icon="el-icon-remove"
        style="margin-left: 10px"
        @click="removeStore"
      >批量删除</el-button>
      <!--        :disabled="selectedId.length===0"-->
    </div>
    <!--
          表格组件
          data:表格组件将来需要展示的数据------数组类型
          border:给表格添加边框
          align：标题对齐方式
          -->
    <el-table style="width: 100%" border stripe :data="tableData">
      <el-table-column type="selection" width="50px" />
      <el-table-column type="index " label="序号" width="100px" align="center">
        <template scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ID" label="门店ID" width="" align="center" />
      <el-table-column prop="name" label="门店name" width="" />
      <el-table-column prop="address" label="门店address" width="" />
      <el-table-column prop="size" label="门店size" width="" />
      <el-table-column prop="" label="操作" width="">
        <!--        <template slot-scope="{row, $index}">-->
        <template slot-scope="{ row }">
          <!--          <Hin button type="primary" size="mini" icon="el-icon-edit" title="修改" @click="showUpdataStore" />-->
          <!--&lt;!&ndash;          <el-confirm:title = "'确定删除${row}吗?"' @onConfirm="removeStore(row)">&ndash;&gt;-->
          <!--            <Hin button type="danger" size="mini" icon="el-icon-edit" title="删除" @click="deleteStore" />-->
          <!--&lt;!&ndash;            </el-confirm>&ndash;&gt;-->
          <!--&lt;!&ndash;          </el-confirm:title>&ndash;&gt;-->
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
    <!--分页器-->
    <!--    <el-pagination-->
    <!--      style="margin-top: 20px; text-align: center"-->
    <!--      :current-page="currentPage"-->
    <!--      :page-sizes="[3,5,10]"-->
    <!--      :page-size="pagesize"-->
    <!--      :total="totalCount"-->
    <!--      layout="prev, pager, next, jumper,->, sizes, total"-->
    <!--      @size-change="handleSizeChange"-->
    <!--      @current-change="handleCurrentChange"-->
    <!--    />-->
    <!--对话框-->
    <el-dialog title="添加门店" :visible.sync="dialogFormVisible1">
      <el-form style="width: 90%">
        <el-form-item label="门店ID" label-width="100px">
          <el-input v-model="ID" autocomplete="off" readonly="" />
        </el-form-item>
        <el-form-item label="门店name" label-width="100px">
          <el-input v-model="name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="门店adress" label-width="100px">
          <el-input v-model="address" autocomplete="off" />
        </el-form-item>
        <el-form-item label="门店size" label-width="100px">
          <el-input v-model="size" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改门店" :visible.sync="dialogFormVisible2">
      <el-form style="width: 90%">
        <el-form-item label="门店ID" label-width="100px">
          <el-input v-model="ID2" autocomplete="off" readonly="" />
        </el-form-item>
        <el-form-item label="门店name" label-width="100px">
          <el-input v-model="name2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="门店adress" label-width="100px">
          <el-input v-model="address2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="门店size" label-width="100px">
          <el-input v-model="size2" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogFormVisible3">
      <el-form style="width: 90%">
        <el-form-item label="是否确认修改？" label-width="100px" />
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
import { getStoreList } from '@/api/store'
import { searchStore } from '@/api/searchstore'
import axios from 'axios'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'RoleList',
  // inject: ['reload'],
  data() {
    return {
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      tableData: [],
      input: '', // 查询输入框内容
      ID: '',
      name: '',
      address: '',
      size: '',
      ID2: '',
      name2: '',
      address2: '',
      size2: '',
      delrow: ''
    }
  },
  mounted() {
    // this.getPageList()
  },
  created() {
    // this.getData(this.pagesize, this.currentPage)
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const storeData = await getStoreList()
      this.tableData = storeData.data
    },
    async showStoreDialog() {
      this.dialogFormVisible1 = true
      const a = await axios.get('/shop/recommend')
      this.ID = a.data.data
    },
    sureAdd() {
      this.dialogFormVisible1 = false
      axios.post('/shop', {
        name: this.name,
        address: this.address,
        size: this.size,
        ID: this.ID
      })
      this.$message({ message: '添加成功！', type: 'success' })
      // this.reload()
      location.reload()
    },
    async searchStore() {
      // eslint-disable-next-line no-empty
      if (this.input === '') {
        await this.$alert('请输入门店ID', '提示', {
          confirmButtonText: '确定',
          callback: () => {}
        })
      } else {
        this.tableData = []
        const b = await searchStore(this.input)
        // console.log(b)
        this.tableData = Array(b.data)
        this.$message({ message: '查询成功！', type: 'success' })
      }
      // this.tableData.push(b.data)
    },
    async resetSearch() {
      this.input = ''
      const storeData = await getStoreList()
      this.tableData = storeData.data
    },
    async removeStore() {},
    clickEdit(row) {
      this.dialogFormVisible2 = true
      this.ID2 = row.ID
      this.name2 = row.name
      this.address2 = row.address
      this.size2 = row.size
    },
    clickDel(row) {
      console.log(row)
      this.dialogFormVisible4 = true
      this.delrow = row
      // console.log(axios.delete('/shop/' + row.ID))
      // this.dialogFormVisible4 = true
    },
    sureEdit() {
      this.dialogFormVisible3 = true
    },
    sure() {
      axios.put('/shop', {
        name: this.name2,
        address: this.address2,
        size: this.size2,
        ID: this.ID2
      })
      this.dialogFormVisible2 = false
      location.reload()
      this.$message({ message: '修改成功！', type: 'success' })
    },
    sureDel() {
      axios.delete('/shop/' + this.delrow.ID)
      this.dialogFormVisible4 = false
      location.reload()
      this.$message({ message: '删除成功！', type: 'success' })
    }
  }
}
</script>

<style scoped></style>
