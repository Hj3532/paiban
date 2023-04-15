<template>
  <div class="navbar" style="background-color: #F6FAFD;border-radius: 15px">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-button class="avatar-container" @click="showLogo">
        <div class="avatar-wrapper">
          <!--          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" alt="">-->
          <img src="../../icons/svg/setting.png" class="user-avatar" alt="">
          <!--          <i class="el-icon-caret-bottom" />-->
        </div>
      </el-button>
    </div>
    <!--    右上角logo-->
    <el-dialog :visible.sync="dialogFormVisible_logo" title="个人中心">
      <!--      <div style="border-radius: 60px">-->
      <!--        <el-button icon="el-icon-s-custom" style="width: 150px;height:150px;border-radius: 60px;margin-left: 50px;margin-top: 40px" @click="showPrivacy">-->
      <!--          个人信息-->
      <!--          <h1 style="font-size: 0.175em">ID、姓名、邮箱等</h1>-->
      <!--        </el-button>-->
      <!--        <el-button-->
      <!--          icon="el-icon-s-tools"-->
      <!--          style="width: 150px;height:150px;-->
      <!--        border-radius: 60px;margin-left: 45px;margin-top: 40px"-->
      <!--          @click="aboutStore"-->
      <!--        >-->
      <!--          关于门店规则-->
      <!--          <h1 style="font-size: 0.175em">客流量、准备时间等</h1>-->
      <!--        </el-button>-->
      <!--        <el-button icon="el-icon-edit" style="width: 150px;height:150px;border-radius: 60px;margin-left: 40px;margin-top: 40px" @click="aboutEmp">-->
      <!--          关于自己的偏好-->
      <!--          <h1 style="font-size: 0.175em">班次偏好、时长偏好等</h1>-->
      <!--        </el-button>-->
      <!--        <el-button style="display: block;width: 150px;border-radius: 60px;margin-left: 250px;margin-top: 40px" @click="logout_">退出</el-button>-->
      <!--      </div>-->
      <div style="border-radius: 60px">
        <el-button icon="el-icon-s-custom" style="width: 150px;height:150px;border-radius: 60px;margin-left: 50px;margin-top: 40px" @click="showPrivacy">
          个人信息
          <h1 style="font-size: 0.175em">ID、姓名、邮箱等</h1>
        </el-button>
        <el-button
          icon="el-icon-s-tools"
          style="width: 150px;height:150px;
        border-radius: 60px;margin-left: 45px;margin-top: 40px"
          @click="aboutStore"
        >
          关于门店规则
          <h1 style="font-size: 0.175em">客流量、准备时间等</h1>
        </el-button>
        <el-button icon="el-icon-edit" style="width: 150px;height:150px;border-radius: 60px;margin-left: 40px;margin-top: 40px" @click="aboutEmp">
          关于自己的偏好
          <h1 style="font-size: 0.175em">班次偏好、时长偏好等</h1>
        </el-button>
        <el-button style="display: block;width: 150px;border-radius: 60px;margin-left: 250px;margin-top: 40px" @click="logout_">退出</el-button>
      </div>
    </el-dialog>
    <!--查看排班规则-->
    <el-dialog title="排班规则详情" :visible.sync="dialogFormVisible_aboutStore">
      <el-form style="width: 90%">
        <el-form-item label="门店ID" label-width="260px">
          <el-input v-model="shopId" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="门店排班方式" label-width="260px">
          <el-input v-model="ways" autocomplete="off" readonly="readonly" />
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
        <el-form-item label="开店前准备需要的员工类型" label-width="260px">
          <el-input v-model="startShopEmp" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="关店需要的员工类型" label-width="260px">
          <el-input v-model="endShopEmp" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="平时工作需要的员工类型" label-width="260px">
          <el-input v-model="routineEmp" autocomplete="off" readonly="readonly" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="ifStore" type="primary" icon="el-icon-edit" @click="editStoreRule">修 改</el-button>
        <el-button @click="dialogFormVisible_aboutStore = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--    修改排版规则-->
    <el-dialog title="修改排班规则" :visible.sync="dialogFormVisible_editStore">
      <el-form style="width: 100%">
        <el-form-item label="门店ID" label-width="260px">
          <el-input v-model="shopId2" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="门店排班方式" label-width="260px">
          <!--          <el-input v-model="ways2" autocomplete="off" readonly="readonly" />-->
          <el-select v-model="ways2">
            <el-option
              v-for="item in option_ways"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <el-form-item label="开店前准备需要的员工类型" label-width="260px">
          <el-select v-model="startShopEmp2" style="width: 100px">
            <el-option
              v-for="item in empTypes"
              :key="item.value"
              ref="op"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关店需要的员工类型" label-width="260px">
          <el-select v-model="endShopEmp2" style="width: 100px">
            <el-option
              v-for="item in empTypes"
              :key="item.value"
              ref="op"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平时工作需要的员工类型" label-width="260px">
          <el-select v-model="routineEmp2" style="width: 100px">
            <el-option
              v-for="item in empTypes"
              :key="item.value"
              ref="op"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
              minTime: startTime_
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
    <!--     个人信息-->
    <el-dialog title="个人信息" :visible.sync="dialogFormVisible_privacy">
      <el-form style="width: 70%;margin-left: 80px">
        <el-form-item label="员工ID" label-width="120px">
          <el-input v-model="user.ID" autocomplete="off" readonly="readonly" style="text-align: center" />
        </el-form-item>
        <el-form-item label="员工name" label-width="120px">
          <el-input v-model="user.name" autocomplete="off" readonly="readonly" style="text-align: center" />
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editPerson">修改个人信息</el-button>
        <el-button @click="dialogFormVisible_privacy = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--修改个人信息-->
    <el-dialog title="修改员工(如需修改密码，密码将被重置！)" :visible.sync="dialogFormVisible_edit">
      <el-form style="width: 90%">
        <el-form-item label="员工ID" label-width="120px">
          <el-input v-model="ID_edit" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="员工name" label-width="120px">
          <el-input v-model="name_edit" autocomplete="off" />
        </el-form-item>
        <el-form-item label="员工password" label-width="120px">
          <el-input v-model="password_edit" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item label="员工position" label-width="120px">
          <el-input v-model="position_edit" autocomplete="off" />
        </el-form-item>
        <el-form-item label="隶属门店ID" label-width="120px">
          <el-input v-model="shopId_edit" autocomplete="off" readonly="readonly" />
        </el-form-item>
        <el-form-item label="员工email" label-width="120px">
          <el-input v-model="email_edit" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_edit = false">取 消</el-button>
        <el-button type="primary" @click="sureEditPrivacy">确 定</el-button>
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
      ifStore: true,
      dialogFormVisible_logo: false,
      dialogFormVisible_edit: false,
      ID_edit: '',
      name_edit: '',
      password_edit: '',
      shopId_edit: '',
      email_edit: '',
      position_edit: '',
      user: {
        ID: '',
        name: '',
        password: '',
        shopId: '',
        email: '',
        position: ''
      },
      dialogFormVisible_privacy: false,
      empTypes: [
        {
          value: '清洁员',
          label: '清洁员'
        },
        {
          value: '收银员',
          label: '收银员'
        },
        {
          value: '普通员工',
          label: '普通员工'
        }
      ],
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
      state: '',
      tokenShopID: '',
      dialogFormVisible_aboutStore: false,
      dialogFormVisible_editStore: false,
      dialogFormVisible_tipEdit: false,
      // 排班方式
      option_ways: [{
        value: '1',
        label: '单人排班'
      },
      {
        value: '2',
        label: '多人排班'
      }],
      shopId: '',
      ways: '', // 排班方式
      defaultNum: '',
      endNeedTime: '',
      offShopNumOne: '',
      offShopNumTwo: '',
      preNeedTime: '',
      predictNum: '',
      startNeedPeoNum: '',
      startShopEmp: '',
      endShopEmp: '',
      routineEmp: '',
      //
      //
      shopId2: '',
      ways2: '',
      defaultNum2: '',
      endNeedTime2: '',
      offShopNumOne2: '',
      offShopNumTwo2: '',
      preNeedTime2: '',
      predictNum2: '',
      startNeedPeoNum2: '',
      startShopEmp2: '',
      endShopEmp2: '',
      routineEmp2: '',
      //
      //
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
          this.$http.post('/schedule/refreshSchedule/' + this.shopId).then(() => {
            location.reload()
          })
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
    async aboutEmp() {
      const emp_pre = await axios.get('/empPrefer/' + this.token_emp_id)
      console.log(emp_pre)
      this.empId = emp_pre.data.data[0].empId
      // eslint-disable-next-line no-unused-vars
      // let emp_pre_preferType = null
      if (emp_pre.data.data === null) {
        alert('当前员工没有偏好！')
        return
      }
      this.dialogFormVisible_aboutPrefer = true
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
    },
    sureEdit() {
      const mess = axios.put('/rule', {
        shopId: this.shopId2,
        status: this.ways2,
        defaultNum: this.defaultNum2,
        endNeedTime: this.endNeedTime2,
        offShopNumOne: this.offShopNumOne2,
        offShopNumTwo: this.offShopNumTwo2,
        preNeedTime: this.preNeedTime2,
        predictNum: this.predictNum2,
        startNeedPeoNum: this.startNeedPeoNum2,
        startShopEmp: this.startShopEmp2,
        endShopEmp: this.endShopEmp2,
        routineEmp: this.routineEmp2
      })
      mess.then((res) => {
        if (res.data.flag) {
          this.dialogFormVisible1 = false
          this.$message({ message: '修改成功！', type: 'success' })
          this.$http.post('/schedule/refreshSchedule/' + this.shopId).then(() => {
            location.reload()
          })
          // location.reload()
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
      this.ways2 = this.ways
      this.defaultNum2 = this.defaultNum
      this.endNeedTime2 = this.endNeedTime
      this.offShopNumOne2 = this.offShopNumOne
      this.offShopNumTwo2 = this.offShopNumTwo
      this.preNeedTime2 = this.preNeedTime
      this.predictNum2 = this.predictNum
      this.startNeedPeoNum2 = this.startNeedPeoNum
      this.startShopEmp2 = this.startShopEmp
      this.endShopEmp2 = this.endShopEmp
      this.routineEmp2 = this.routineEmp
    },
    async aboutStore() {
      this.dialogFormVisible_aboutStore = true
      if (this.user.position !== '店长') {
        this.ifStore = false
      }
      const test = await axios.get('/rule/' + this.tokenShopID)
      console.log(test)
      this.shopId = test.data.data.shopId
      if (test.data.data.status === 1) {
        this.ways = '单人排班'
      } else {
        this.ways = '多人排班'
      }
      // this.ways = test.data.data.status
      this.defaultNum = test.data.data.defaultNum
      this.endNeedTime = test.data.data.endNeedTime
      this.offShopNumOne = test.data.data.offShopNumOne
      this.offShopNumTwo = test.data.data.offShopNumTwo
      this.preNeedTime = test.data.data.preNeedTime
      this.predictNum = test.data.data.predictNum
      this.startNeedPeoNum = test.data.data.startNeedPeoNum
      this.startShopEmp = test.data.data.startShopEmp
      this.endShopEmp = test.data.data.endShopEmp
      this.routineEmp = test.data.data.routineEmp
      // this.shopId = res.data.shopId
      // console.log(res.data)
      // console.log(shopId)
      // console.log(test)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    showPrivacy() {
      this.dialogFormVisible_privacy = true
    },
    editPerson() {
      this.dialogFormVisible_edit = true
      this.ID_edit = this.user.ID
      this.name_edit = this.user.name
      this.password_edit = this.user.password
      this.shopId_edit = this.user.shopId
      this.email_edit = this.user.email
      this.position_edit = this.user.position
    },
    sureEditPrivacy() {
      const suc = axios.put('/emp', {
        name: this.name_edit,
        password: this.password_edit, // 待修改
        position: this.position_edit,
        shopId: this.shopId_edit,
        email: this.email_edit,
        ID: this.ID_edit
      })
      suc.then((res) => {
        if (res.data.flag) {
          this.dialogFormVisible_edit = false
          this.$message({ message: '修改成功！', type: 'success' })
          location.reload()
        }
      })
    },
    showLogo() {
      this.dialogFormVisible_logo = true
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
      margin-top: 5px;
      margin-right: 30px;
      height: 40px;
      width: 40px;
      background-color: #F6FAFD ;
      border-radius: 40px;

      .avatar-wrapper {
        margin-top: -12.5px;
        margin-left: -20px;
        width: 40px;
        height: 40px;
        border-radius: 40px;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 40px;
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

