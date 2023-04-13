<template>
  <el-card>
    <!-- 选择门店start -->
    <!--
           v-model的值为当前被选中的el-option的 value 属性值
           change事件  选中值发生变化时触发
      -->
    <div class="select">
      <el-select
        v-model="roomValue"
        placeholder="门店1"
        @change="changeRoom(value)"
      >
        <el-option
          v-for="item in storeLists"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <!-- 选择门店end -->

    <!-- 中间部分start -->
    <div class="middle">
      <div class="fc-left">
        <!-- 月、周、日、今天按钮start -->
        <el-button-group>
          <el-button @click="month"> 月 </el-button>
          <el-button @click="week"> 周 </el-button>
          <el-button @click="day"> 日 </el-button>
          <el-button @click="today"> 今天 </el-button>
        </el-button-group>
        <!-- 月、周、日、今天按钮end -->
        <!-- 按职位分组start -->
        <el-select
          v-model="jobValue"
          placeholder="按职位分组"
          style="float: right"
          @change="jobchange"
        >
          <el-option
            v-for="item in jobList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- 按职位分组end -->
      </div>

      <!-- 时间轮播栏start -->
      <div class="fc-center">
        <!-- 左按钮 -->
        <el-button class="timebutton" icon="el-icon-arrow-left" @click="prev" />
        <!-- 左 -->
        <div class="timecontent" style="text-align: center">
          <h5>周一 ~ 周日</h5>
          <p>{{ prevtitle }}</p>
        </div>
        <!-- 中 -->
        <div
          class="timecontent"
          style="text-align: center; border-bottom: 1.5px solid #00a4ff"
        >
          <h5>周一 ~ 周日</h5>
          <p>{{ title }}</p>
        </div>
        <!-- 右 -->
        <div class="timecontent" style="text-align: center">
          <h5>周一 ~ 周日</h5>
          <p>{{ nexttitle }}</p>
        </div>
        <!-- 右按钮 -->
        <el-button
          class="timebutton"
          icon="el-icon-arrow-right"
          @click="next"
        />
        <div style="float: right">
          <el-button
            v-if="daochu"
            style="color: #00a4ff; font-size: 12px; cursor: pointer"
            @click="port"
          >导出</el-button>
        </div>
      </div>
      <!-- 时间轮播栏end -->
    </div>
    <!-- 中间部分end -->

    <!-- 按钮合集start -->
    <div>
      <div class="button">
        <el-button
          icon="el-icon-edit"
          v-if="!daochu"
          style="border-width: 1.5px; margin-right: 4px"
          @click="addNewInfo()"
        >新增</el-button>
        <el-button
          icon="el-icon-search"
          v-if="!daochu"
          style="border-width: 1.5px; margin-right: 4px"
          @click="search"
        >查询</el-button>
        <el-button
          icon="el-icon-search"
          v-if="!daochu"
          style="border-width: 1.5px; margin-right: 4px"
          @click="change1"
        >交换</el-button>
        <el-button icon="el-icon-search" @click="exchange">切换视图</el-button>
        <el-button type="primary" circle @click="show">排</el-button>
      </div>
    </div>
    <!-- 按钮合集end -->

    <!-- 新增的dialog start -->
    <el-dialog
      title="新增需要的班次"
      :visible.sync="dialogVisible"
      :before-close="close"
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        size="small"
        class="demo-ruleForm"
      >
        <el-form-item label="工作日期" required>
          <el-col :span="10">
            <el-form-item prop="date" style="margin-bottom: 0">
              <el-date-picker
                v-model="form.date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="工作时间" required>
          <el-col :span="10">
            <el-form-item prop="startTime" style="margin-bottom: 0">
              <el-time-select
                v-model="form.startTime"
                placeholder="开始时间"
                :picker-options="{
                  start: '08:00',
                  step: '01:00',
                  end: '24:00 ',
                }"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col
            class="line"
            :span="1"
            style="text-align: center; color: darkgray"
          >
            —
          </el-col>
          <el-col :span="10">
            <el-form-item prop="endTime" style="margin-bottom: 0">
              <el-time-select
                v-model="form.endTime"
                placeholder="结束时间"
                :picker-options="{
                  start: '08:00',
                  step: '01:00',
                  end: '24:00 ',
                  minTime: form.startTime,
                }"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button @click="resetForm('form')">取消</el-button>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增的dialog end -->

    <!-- 日历组件start -->
    <div class="main">
      <FullCalendar
        ref="fullCalendar"
        class="demo-app-calendar"
        :options="calendarOptions"
      >
        <!-- 官网提供的slot:eventContent -->
        <!-- 插槽slot方式,结合element-ui的popover组件 -->
        <template v-slot:eventContent="arg">
          <!-- Popover弹出框 -->
          <!-- v-model控制显示与隐藏 -->
          <el-popover
            placement="top-start"
            title="信息"
            width="200"
            :visible-arrow="false"
            trigger="hover"
          >
            <p class="detail">姓名：{{ arg.event.title }}</p>
            <p class="detail">职务：{{ arg.event.extendedProps.work }}</p>
            <p class="detail">时间：{{ arg.timeText }}</p>
            <el-button
              size="mini"
              style="float: right"
              @click="select(arg.event)"
            >
              指派
            </el-button>
            <el-button
              size="mini"
              style="float: right; margin-right: 5px"
              @click="deleteinfo(arg.event.extendedProps)"
            >
              删除
            </el-button>
            <div slot="reference" class="popper-content">
              <span
                v-if="isshow"
                style="
                  display: block;
                  width:100px;
                  height: 20px;
                  text-align: center;
                  line-height: 20px;
                "
              >{{ arg.timeText }}</span>
              <span ref="aaa">{{ arg.event.title }}</span>
              <span
                v-if="isshow"
                style="
                  display: block;
                  width: 100px;
                  height: 20px;
                  text-align: center;
                  line-height: 20px;
                "
              >职务：{{ arg.event.extendedProps.work }}</span>
            </div>
          </el-popover>
          <!-- v-model控制显示与隐藏
                                    <el-popover placement="left" width="100" v-model="visible">
                <p>确定删除该班次吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="visible = false"
                    >取消</el-button
                  >
                  <el-button type="primary" size="mini"  @click="deleteinfo(arg.event.extendedProps)""
                    >确定</el-button
                  >
                </div>
              </el-popover> -->
        </template>
        <!-- <template v-slot:dayCellContent="arg">
            {{ arg.dayNumberText }}
          </template>
          <template v-slot:resourceLabelContent="arg">
            {{ arg.resource.id }}
          </template> -->
      </FullCalendar>
    </div>
    <!-- 日历组件end-->
    <el-dialog title="可选择的指派人员" :visible.sync="table">
      <el-table :data="recommend" border>
        <el-table-column prop="empId" label="员工ID" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="" label="操作" width="220px" align="center">
          <template slot-scope="scope">
            <el-button
              :ref="'a' + scope.$index"
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="agree(scope.row, scope.$index)"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import _ from 'lodash'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'

