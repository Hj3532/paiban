<!-- 自己向别人申请 -->
<template>
  <el-table :data="msg" border style="background-color: #F6FAFD; border-radius: 20px;margin-top: 10px">
    <el-table-column prop="data" label="全部信息" align="center"/>
    <el-table-column prop="status" label="状态" align="center"/>
  </el-table>
</template>

<script>
export default {
  props:["shopid_"],
  data() {
    return {
      msg: []
    }
  },
  async created() {
    const token = localStorage.getItem('token')
    let b
    const a = await this.$http.get('/apply/getBeApplied/' + token)
    console.log(a.data.data)
    for (let i = 0; i < a.data.data.length; i++) {
      if (a.data.data[i].status === 3) {
        b = '暂未处理'
      } else if (a.data.data[i].status === 2) {
        b = '被拒绝'
      } else {
        b = '已同意'
      }
      this.msg.push({
        // data: '我想把' + a.data.data[i].exchangeDate + '日' + a.data.data[i].exchangeStartTime + '到' +
        //      a.data.data[i].exchangeEndTime + '的班次和' + a.data.data[i].exchangedName + '' + a.data.data[i].exchangedDate + '日' +
        //      a.data.data[i].exchangedStartTime + '到' +
        //      a.data.data[i].exchangedEndTime + '的班次交换',
        data: a.data.data[i].exchangeDate + '日' + a.data.data[i].exchangeStartTime + '至' +
             a.data.data[i].exchangeEndTime + '的班次' + '\xa0' + '\xa0' + '\xa0' + '==>' + '\xa0' + '\xa0' + '\xa0' + a.data.data[i].exchangedName + '' + a.data.data[i].exchangedDate + '日' +
             a.data.data[i].exchangedStartTime + '到' +
             a.data.data[i].exchangedEndTime + '的班次',
        status: b
      })
    }
    // this.msg = a.data.data
  }
}
</script>

<style>

</style>
