<!-- 自己向别人申请 -->
<template>
  <el-table :data="msg" border>
    <el-table-column prop="data" label="全部信息">
    </el-table-column>
    <el-table-column prop="status" label="状态">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
    data(){
        return {
            msg:[]
        }
    },
    async created(){
        const token = localStorage.getItem('token')
        let b ;
        const a = await this.$http.get('/apply/getBeApplied/' + token)
        console.log( a.data.data)
        for(let i = 0 ; i < a.data.data.length ; i++){
            if(a.data.data[i].status == 3){
                b = '暂未处理'
            }else if(a.data.data[i].status == 2){
                b = '被拒绝'
            }else{
                b = '同意'
            }
            this.msg.push({
                data:'我想把'+ a.data.data[i].exchangeDate + '日' +a.data.data[i].exchangeStartTime +'到' +
             a.data.data[i].exchangeEndTime+'的班次和'+ a.data.data[i].exchangedName+''+a.data.data[i].exchangedDate + '日' 
             +a.data.data[i].exchangedStartTime +'到' +
             a.data.data[i].exchangedEndTime+'的班次交换',
             status: b
            })
        }
        //this.msg = a.data.data
    }
}
</script>

<style>

</style>