let IDD = 0
const clickCount = 0
let change_ = 0
let flag = 0
const prev = '' // 上一次点击的dom节点
export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  props: ['shopid_'],
  data() {
    return {
      daochu: false,
      day_: -2,
      dayid: '',
      classid: '',
      index: '',
      table: false,
      recommend: [],
      id: '',
      changelist: [],
      isshow: false,
      color_: [
        '#6F808E',
        '#80919F',
        '#B6D0E7',
        '#97A0A5',
        '#6F808E',
        '#80919F',
        '#B6D0E7',
        '#97A0A5'
      ],
      dialogVisible: false, // 控制新增弹框显示与隐藏
      // 表单数据对象--新增排班信息会总的提交到form对象上
      form: {
        date: '',
        startTime: '',
        endTime: ''
      },
      // 表单验证规则
      rules: {
        date: [
          { required: true, message: '请选择工作日期', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ]
      },
      visible: false, // popover弹出框显示与隐藏
      // 选择门店start
      storeLists: [
        { value: 1, label: '门店1' },
        { value: 2, label: '门店2' },
        { value: 3, label: '门店3' }
      ], // 门店列表
      roomValue: '', // v-model的值
      value: 1, // 开始显示门店1
      // 选择门店end

      // 选择职位start
      jobList: [
        { value: 0, label: '普通员工' },
        { value: 1, label: '店长' },
        { value: 2, label: '收银员' },
        { value: 3, label: '清洁员' }
      ], // 职位列表
      jobValue: '', // v-model的值
      job: ['普通员工', '店长', '收银员', '清洁员'],
      // 选择职位end
      showFullcalendar: true,
      title: '', // 时间轮播栏中间的title
      prevtitle: '', // 时间轮播栏前一个的title
      nexttitle: '', // 时间轮播栏后一个的title
      all: [],
      all_: [],
      old: [],

      // fullcalendar配置项start
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          interactionPlugin,
          resourceTimelinePlugin
        ],
        initialDate: '2023-05-10', // 默认开始日期
        eventClick: this.handleEventClick,
        select: this.handleDateSelect,
        // stickyFooterScrollbar: true ,
        navLinks: true, // 日历头部是否能点击
        navLinkDayClick: this.tab, // 日历头部点击函数重写
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        slotEventOverlap: false,
        locale: 'zh',
        timeZone: 'UTC',
        firstDay: 1, // 设置一周中显示的第一天是哪天，周日为0，周一为1，类推
        // height: 1337,
        height: 1100,
        timeGridEventMinHeight: '40', // 设置事件的最小高度
        // aspectRatio: 100, // 设置日历单元格宽度与高度的比例。
        eventLimit: true, // 设置月日程，与all-day slot的最大显示数量，超过的通过弹窗显示
        initialView: 'timeGridWeek', // 设置默认显示周，可选日
        editable: true,
        dayMaxEvents: true, // allow "more" link when too many events
        eventDurationEditable: true, // 可以调整事件的时间
        selectable: true, // 日历格子可选择
        nowIndicator: true, // 现在的时间线显示
        eventDisplay: 'block', // 争对全天的情况下，以块状显示
        header: false, // 显示头部的导航栏
        headerToolbar: false,
        selectMirror: false,
        displayEventEnd: true, // like 08:00 - 13:00
        eventsSet: this.handleEvents,
        eventMinHeight: 70, // 事件最小高度
        // eventMinWidth: 550,
        slotMinTime: '07:00:00',
        eventTimeFormat: {
          // like '14:30:00'
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false // 设置时间为24小时
        },
        resources: [],
        events: [],
        // eventColor: "#f08f00",
        allDayText: '全天',
        dateClick: this.handleDateClick,
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        // 切换视图调用的方法
        datesSet() {}
      },
      // fullcalendar配置项start
      calendarApi: null
    }
  },
  // created时就发自动安排的请求
  async created() {
    
    setTimeout(async() => {
       this.roomValue = this.shopid_
       this.getinfo()
       this.getemp()
       setTimeout(()=>{
        this.show()
       },1000)
    }, 1000)
  },
  mounted() {
    setTimeout(() => {
      this.showFullcalendar = false
      this.id = localStorage.getItem('token')
      this.$nextTick(() => {
        this.calendarApi = this.$refs.fullCalendar.getApi()
        this.title = this.calendarApi.view?.title
        this.ptitle()
        this.ntitle()
        this.calendarApi.prev()
      })
    }, 0)
  },

  methods: {
    port() {
      console.log(this.day_)
      const a = 0
      if (this.day_ >= 0) {
        this.$http
          .get('/schedule/getScheduleByName/' + this.shopid_ + '/' + this.day_)
          .then((res) => {
            this.$http({
              url: '/schedule/exportExcel/' + this.shopid_,
              method: 'GET',
              responseType: 'blob'
            }).then((response) => {
              var blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              })
              var url = URL.createObjectURL(blob)
              var a = document.createElement('a')
              a.href = url
              a.download = '工时.xlsx' // 文件名
              a.click()
              URL.revokeObjectURL(url)
            })
          })
      } else {
        alert('无数据')
      }
      return a
    },
    async getemp() {
      const { data: res } = await this.$http.get(
        '/emp/' + this.roomValue + '/1/100'
      )
      console.log('排班第466', res)
      for (let i = 0; i < res.data.records.length; i++) {
        this.calendarOptions.resources.push({
          id: res.data.records[i].ID,
          title: res.data.records[i].name
        })
      }
      this.calendarApi.refetchResources()
    },
    exchange() {
      if (flag === 0) {
        this.calendarApi.changeView('resourceTimelineDay')
        this.title = this.calendarApi.view?.title
        this.ptitle()
        this.ntitle()
        this.calendarApi.prev()
        this.daochu = true
        flag = 1
      } else {
        this.calendarApi.changeView('timeGridWeek')
        this.title = this.calendarApi.view?.title
        this.ptitle()
        this.ntitle()
        this.calendarApi.prev()
        this.daochu = false
        flag = 0
      }
    },
    async getinfo() {
      this.all_.splice(0, this.all_.length)
      this.calendarOptions.events.splice(0, this.calendarOptions.events.length)
      const a = await this.$http.get(`/schedule/${this.roomValue}`)
      console.log(this.calendarApi)
      console.log('这是我获取到的总数据：')
      console.log(a.data.data)
      console.log(a.data.data[0][0].date)
      console.log(
        dayjs(a.data.data[0][0].date).add(1, 'day').format('YYYY-MM-DD') +
        ' ' +
        a.data.data[0][0].startTime
      )
      const b = a.data.data
      let end_ = ''
      for (let i = 0; i < b.length; i++) {
        for (let j = 0; j < b[i].length; j++) {
          for (let m = 0; m < b[i][j].clazzForEmpList.length; m++) {
            if (
              b[i][j].clazzForEmpList[m].endTime === '00:00:00' ||
              b[i][j].clazzForEmpList[m].endTime === '01:00:00'
            ) {
              end_ =
                dayjs(b[i][j].clazzForEmpList[m].date)
                  .add(1, 'day')
                  .format('YYYY-MM-DD') +
                ' ' +
                b[i][j].clazzForEmpList[m].endTime
            } else {
              end_ =
                dayjs(b[i][j].clazzForEmpList[m].date).format('YYYY-MM-DD') +
                ' ' +
                b[i][j].clazzForEmpList[m].endTime
            }
            if (b[i][j].clazzForEmpList[m].empId) {
              this.all_.push({
                id: b[i][j].clazzForEmpList[m].empId,
                title: b[i][j].clazzForEmpList[m].name,
                work: b[i][j].clazzForEmpList[m].position,
                start:
                  dayjs(b[i][j].clazzForEmpList[m].date).format('YYYY-MM-DD') +
                  ' ' +
                  b[i][j].clazzForEmpList[m].startTime,
                end: end_,
                dayId: b[i][j].dayId,
                clazzId: b[i][j].clazzId,
                index: m,
                clazzForEmpId: b[i][j].clazzForEmpList[m].clazzForEmpId,
                resourceId: b[i][j].clazzForEmpList[m].empId,
                backgroundColor: this.color_[j % 8]
              })
            } else {
              this.all_.push({
                // id: b[i][j].clazzForEmpList[m].empId,
                title: b[i][j].clazzForEmpList[m].name,
                // work: b[i][j].clazzForEmpList[m].position,
                start:
                  dayjs(b[i][j].date).format('YYYY-MM-DD') +
                  ' ' +
                  b[i][j].startTime,
                end:
                  dayjs(b[i][j].date).format('YYYY-MM-DD') + ' ' + b[i][j].end,
                dayId: b[i][j].dayId,
                index: m,
                clazzForEmpId: b[i][j].clazzForEmpList[m].clazzForEmpId,
                clazzId: b[i][j].clazzId,
                backgroundColor: this.color_[j % 8]
              })
            }
          }
        }
      }
    },
    // 日历的单元格点击事件
    handleEventClick(info) {
      console.log(this.calendarApi.getEvents())
      if (change_ == 0) {
        if (info.event.id !== this.id) {
          this.$message({
            message: '请先选择你自己的班次',
            type: 'error'
          })
          return
        }
      }
      if (change_ == 3) {
        this.changelist.splice(1, 1)
        change_ = 1
      }
      this.changelist.push(info.event)
      change_++
      this.change1()
    },
    // 交换
    async change1() {
      if (change_ == 0) {
        this.$message({
          message: '请选择你要交换的班次',
          type: 'success'
        })
      } else if (change_ == 1) {
        this.$message({
          message: '请选择你想要和谁交换哪个班次',
          type: 'success'
        })
      } else if (change_ == 2) {
        this.$message({
          message: '请点击交换按钮',
          type: 'success'
        })
        change_++
      } else {
        change_ = 0
        console.log(this.changelist[0].start)
        console.log(
          dayjs(this.changelist[0].start)
            .subtract(8, 'h')
            .format('YYYY-MM-DD HH-mm-ss')
        )
        const a = await this.$http.post('/apply/applyExchange', {
          applyExchange: {
            exchangeDate: dayjs(this.changelist[0].start)
              .subtract(8, 'h')
              .format('YYYY-MM-DD H:mm:ss')
              .split(' ')[0],
            exchangedDate: dayjs(this.changelist[1].start)
              .subtract(8, 'h')
              .format('YYYY-MM-DD H:mm:ss')
              .split(' ')[0],
            exchangeEndTime: dayjs(this.changelist[0].end)
              .subtract(8, 'h')
              .format('YYYY-MM-DD H:mm:ss')
              .split(' ')[1],
            exchangeId: parseInt(this.changelist[0].id),
            exchangeStartTime: dayjs(this.changelist[0].start)
              .subtract(8, 'h')
              .format('YYYY-MM-DD H:mm:ss')
              .split(' ')[1],
            exchangedEndTime: dayjs(this.changelist[1].end)
              .subtract(8, 'h')
              .format('YYYY-MM-DD H:mm:ss')
              .split(' ')[1],
            exchangedId: parseInt(this.changelist[1].id),
            exchangedStartTime: dayjs(this.changelist[1].start)
              .subtract(8, 'h')
              .format('YYYY-MM-DD H:mm:ss')
              .split(' ')[1]
          },
          exchangeMsg: {
            shopId: this.value,
            dayIdOne: this.changelist[0].extendedProps.dayId,
            clazzIdOne: this.changelist[0].extendedProps.clazzId,
            empIdOne: this.changelist[0].extendedProps.clazzForEmpId,
            dayIdTwo: this.changelist[1].extendedProps.dayId,
            clazzIdTwo: this.changelist[1].extendedProps.clazzId,
            empIdTwo: this.changelist[1].extendedProps.clazzForEmpId
          }
        })
        console.log(a.data)
        if (a.data.flag) {
          // this.clear()
          // this.getinfo()
          this.changelist.splice(0, this.changelist.length)
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        }
      }
    },
    // 新增班次提交数据
    submitForm() {
      // 上交日历的配置项events
      const { startTime, endTime, date } = this.form
      const newhours = parseInt(endTime) - parseInt(startTime)
      const newstartTime = startTime + ':00'
      const newendTime = endTime + ':00'
      const newdate = date + 'T16'
      const dayid = 0
      console.log(parseInt(endTime) - parseInt(startTime))
      console.log(endTime + ':00')
      console.log(startTime + ':00')
      console.log(date + 'T16')
      // 上交服务器
      const sub = axios.post(`/addClazz/${this.value}/${dayid}`, {
        startTime: newstartTime,
        endTime: newendTime,
        date: newdate,
        hours: newhours
      })
      sub.then((res) => {
        if (res.data.flag) {
          this.dialogVisible = false
          this.$message({ message: '新增班次成功！', type: 'success' })
          this.show() // 重新加载数据
          location.reload() // 刷新页面
        }
      })
    },

    // 新增班次取消按钮
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },

    // 新增班次 关闭弹窗，重置表单
    close() {
      this.dialogVisible = false
      this.$refs['form'].resetFields()
    },

    // 删除排班信息事件
    async deleteinfo(info) {
      this.visible = false
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      const a = await this.$http.delete(
        `/schedule/${this.value}/${info.dayId}/${info.clazzId}`
      )
      this.show() // 重新加载数据
      // location.reload(); //刷新页面
    },
    // 指派功能开始(新增，与小黄版本不同)
    async select(info) {
      console.log(info)
      console.log('shop', this.shopid_)
      if (info.id) {
        console.log(111)
      } else {
        console.log(222)
        this.dayid = info.extendedProps.dayId
        this.classid = info.extendedProps.clazzId
        this.index = info.extendedProps.index
        const { data: res } = await this.$http.get(
          '/schedule/empRecommend/' +
          this.value +
          '/' +
          info.extendedProps.dayId +
          '/' +
          info.extendedProps.clazzId +
          '/' +
          info.extendedProps.index
        )
        console.log(res)
        this.recommend = res.data
        console.log(this.recommend)
        this.table = true
      }
    },
    async agree(row, index) {
      let c = 0
      // console.log('c',c);
      const a = parseInt(this.recommend[index].startTime.split(':')[0])
      const b = parseInt(this.recommend[index].endTime.split(':')[0])
      // console.log(b,a);
      if (b < a) {
        c = b + 24 - a
      } else {
        c = b - a
      }
      // console.log(c);
      const { data: res } = await this.$http.put(
        '/schedule/selectEmpForClazz/' +
        this.shopid_ +
        '/' +
        this.dayid +
        '/' +
        this.classid +
        '/' +
        this.index +
        '/' +
        this.recommend[index].empId +
        '/' +
        c
      )
      // console.log(res);
      this.table = false
      location.reload()
    },
    // 指派功能结束
    // 点击切换门店事件
    changeRoom(index) {
      this.all_.splice(0, this.all_.length)
      this.calendarOptions.resources.splice(0, this.calendarOptions.resources.length)
      this.clear()
      this.getinfo()
      this.getemp()
    },

    //
    tab(date) {
      this.isshow = true
      this.calendarApi.changeView('timeGridDay')
      this.calendarApi.gotoDate(date)
      this.title = this.calendarApi.view?.title
      this.ptitle()
      this.ntitle()
      this.calendarApi.prev()
    },

    // 按位置分组事件
    async jobchange() {
      if (this.jobValue === '') {
        return
      } else {
        await this.calendarOptions.events.splice(
          0,
          this.calendarOptions.events.length
        )
        // this.clear()
        for (let i = 0; i < this.old.length; i++) {
          if (this.old[i].work === this.job[this.jobValue]) {
            this.calendarOptions.events.push(this.old[i])
            // this.calendarApi.addEvent(this.old[i]);
          }
        }
        // this.calendarOptions.events.splice(0,this.calendarOptions.events.length)
        console.log(this.calendarApi.getEvents())
        this.calendarOptions.events.push()
      }
    },
    //  一键自动排班触发事件
    show() {
      this.clear()
      this.calendarOptions.events.splice(0, this.calendarOptions.events.length)
      const star = dayjs(this.calendarApi.view.activeStart).format('YYYY-MM-DD ')
      const end = dayjs(this.calendarApi.view.activeEnd).format('YYYY-MM-DD ')
      console.log(star + '' + end)
      for (let i = 0; i < this.all_.length; i++) {
        if (this.all_[i].start >= star && this.all_[i].end < end) {
          this.calendarOptions.events.push(this.all_[i])
        } else if (this.all_[i].end >= end) {
          break
        }
      }
      console.log(this.calendarOptions.events)
      console.log(this.calendarOptions.events[0].start.split(' '))
      this.old.splice(0, this.old.length)
      this.old = this.old.concat(this.calendarOptions.events)
    },

    // 查询事件
    async search() {
      // this.clear();
      await this.calendarOptions.events.splice(
        0,
        this.calendarOptions.events.length
      )
      const title = prompt('请输入要查询的姓名')
      if (title) {
        for (let i = 0; i < this.old.length; i++) {
          if (this.old[i].title.trim() === title.trim()) {
            this.calendarOptions.events.push(this.old[i])
            // this.calendarApi.addEvent(this.old[i]);
          }
        }
      } else {
        console.log('111')
        this.clear()
        this.calendarOptions.events = this.calendarOptions.events.concat(
          this.old
        )
      }
    },

    // ===日期轮播栏事件start===
    // <
    prev() {
      this.calendarApi.prev()
      this.title = this.calendarApi.view?.title
      this.ptitle()
      this.ntitle()
      this.calendarApi.prev()
      if (this.calendarApi.view?.type === 'resourceTimelineDay') {
        this.day_ = this.day_ - 1
        this.show() // 调用自动排班事件
      } else {
        this.show() // 调用自动排班事件
        this.jobchange() // 调用按职位分组事件
      }
    },
    // >
    next() {
      this.calendarApi.next()
      this.title = this.calendarApi.view?.title
      this.ptitle()
      this.ntitle()
      this.calendarApi.prev()
      if (this.calendarApi.view?.type === 'resourceTimelineDay') {
        this.day_ = this.day_ + 1
        this.show() // 调用自动排班事件
      } else {
        this.show() // 调用自动排班事件
        this.jobchange() // 调用按职位分组事件
      }
    },
    // prevtitle
    ptitle() {
      this.calendarApi.prev()
      this.prevtitle = this.calendarApi.view?.title
    },
    // nexttitle
    ntitle() {
      this.calendarApi.next()
      this.calendarApi.next()
      this.nexttitle = this.calendarApi.view?.title
    },
    // ===日期轮播栏事件end===

    // ===月、周、日、今天按钮合集start===
    today() {
      this.calendarApi.today()
      this.title = this.calendarApi.view?.title
    },
    month() {
      this.calendarApi.changeView('dayGridMonth')
      this.title = this.calendarApi.view?.title
      this.ptitle()
      this.ntitle()
      this.calendarApi.prev()
    },
    week() {
      this.isshow = false
      this.calendarApi.changeView('timeGridWeek')
      // this.calendarApi.today();
      this.title = this.calendarApi.view?.title
      this.ptitle()
      this.ntitle()
      this.calendarApi.prev()
    },
    day() {
      this.isshow = true
      this.calendarApi.changeView('timeGridDay')
      // this.calendarApi.today();
      this.title = this.calendarApi.view?.title
      this.ptitle()
      this.ntitle()
      this.calendarApi.prev()
    },
    // ===月、周、今天按钮合集end===

    // 清除全部事件
    clear() {
      for (let i = 0; i < this.calendarApi.getEvents().length;) {
        if (this.calendarApi.getEvents().length > 0) {
          this.calendarApi.getEvents()[0].remove()
        }
      }
      // if(this.calendarApi.getEvents().length > 0){
      //   this.calendarApi.getEvents()[0].remove()
      //   this.clear()
      // }else {
      //   return
      // }
    },
    // 单击事件
    // handleDateClick(e) {
    //   if (e.dateStr !== prev) {
    //     clickCount = 0;
    //   }
    //   clickCount += 1;
    //   // clickCount += 1;
    //   prev = e.dateStr;
    //   setTimeout(() => {
    //     if (clickCount === 2) {
    //       console.log("db click");
    //     } else if (clickCount === 1) {
    //       console.log("one click");
    //     }
    //     clickCount = 0;
    //   }, 0);
    // },
    //
    handleType() {
      if (this.type === 'timeline') {
        this.calendarApi.changeView('customTimeLineMonth')
        this.calendarOptions.slotLabelFormat = null
      } else {
        this.calendarApi.changeView('timeGridWeek')
      }
    },
    // 事件变化
    handleEvents(events) {
      this.all = events
    }
  }
}
</script>

