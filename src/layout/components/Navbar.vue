<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" alt="">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/date">
            <el-dropdown-item divided>
              <el-button style="width: 150px"> 首页 </el-button>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <el-button style="width: 150px" @click="aboutStore">关于门店规则</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <el-button style="width: 150px" @click="aboutEmp">关于自己的偏好</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <el-button style="display: block;width: 150px" @click="logout_">退出</el-button>
          </el-dropdown-item>
          <!--          <el-button divided @click="aboutStore">关于门店规则</el-button>-->
          <!--          <el-button divided @click="aboutEmp">关于自己的偏好</el-button>-->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--查看排班规则-->
    <el-dialog title="排班规则详情" :visible.sync="dialogFormVisible_aboutStore">
      <el-form style="width: 90%">
        <el-form-item label="门店ID" label-width="260px">
          <el-input v-model="shopId" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="没有客流量时需要人数" label-width="260px">
          <el-input v-model="defaultNum" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="关店准备需要时间" label-width="260px">
          <el-input v-model="endNeedTime" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="门店关闭所需要的人数的第一个数字" label-width="260px">
          <el-input v-model="offShopNumOne" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="门店关闭所需要的人数的第二个数字" label-width="260px">
          <el-input v-model="offShopNumTwo" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="开店准备需要的时间" label-width="260px">
          <el-input v-model="preNeedTime" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="预测客流量" label-width="260px">
          <el-input v-model="predictNum" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="门店开始准备所需要人数" label-width="260px">
          <el-input v-model="startNeedPeoNum" autocomplete="off" readonly="readonly" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="editStoreRule">修 改</el-button>
        <el-button @click="dialogFormVisible_aboutStore = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--    修改排版规则-->
    <el-dialog title="修改排班规则" :visible.sync="dialogFormVisible_editStore">
      <el-form style="width: 100%">
        <el-form-item label="门店ID" label-width="260px">
          <el-input v-model="shopId2" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="没有客流量时需要人数" label-width="260px">
          <el-input v-model="defaultNum2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="关店准备需要时间" label-width="260px">
          <el-input v-model="endNeedTime2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="门店关闭所需要的人数的第一个数字" label-width="260px">
          <el-input v-model="offShopNumOne2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="门店关闭所需要的人数的第二个数字" label-width="260px">
          <el-input v-model="offShopNumTwo2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="开店准备需要的时间" label-width="260px">
          <el-input v-model="preNeedTime2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="预测客流量" label-width="260px">
          <el-input v-model="predictNum2" autocomplete="off" />
        </el-form-item>
        <el-form-item label="门店开始准备所需要人数" label-width="260px">
          <el-input v-model="startNeedPeoNum2" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SureEditStoreRule">确 定</el-button>
        <el-button @click="dialogFormVisible_editStore = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogFormVisible_tipEdit">
      <el-form style="width: 90%">
        <el-form-item label="是否确认修改" label-width="100px" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_tipEdit = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!--    员工偏好信息显示-->
    <el-dialog title="我的偏好信息" :visible.sync="dialogFormVisible_aboutPrefer">
      <el-form style="width: 90%">
        <el-form-item label="员工ID" label-width="260px">
          <el-input v-model="empId" autocomplete="off" :readonly="true" />
        </el-form-item>
        <el-form-item label="工作日偏好" label-width="260px">
          <el-select v-model="workDay_1" style="width: 100px" :disabled="true">
            <el-option
              v-for="item in options"
              :key="item.value"
              ref="op"
              :label="item.label"
              :value="item.value"
              readonly="readonly"
            />
          </el-select>
          到
          <!--          placeholder="请选择"-->
          <el-select v-model="workDay_2" style="width: 100px" :disabled="true">
            <el-option
              v-for="item in options"
              :key="item.value"
              ref="op"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工作时间偏好(时)" label-width="260px">
          <!--          <el-input v-model="workHour_1" autocomplete="off" readonly="readonly" />-->
          <!--          <el-input v-model="workHour_2" autocomplete="off" readonly="readonly" />-->
          <el-time-select
            v-model="startTime"
            style="width: 118px"
            :disabled="true"
            placeholder="起始时间"
            :picker-options="{
              start: '06:00',
              step: '00:15',
              end: '19:30'
            }"
          />
          到
          <el-time-select
            v-model="endTime"
            style="width: 118px"
            :disabled="true"
            placeholder="结束时间"
            :picker-options="{
              start: '06:15',
              step: '00:15',
              end: '24:00',
              minTime: startTime
            }"
          />
        </el-form-item>
        <el-form-item label="每天班次时长偏好(时)" label-width="260px">
          <el-input v-model="everydayTime" autocomplete="off" :readonly="true" />
        </el-form-item>
        <el-form-item label="每周班次时长偏好(时)" label-width="260px">
          <el-input v-model="everyWeekTime" autocomplete="off" :readonly="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="editEmpPrefer">修 改</el-button>
        <el-button @click="dialogFormVisible_aboutPrefer = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--    修改员工偏好-->
    <el-dialog title="修改我的偏好" :visible.sync="dialogFormVisible_editPrefer">
      <el-form style="width: 90%">
        <el-form-item label="员工ID" label-width="260px">
          <el-input v-model="empId" autocomplete="off" :readonly="true" @change="change_1" />
        </el-form-item>
        <el-form-item label="工作日偏好" label-width="260px">
          <el-select v-model="workDay_1_" style="width: 100px">
            <el-option
              v-for="item in options"
              :key="item.value"
              ref="op"
              :label="item.label"
              :value="item.value"
              readonly="readonly"
            />
          </el-select>
          到
          <!--          placeholder="请选择"-->
          <el-select v-model="workDay_2_" style="width: 100px" @change="change_1">
            <el-option
              v-for="item in options"
              :key="item.value"
              ref="op"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工作时间偏好" label-width="260px">
          <el-time-select
            v-model="startTime_"
            style="width: 118px"
            placeholder="起始时间"
            :picker-options="{
              start: '06:00',
              step: '00:15',
              end: '19:30'
            }"
            @change="change_2"
          />
          到
          <el-time-select
            v-model="endTime_"
            style="width: 118px"
            placeholder="结束时间"
            :picker-options="{
              start: '06:15',
              step: '00:15',
              end: '24:00',
              minTime: startTime
            }"
            @change="change_2"
          />
        </el-form-item>
        <el-form-item label="每天班次时长偏好(时)" label-width="260px">
          <el-input v-model="everydayTime_" autocomplete="off" @change="change_3" />
        </el-form-item>
        <el-form-item label="每周班次时长偏好(时)" label-width="260px">
          <el-input v-model="everyWeekTime_" autocomplete="off" @change="change_4" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-edit" @click="sureEditEmpPrefer">确 定</el-button>
        <el-button @click="dialogFormVisible_editPrefer = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import axios from 'axios'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      // week: ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      options: [
        {
          value: '1',
          label: '周一'
        },
        {
          value: '2',
          label: '周二'
        },
        {
          value: '3',
          label: '周三'
        },
        {
          value: '4',
          label: '周四'
        },
        {
          value: '5',
          label: '周五'
        },
        {
          value: '6',
          label: '周六'
        },
        {
          value: '7',
          label: '周日'
        }
      ],
      empId: '', // 员工偏好中绑定的员工Id
      workDay_1: '', // 员工偏好开始工作日
      workDay_2: '', // 员工偏好结束工作日
      dialogFormVisible_aboutPrefer: false, // 员工偏好弹窗
      startTime: '', // 员工偏好开始时间
      endTime: '', // 员工偏好结束时间
      everydayTime: '', // 每天时长偏好
      everyWeekTime: '', // 每周时长偏好
      emp_pre_preferType: '', // 存储读取到的偏好类型
      emp_pre_preferValue: '', // 存储读取到的偏好值
      // 修改员工偏好所用到的绑定值
      workDay_1_: '', // 员工偏好开始工作日
      workDay_2_: '', // 员工偏好结束工作日
      dialogFormVisible_editPrefer: false, // 修改员工偏好弹窗
      startTime_: '', // 员工偏好开始时间
      endTime_: '', // 员工偏好结束时间
      everydayTime_: '', // 每天时长偏好
      everyWeekTime_: '', // 每周时长偏好
      // dialogFormVisible_editPrefer_1: false,
      // dialogFormVisible_editPrefer_2: false,
      // dialogFormVisible_editPrefer_3: false,
      // dialogFormVisible_editPrefer_4: false,
      // prefer_value_1_: '',
      // prefer_value_1_1_: '',
      // prefer_value_2_: '',
      // prefer_value_2_1_: '',
      // prefer_value_3_: '',
      // prefer_value_4_: '',
      //
      //
      // prefer_type: '',
      // edit_type: '',
      // dialogFormVisible_editPrefer: false,
      // emp_id: '',
      // dialogFormVisible_1: false, // 类型一
      // dialogFormVisible_2: false, // 类型二
      // dialogFormVisible_3: false, // 类型三
      // dialogFormVisible_4: false, // 类型四
      state: '',
      tokenShopID: '',
      dialogFormVisible_aboutStore: false,
      dialogFormVisible_editStore: false,
      dialogFormVisible_tipEdit: false,
      shopId: '',
      defaultNum: '',
      endNeedTime: '',
      offShopNumOne: '',
      offShopNumTwo: '',
      preNeedTime: '',
      predictNum: '',
      startNeedPeoNum: '',
      shopId2: '',
      defaultNum2: '',
      endNeedTime2: '',
      offShopNumOne2: '',
      offShopNumTwo2: '',
      preNeedTime2: '',
      predictNum2: '',
      startNeedPeoNum2: '',
      token_emp_id: '',
      type_1: {
        type: 1,
        start: '',
        end: ''
      },
      type_2: {
        type: 2,
        start: '',
        end: ''
      },
      type_3: {
        type: 3,
        time: ''
      },
      type_4: {
        type: 4,
        time: ''
      }
      //
      //
      // prefer_type_1: '',
      // // prefer_type_num: '',
      // prefer_value_1: '',
      // prefer_value_1_1: '',
      // //
      // //
      // prefer_type_2: '',
      // prefer_value_2: '',
      // prefer_value_2_1: '',
      // //
      // //
      // prefer_type_3: '',
      // prefer_value_3: '',
      // //
      // //
      // prefer_type_4: '',
      // prefer_value_4: ''
      // prefer_value_mean: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar'])
  },
  async created() {
    const token = localStorage.getItem('token')
    const { data: res } = await this.$http.get('/emp/' + token)
    this.tokenShopID = res.data.shopId
    this.token_emp_id = res.data.ID
    // console.log(this.emp_id)
  },
  mounted() {
    // console.log(this.exchange_('周一', '周三'))
  },
  methods: {
    change_1() {
      this.type_1.start = this.workDay_1_
      this.type_1.end = this.workDay_2_
    },
    change_2() {
      this.type_2.start = this.startTime_
      this.type_2.end = this.endTime_
    },
    change_3() {
      this.type_3.time = this.everydayTime_
    },
    change_4() {
      this.type_4.time = this.everyWeekTime_
    },
    // 确定修改员工偏好按钮
    sureEditEmpPrefer() {
      // if (this.)
      const suc = this.$http.put('/empPrefer', [{
        empId: this.empId,
        preferType: this.type_1.type,
        preferValue: this.type_1.start + ',' + this.type_1.end
      },
      {
        empId: this.empId,
        preferType: this.type_2.type,
        preferValue: this.type_2.start + '-' + this.type_2.end
      },
      {
        empId: this.empId,
        preferType: this.type_3.type,
        preferValue: this.type_3.time
      },
      {
        empId: this.empId,
        preferType: this.type_4.type,
        preferValue: this.type_4.time
      }
      ])
      suc.then((res) => {
        if (res.data.flag) {
          this.dialogFormVisible_aboutPrefer = false
          this.dialogFormVisible_editPrefer = false
          this.$message({ message: '修改成功！', type: 'success' })
          location.reload()
        }
      })
    },
    // 修改员工偏好按钮
    editEmpPrefer() {
      this.dialogFormVisible_editPrefer = true
      this.workDay_1_ = this.workDay_1
      this.workDay_2_ = this.workDay_2
      this.startTime_ = this.startTime
      this.endTime_ = this.endTime
      this.everydayTime_ = this.everydayTime
      this.everyWeekTime_ = this.everyWeekTime
    },
    // 退出按钮
    logout_() {
      this.$router.push('/login')
      localStorage.removeItem('token')
    },
    // exchange_(a, b) {
    //   const num1 = this.week.indexOf(a)
    //   const num2 = this.week.indexOf(b)
    //   return num1 + ',' + num2
    // },
    // editPreferValue_1() {
    //   const suc = this.$http.put('/empPrefer', [{
    //     empId: this.emp_id,
    //     preferType: parseInt(this.prefer_type),
    //     preferValue: this.exchange_(this.prefer_value_1_, this.prefer_value_1_1_)
    //   }])
    //   suc.then((res) => {
    //     if (res.data.flag) {
    //       this.dialogFormVisible_editPrefer_1 = false
    //       this.dialogFormVisible_editPrefer = false
    //       this.$message({ message: '修改成功！', type: 'success' })
    //       location.reload()
    //     }
    //   })
    // },
    // editPreferValue_2() {
    //   const prefer_value_1_ = this.prefer_value_2_
    //   const prefer_value_1_1_ = this.prefer_value_2_1_
    //   const value = prefer_value_1_.toString() + '-' + prefer_value_1_1_.toString()
    //   // console.log(value)
    //   const suc = this.$http.put('/empPrefer', [{
    //     empId: this.emp_id,
    //     preferType: parseInt(this.prefer_type),
    //     preferValue: value
    //   }])
    //   suc.then((res) => {
    //     if (res.data.flag) {
    //       this.dialogFormVisible_editPrefer_2 = false
    //       this.dialogFormVisible_editPrefer = false
    //       this.$message({ message: '修改成功！', type: 'success' })
    //       location.reload()
    //     }
    //   })
    // },
    // editPreferValue_3() {
    //   const suc = this.$http.put('/empPrefer', [{
    //     empId: this.emp_id,
    //     preferType: parseInt(this.prefer_type),
    //     preferValue: this.prefer_value_3_
    //   }])
    //   suc.then((res) => {
    //     if (res.data.flag) {
    //       this.dialogFormVisible_editPrefer_3 = false
    //       this.dialogFormVisible_editPrefer = false
    //       this.$message({ message: '修改成功！', type: 'success' })
    //       location.reload()
    //     }
    //   })
    // },
    // editPreferValue_4() {
    //   const suc = this.$http.put('/empPrefer', [{
    //     empId: this.emp_id,
    //     preferType: parseInt(this.prefer_type),
    //     preferValue: this.prefer_value_4_
    //   }])
    //   suc.then((res) => {
    //     if (res.data.flag) {
    //       this.dialogFormVisible_editPrefer_4 = false
    //       this.dialogFormVisible_editPrefer = false
    //       this.$message({ message: '修改成功！', type: 'success' })
    //       location.reload()
    //     }
    //   })
    // },
    // editPreferValue() {
    //   // console.log(this.prefer_type)
    //   if (this.prefer_type === '1') {
    //     this.dialogFormVisible_editPrefer_1 = true
    //   }
    //   if (this.prefer_type === '2') {
    //     this.dialogFormVisible_editPrefer_2 = true
    //   }
    //   if (this.prefer_type === '3') {
    //     this.dialogFormVisible_editPrefer_3 = true
    //   }
    //   if (this.prefer_type === '4') {
    //     this.dialogFormVisible_editPrefer_4 = true
    //   }
    // },
    // async workdays() {
    //   // eslint-disable-next-line no-empty
    //   for (let i = 1; i < 8; i++) {
    //     const emp_pre = await axios.get('/empPrefer/' + this.token_emp_id)
    //     // eslint-disable-next-line no-sequences
    //     console.log(emp_pre.data.data[0])
    //     this.emp_id = emp_pre.data.data[0].empId
    //   }
    // },
    // editPrefer() {
    //   this.dialogFormVisible_editPrefer = true
    // },
    async aboutEmp() {
      const emp_pre = await axios.get('/empPrefer/' + this.token_emp_id)
      console.log(emp_pre)
      if(emp_pre.data.data == null){
        alert('当前员工没有偏好！')
        return
      }
      this.dialogFormVisible_aboutPrefer = true
      this.empId = emp_pre.data.data[0].empId
      // eslint-disable-next-line no-unused-vars
      // let emp_pre_preferType = null
      for (let i = 0; i < 4; i++) {
        this.emp_pre_preferType = emp_pre.data.data[i].preferType
        this.emp_pre_preferValue = emp_pre.data.data[i].preferValue
        // console.log(this.emp_pre_preferType)
        // 类型一
        if (this.emp_pre_preferType === 1) {
          const index = this.emp_pre_preferValue.split(',')
          // console.log(emp_pre.data.data[1])
          // console.log(index)
          this.workDay_1 = index[0]
          this.workDay_2 = index[1]
        }
        // 类型二
        if (this.emp_pre_preferType === 2) {
          const time = this.emp_pre_preferValue.split('-')
          this.startTime = time[0]
          this.endTime = time[1]
        }
        // 类型三
        if (this.emp_pre_preferType === 3) {
          this.everydayTime = this.emp_pre_preferValue
        }
        // 类型三
        if (this.emp_pre_preferType === 4) {
          this.everyWeekTime = this.emp_pre_preferValue
        }
      }
      //   // console.log(11111))
      // 类型一
      // if (emp_pre.data.data[0].preferType === 1) {
      //   // console.log(11111)
      //   // const val = 1
      //   // console.log(val.toString())
      //   this.dialogFormVisible_1 = true
      //   this.prefer_type_1 = '工作日偏好'
      //   // this.prefer_value_1
      //   // this.prefer_value_1_1
      //   // emp_pre.data.data[0].preferValue.split(',')
      //   const index = emp_pre.data.data[0].preferValue.split(',')
      //   this.prefer_value_1 = this.week[index[0]]
      //   this.prefer_value_1_1 = this.week[index[1]]
      // }
      // // 类型二
      // if (emp_pre.data.data[0].preferType === 2) {
      //   this.dialogFormVisible_2 = true
      //   this.prefer_type_2 = '工作时长偏好'
      //   const time = emp_pre.data.data[0].preferValue.split('-')
      //   this.prefer_value_2 = time[0]
      //   this.prefer_value_2_1 = time[1]
      // }
      // // 类型三
      // if (emp_pre.data.data[0].preferType === 3) {
      //   this.dialogFormVisible_3 = true
      //   this.prefer_type_3 = '班次时长偏好（每天）'
      //   this.prefer_value_3 = emp_pre.data.data[0].preferValue
      // }
      // // 类型三
      // if (emp_pre.data.data[0].preferType === 4) {
      //   this.dialogFormVisible_4 = true
      //   this.prefer_type_4 = '班次时长偏好（每周）'
      //   this.prefer_value_4 = emp_pre.data.data[0].preferValue
      // }
      // console.log()
      // if(emp_pre.data.data.preferType)
    },
    sureEdit() {
      const mess = axios.put('/rule', {
        shopId: this.shopId2,
        defaultNum: this.defaultNum2,
        endNeedTime: this.endNeedTime2,
        offShopNumOne: this.offShopNumOne2,
        offShopNumTwo: this.offShopNumTwo2,
        preNeedTime: this.preNeedTime2,
        predictNum: this.predictNum2,
        startNeedPeoNum: this.startNeedPeoNum2
      })
      mess.then((res) => {
        if (res.data.flag) {
          this.dialogFormVisible1 = false
          this.$message({ message: '修改成功！', type: 'success' })
          location.reload()
        }
      })
      this.dialogFormVisible_aboutStore = false
      this.dialogFormVisible_editStore = false
      this.dialogFormVisible_tipEdit = false
    },
    SureEditStoreRule() {
      this.dialogFormVisible_tipEdit = true
    },
    editStoreRule() {
      this.dialogFormVisible_editStore = true
      this.shopId2 = this.shopId
      this.defaultNum2 = this.defaultNum
      this.endNeedTime2 = this.endNeedTime
      this.offShopNumOne2 = this.offShopNumOne
      this.offShopNumTwo2 = this.offShopNumTwo
      this.preNeedTime2 = this.preNeedTime
      this.predictNum2 = this.predictNum
      this.startNeedPeoNum2 = this.startNeedPeoNum
    },
    async aboutStore() {
      this.dialogFormVisible_aboutStore = true
      const test = await axios.get('/rule/' + this.tokenShopID)
      console.log(test)
      this.shopId = test.data.data.shopId
      this.defaultNum = test.data.data.defaultNum
      this.endNeedTime = test.data.data.endNeedTime
      this.offShopNumOne = test.data.data.offShopNumOne
      this.offShopNumTwo = test.data.data.offShopNumTwo
      this.preNeedTime = test.data.data.preNeedTime
      this.predictNum = test.data.data.predictNum
      this.startNeedPeoNum = test.data.data.startNeedPeoNum
      // this.shopId = res.data.shopId
      // console.log(res.data)
      // console.log(shopId)
      // console.log(test)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
    // async logout() {
    //   await this.$store.dispatch('user/logout')
    //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    // }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
