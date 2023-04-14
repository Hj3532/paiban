<!-- 别人申请自己 -->
<template>
  <div>
    <h3 class="loding">待处理</h3>
    <el-table ref="table" :data="msg" border style="background-color: #F6FAFD; border-radius: 20px;margin-top: 10px">
      <el-table-column
        prop="applyId"
        label="交换ID"
        width="100px"
        align="center"
      />
      <!--      <el-table-column prop="data" label="全部信息" align="center"/>-->
      <el-table-column prop="data" label="全部信息" align="center" width="700px">
        <template slot-scope="scope">
          申请将 <span style="color: red">{{ scope.row.data[scope.$index].exchangeDate }}</span>&nbsp;日
          <span style="color: red">{{ scope.row.data[scope.$index].exchangeStartTime }}</span> &nbsp;到
          <span style="color: red">{{ scope.row.data[scope.$index].exchangeEndTime }}</span>&nbsp;的班次
          &nbsp;&nbsp;<span>==></span>&nbsp;&nbsp;
          <span style="color: #FFA500">{{ scope.row.data[scope.$index].exchangedName }}</span>&nbsp;
          <span style="color: cornflowerblue">{{ scope.row.data[scope.$index].exchangedDate }}</span>&nbsp;日
          <span style="color: cornflowerblue">{{ scope.row.data[scope.$index].exchangedStartTime }}</span> &nbsp;到
          <span style="color: cornflowerblue">{{ scope.row.data[scope.$index].exchangedEndTime }}</span>&nbsp;的班次
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" />
      <el-table-column prop="" label="操作" width="220px" align="center">
        <template slot-scope="scope">
          <el-button
            :ref="'a'+scope.$index"
            size="mini"
            type="warning"
            icon="el-icon-edit"
            @click="agree(scope.row,scope.$index)"
          >同意</el-button>
          <el-button
            :ref="'r'+scope.$index"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="refuse(scope.row,scope.$index)"
          >拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <h3 class="loding">已处理</h3>
    <el-table ref="table" :data="old" border style="background-color: #F6FAFD; border-radius: 20px;margin-top: 10px">
      <el-table-column
        prop="applyId"
        label="交换ID"
        width="100px"
        align="center"
      />
      <!--      <el-table-column prop="data" label="全部信息" align="center" />-->
      <el-table-column prop="data" label="全部信息" align="center" width="700px">
        <template slot-scope="scope">
          申请将 <span style="color: red">{{ scope.row.data[scope.$index].exchangeDate }}</span>&nbsp;日
          <span style="color: red">{{ scope.row.data[scope.$index].exchangeStartTime }}</span> &nbsp;到
          <span style="color: red">{{ scope.row.data[scope.$index].exchangeEndTime }}</span>&nbsp;的班次
          &nbsp;&nbsp;<span>==></span>&nbsp;&nbsp;
          <span style="color: #FFA500">{{ scope.row.data[scope.$index].exchangedName }}</span>&nbsp;
          <span style="color: cornflowerblue">{{ scope.row.data[scope.$index].exchangedDate }}</span>&nbsp;日
          <span style="color: cornflowerblue">{{ scope.row.data[scope.$index].exchangedStartTime }}</span> &nbsp;到
          <span style="color: cornflowerblue">{{ scope.row.data[scope.$index].exchangedEndTime }}</span>&nbsp;的班次
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" />
    </el-table>
    <!-- <button @click="a(0)">测试</button> -->
  </div>
</template>

<script>
let token = 0
export default {
  props: ['shopid_'],
  data() {
    return {
      msg: [],
      old: []
    }
  },
  async created() {
    token = localStorage.getItem('token')
    let b
    const a = await this.$http.get('/apply/getApply/' + token)
    console.log(a.data.data)
    for (let i = 0; i < a.data.data.length; i++) {
      if (a.data.data[i].status == 3) {
        b = '暂未处理'
        this.msg.push({
          data:
            a.data.data,
          status: b,
          applyId: a.data.data[i].applyId
        })
      } else if (a.data.data[i].status === 2) {
        b = '已拒绝'
        this.old.push({
          data:
            a.data.data,
          status: b,
          applyId: a.data.data[i].applyId
        })
      } else {
        b = '已同意'
        // this.old.push({
        //   data:
        //     a.data.data[i].exchangeName +
        //     '想把' +
        //     a.data.data[i].exchangeDate +
        //     '日' +
        //     a.data.data[i].exchangeStartTime +
        //     '到' +
        //     a.data.data[i].exchangeEndTime +
        //     '的班次和我的' +
        //     '' +
        //     a.data.data[i].exchangedDate +
        //     '日' +
        //     a.data.data[i].exchangedStartTime +
        //     '到' +
        //     a.data.data[i].exchangedEndTime +
        //     '的班次交换',
        //   status: b,
        //   applyId: a.data.data[i].applyId
        // })
        this.old.push({
          data:
            a.data.data,
          status: b,
          applyId: a.data.data[i].applyId
        })
      }
    }
  },
  methods: {
    async agree(row, index) {
      console.log(this.$refs.table)
      const a = await this.$http.put(
        '/apply/delExchange/' + row.applyId + '/1'
      )
      // console.log(a.data);
      const b = 'a' + index
      const c = 'r' + index
      this.$refs[b].disabled = true
      this.$refs[c].disabled = true
      // location.reload()
    },
    async refuse(row, index) {
      const a = await this.$http.put(
        '/apply/delExchange/' + row.applyId + '/2'
      )
      // console.log(a);
      const b = 'a' + index
      const c = 'r' + index
      this.$refs[b].disabled = true
      this.$refs[c].disabled = true
      //   location.reload();
    }
    // a(c){
    //     console.log(this.$refs)
    //     let b='a'+c
    //     this.$refs[b].disabled = true
    //     console.log(this.$refs[b],{b})
    // }
  }
}
</script>

<style>
.loding {
  margin: 10px 0;
}
</style>