<style>
/* .fc-event {
    width: 25px !important;
  } */
* {
  margin: 0;
  padding: 0;
}
/* 选择门店样式 */
.select {
  margin: 0 auto;
  width: 200px;
  height: 50px;
  text-align: center;
  line-height: 50px;
}

/* 时间轮播栏样式 */
.fc-center {
  /* flex布局 */
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  margin: 20px 0;
}
/* 时间轮播栏 内容样式 */
.timecontent {
  text-align: center;
}
/* 时间轮播栏 按钮样式 */
.timebutton {
  border: 0px;
  padding: 15px;
}
/* 对固有样式修改 */
h5 {
  margin-bottom: 0;
  font-size: 13px;
}
p {
  font-size: 13px;
  margin-top: 8px;
  margin-bottom: 3px;
  width: 195px;
}

/* 主体部分--fullcalendar */
.main {
  margin-top: 15px;
}
/* 班次详细信息样式 */
.info {
  padding-top: 20px;
}

/* 编辑和删除按钮样式 */
.button {
  display: flex;
  justify-content: right;
  margin-top: 10px;
}
.fc-timegrid-slots tr td:last-child {
  width: 2000px !important;
  height: 35px !important;
}
.el-popover__reference span:nth-child(2) {
  display: block;
  width: 100px;
  text-align: center;
  height: 20px;
  line-height: 20px;
}
.fc-scrollgrid-section>th:first-child {
  width: 100px;
}
</style>
