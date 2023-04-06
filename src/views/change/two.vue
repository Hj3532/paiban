<!-- 别人申请自己 -->
<template>
  <el-table :data="msg" border>
    <el-table-column prop="applyId" label="交换ID" width="100px" align="center">
    </el-table-column>
    <el-table-column prop="data" label="全部信息">
    </el-table-column>
    <el-table-column prop="status" label="状态" align="center">
    </el-table-column>
    <el-table-column prop="" label="操作" width="220px" align="center">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-edit"
            @click="agree(row)"
          >同意</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="refuse(row)"
          >拒绝</el-button>
        </template>
      </el-table-column>
  </el-table>
</template>

<script>
let token = 0
export default {
    data() {
        return {
            msg:[]
        }
    },
    async created(){
        token = localStorage.getItem('token')
        let b ;
        const a = await this.$http.get('/apply/getApply/' + token)
        console.log( a.data.data)
        for(let i = 0 ; i < a.data.data.length ; i++){
            if(a.data.data[i].status == 3){
                b = '暂未处理'
            }else if(a.data.data[i].status == 2){
                b = '拒绝'
            }else{
                b = '同意'
            }
            this.msg.push({
                data:a.data.data[i].exchangeName+'想把'+ a.data.data[i].exchangeDate + '日' +a.data.data[i].exchangeStartTime +'到' +
             a.data.data[i].exchangeEndTime+'的班次和我的'+''+a.data.data[i].exchangedDate + '日' 
             +a.data.data[i].exchangedStartTime +'到' +
             a.data.data[i].exchangedEndTime+'的班次交换',
             status: b,
             applyId: a.data.data[i].applyId
            })
        }
    },
    methods: {
        async agree(row){
            const a = await this.$http.put('/apply/delExchange/'+row.applyId+'/1')
            console.log(a.data)
            location.reload()
        },
        async refuse(row){
            const a = await this.$http.put('/apply/delExchange/'+row.applyId+'/2')
            console.log(a)
            location.reload()
        }
    }
}
</script>

<style>

</style>