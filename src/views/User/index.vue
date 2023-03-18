<template>
  <div>
    <el-form style="width: 90%">
      <el-form-item label="员工ID" label-width="120px">
        <el-input v-model="user.ID" autocomplete="off" readonly="readonly" />
      </el-form-item>
      <el-form-item label="员工name" label-width="120px">
        <el-input v-model="user.name" autocomplete="off" readonly="readonly" />
      </el-form-item>
      <el-form-item label="员工password" label-width="120px">
        <el-input
          v-model="user.password"
          autocomplete="off"
          readonly="readonly"
          type="password"
        />
      </el-form-item>
      <el-form-item label="员工position" label-width="120px">
        <el-input
          v-model="user.position"
          autocomplete="off"
          readonly="readonly"
        />
      </el-form-item>
      <el-form-item label="隶属门店ID" label-width="120px">
        <el-input
          v-model="user.shopId"
          autocomplete="off"
          readonly="readonly"
        />
      </el-form-item>
      <el-form-item label="员工email" label-width="120px">
        <el-input v-model="user.email" autocomplete="off" readonly="readonly" />
      </el-form-item>
      <el-button type="primary" style="margin-left: 865px" @click="editPerson">修改个人信息</el-button>
    </el-form>
    <!--修改个人信息-->
    <el-dialog title="修改员工(如需修改密码，密码将被重置！)" :visible.sync="dialogFormVisible_edit">
      <el-form style="width: 90%">
        <el-form-item label="员工ID" label-width="120px">
          <el-input v-model="ID2" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="员工name" label-width="120px">
          <el-input v-model="name2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="员工password" label-width="120px">
          <el-input v-model="password2" autocomplete="off" type="password" />
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
        <el-button @click="dialogFormVisible_edit = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      user: {
        ID: '',
        name: '',
        password: '',
        shopId: '',
        email: '',
        position: ''
      },
      dialogFormVisible_edit: false,
      ID2: '',
      name2: '',
      password2: '',
      shopId2: '',
      email2: '',
      position2: ''
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    const { data: res } = await this.$http.get('/emp/' + token)
    // console.log(res)
    this.user.ID = res.data.ID
    this.user.email = res.data.email
    this.user.name = res.data.name
    this.user.password = res.data.password
    this.user.position = res.data.position
    this.user.shopId = res.data.shopId
  },
  methods: {
    editPerson() {
      this.dialogFormVisible_edit = true
      this.ID2 = this.user.ID
      this.name2 = this.user.name
      this.password2 = this.user.password
      this.shopId2 = this.user.shopId
      this.email2 = this.user.email
      this.position2 = this.user.position
    },
    sureEdit() {
      const suc = axios.put('/emp', {
        name: this.name2,
        password: this.password2, // 待修改
        position: this.position2,
        shopId: this.shopId2,
        email: this.email2,
        ID: this.ID2
      })
      suc.then((res) => {
        if (res.data.flag) {
          this.dialogFormVisible_edit = false
          this.$message({ message: '修改成功！', type: 'success' })
          location.reload()
        }
      })
    }
  }
}
</script>

<style></style>
