<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-input v-model="inputid" placeholder="门店相关信息" />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="search"
      >查询</el-button>
      <!--      <el-button type="default" @click="resetSearch">清空</el-button>-->
    </el-form>

    <div style="margin-bottom: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin: 10px 0px"
        @click="showStoreDialog"
      >添加</el-button>
      <el-button type="danger" icon="el-icon-remove" style="margin: 10px 0px" />
      <!--        @click="removeStore">批量删除</el-button>-->
      <!--        :disabled="selectedId.length===0"-->
    </div>
    <!--
          表格组件
          data:表格组件将来需要展示的数据------数组类型
          border:给表格添加边框
          align：标题对齐方式
          -->
    <el-table style="width: 100%" stripe :data="tableData">
      <el-table-column type="selection" width="50px" />
      <el-table-column type="index " label="序号" width="100px" prop="" />
      <el-table-column prop="name" label="门店name" width="" />
      <el-table-column prop="address" label="门店address" width="" />
      <el-table-column prop="size" label="门店size" width="" />
      <el-table-column prop="ID" label="门店ID" width="" />
      <el-table-column prop="" label="操作" width="">
        <!--        <template slot-scope="{row}">-->
        <!--          <Hinbutton type="primary" size="mini" icon="el-icon-edit" title="修改" @click="showUpdataStore(row)"/>-->
        <!--          <el-popconfirm:title = "'确定删除${row}吗?"' @onConfirm="removeStore(row)">-->
        <!--            <Hinbutton type="danger" size="mini" icon="el-icon-edit" title="删除" @click="showUpdataStore(row)"/>-->
        <!--          </el-popconfirm>-->
        <!--        </template>-->
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
    <el-dialog title="添加门店" :visible.sync="dialogFormVisible">
      <el-form style="width: 90%">
        <el-form-item label="门店ID" label-width="100px">
          <el-input autocomplete="off" />
        </el-form-item>
        <el-form-item label="门店name" label-width="100px">
          <el-input autocomplete="off" />
        </el-form-item>
        <el-form-item label="门店adress" label-width="100px">
          <el-input autocomplete="off" />
        </el-form-item>
        <el-form-item label="门店size" label-width="100px">
          <el-input autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogFormVisible = false"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import axios from "axios";
// import a from '../../../mock/shop'

export default {
  name: 'Store',
  data() {
    return {
      dialogFormVisible: false,
      tableData: [],
      inputid: ''
      // pagesize: 10, //    每页的数据
      // tableData: [],
      // currentPage: 1, // 第几页
      // totalCount: 1 // 总条数 这些数据虽然后面会赋值为后端返回的数，但是最好不要为空
    }
  },
  mounted() {
    // this.getPageList()
    this.fetchData()

    console.log(this.tableData)
  },
  created() {
    // console.log(a)
    // this.getData(this.pagesize, this.currentPage)
  },
  methods: {
    async fetchData() {
      // console.log(a.table.length)
      const { data: res } = await this.$http.get('/shop')
      console.log(res)
      this.tableData = res.data
    },
    showStoreDialog() {
      this.dialogFormVisible = true
    },
    async search() {
      this.tableData = []
      console.log(this.inputid)
      const { data: res } = await this.$http.get('/shop/' + this.inputid)
      // this.$http.post("/shop/"+this.inputid , {

      //     name: "",
      // })
      console.log(res)
      this.tableData.push(res.data)
    }
  }
}
</script>

<style scoped></style>
