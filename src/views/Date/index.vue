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
          v-for="item in meetingRoomList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <!-- 选择门店end -->

    <!-- 中间部分start -->
    <div class="middle">
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
      </div>
      <!-- 时间轮播栏end -->

      <!-- 选择职位start -->
      <el-select v-model="jobValue" placeholder="按职位分组">
        <el-option
          v-for="item in jobList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- 选择职位end -->
    </div>
    <!-- 中间部分end -->

    <!-- 查询、删除和编辑按钮start -->
    <el-button class="search" type="button" @click="search"> 查询 </el-button>
    <div class="button">
      <el-button
        icon="el-icon-edit"
        style="border-width: 1.5px"
      >编辑</el-button>
      <el-button
        icon="el-icon-delete"
        style="border-width: 1.5px"
      >删除</el-button>
      <el-button style="border-width: 1.5px" @click="show">一键自动排班</el-button>
    </div>
    <!-- 删除和编辑按钮end -->

    <!--主体start  -->
    <!-- 日历fullcalendar -->
    <div class="main">
      <full-calendar
        ref="fullCalendar"
        style="height: 100%"
        :options="calendarOptions"
      />
    </div>
    <!-- 主体end -->

    <!--排班新增弹窗start-->
    <el-dialog
      title="排班新增"
      :visible.sync="dialogVisible"
      :before-close="close"
      width="45%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        size="small"
        class="demo-ruleForm"
      >
        <el-form-item label="员工姓名" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="员工职位" prop="userId">
          <el-select
            v-model="form.userId"
            clearable
            filterable
            placeholder="请选择职位"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.name"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-col :span="11">
            <el-form-item prop="startDate" style="margin-bottom: 0">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="startTime" style="margin-bottom: 0">
              <el-time-select
                v-model="form.startTime"
                placeholder="选择时间"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '23:30 ',
                }"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-col :span="11">
            <el-form-item prop="endDate" style="margin-bottom: 0">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="endTime" style="margin-bottom: 0">
              <el-time-select
                v-model="form.endTime"
                placeholder="选择时间"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '23:30 ',
                  minTime: form.startTime,
                }"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="注意事项" prop="desc">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('form')">取消</el-button>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--日程新增弹窗end-->
  </el-card>
</template>

<script>
import _ from 'lodash' // 导入loadsh插件
// 引入日历组件
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
// 引入js死数据, //  array是引入的js传来的排班信息对象
// import array from "@/util/home";
import dayjs from 'dayjs'

export default {
  name: 'Dashboard',
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      // ...
      calendarApi: null,
      // 选择门店start
      meetingRoomList: [
        { value: 0, label: '门店1' },
        { value: 1, label: '门店2' },
        { value: 2, label: '门店3' }
      ], // 门店列表
      roomValue: '', // v-model的值
      // 选择门店end

      // 选择职位start
      jobList: [
        { value: 0, label: '职员' },
        { value: 1, label: '店长' },
        { value: 2, label: '经理' }
      ], // 职位列表
      jobValue: '', // v-model的值
      // 选择职位end

      userList: [
        {
          userId: 1,
          name: '店员'
        },
        {
          userId: 2,
          name: '店长'
        },
        {
          userId: 3,
          name: '经理'
        }
      ], // 员工职位列表

      // 时间轮播栏 时间内容
      title: '',
      prevtitle: '',
      nexttitle: '',

      // 门店1排班安排
      scheduleList0: [
        {
          id: 1,
          title: '门店1员工',
          userId: 3,
          beginDate: '2023-03-02 09:30',
          endDate: '2023-03-02 11:30',
          remark: '备注内容',
          status: '#f08f00'
        },
        {
          id: 1,
          title: '门店1员工1',
          userId: 1,
          beginDate: '2023-03-02 09:30',
          endDate: '2023-03-02 11:30',
          remark: '备注内容',
          status: '#f08f00'
        }
      ],
      // 门店2排班安排
      scheduleList1: [
        {
          id: 1,
          title: '门店2员工',
          userId: 2,
          beginDate: '2023-02-15 09:30',
          endDate: '2023-02-15 11:30',
          remark: '备注内容',
          status: '#f08f00'
        }
      ],
      // 门店3排班安排
      scheduleList2: [
        {
          id: 1,
          title: '门店3员工',
          userId: 4,
          beginDate: '2023-02-16 09:30',
          endDate: '2023-02-16 11:30',
          remark: '备注内容',
          status: '#f08f00'
        }
      ],

      // activeNum: 0, //排班索引值
      dialogVisible: false, // 控制新增弹框显示与隐藏

      subList: [], // ？？？？？
      // 表单数据对象--新增排班信息会总的提交到form对象上
      form: {
        title: '',
        userId: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        remark: ''
      },
      // 表单验证规则
      rules: {
        title: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        userId: [
          { required: true, message: '请选择员工职位', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请填写注意事项', trigger: 'blur' }
        ]
      },

      // fullcalendar配置项start
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        firstDay: 1, // 设置一周中显示的第一天是哪天，周日为0，周一为1，类推
        height: 700,
        timeGridEventMinHeight: '30', // 设置事件的最小高度
        // aspectRatio: 100, // 设置日历单元格宽度与高度的比例。
        eventLimit: true, // 设置月日程，与all-day slot的最大显示数量，超过的通过弹窗显示
        initialView: 'dayGridWeek', // 设置默认显示周，可选日
        headerToolbar: {
          right: '',
          center: '',
          left: 'dayGrid,dayGridWeek,today'
        },
        // slotLabelFormat: {
        //   hour: "2-digit",
        //   minute: "2-digit",
        //   meridiem: false,
        //   hour12: false, // 设置时间为24小时
        // },
        buttonText: {
          week: '按周查看',
          dayGrid: '按日查看'
        },
        editable: true,
        selectable: true,
        navLinks: true,
        // 事件
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        select: this.handleDateSelect,
        // event日程
        events: [],
        eventColor: '#f08f00', // 修改日程背景色
        locale: 'zh-cn', // 设置语言
        weekNumberCalculation: 'ISO', // 周数
        customButtons: {
          prev: {
            text: 'PREV',
            click: () => {
              this.prev()
            }
          },
          next: {
            text: 'PREV',
            click: () => {
              this.next()
            }
          },
          today: {
            text: '今天',
            click: () => {
              this.today()
            }
          }
        }
      }
      // fullcalendar配置项end
    }
  },
  // 一挂载完毕就获取相关信息
  mounted() {
    this.showFullcalendar = false
    this.$nextTick(() => {
      this.calendarApi = this.$refs.fullCalendar.getApi()
      this.title = this.calendarApi.view?.title
      this.ptitle()
      this.ntitle()
      this.calendarApi.prev()
    })
    this.calendarApi = this.$refs.fullCalendar.getApi() // ？？？？？
    this.meetingRoomList = this.meetingRoomList // 获取排班列表信息
    this.getReservationList(this.scheduleList0) // 新增门店1排班事件
    this.value = 0 // 开始时value为0
  },
  methods: {
    async show() {
      const a = await this.$http.get("/schedule/1");
      console.log("这是我获取到的总数据：");
      console.log(a.data.data);
      console.log(a.data.data[0][0].date);
      console.log(
        dayjs(a.data.data[0][0].date).format("YYYY-MM-DD") +
          " " +
          a.data.data[0][0].startTime
      );
      const b = a.data.data;
      for (let i = 0; i < b.length; i++) {
        for (let j = 0; j < b[i].length; j++) {
          for (let m = 0; m < b[i][j].clazzForEmpList.length; m++) {
              this.calendarOptions.events.push({
                id: b[i][j].clazzForEmpList[m].empId,
                title: b[i][j].clazzForEmpList[m].name,
                work: b[i][j].clazzForEmpList[m].position,
                start:
                  dayjs(b[i][j].clazzForEmpList[m].date).format("YYYY-MM-DD") +
                  " " +
                  b[i][j].clazzForEmpList[m].startTime,
                end:
                  dayjs(b[i][j].clazzForEmpList[m].date).format("YYYY-MM-DD") +
                  " " +
                  b[i][j].clazzForEmpList[m].endTime,
              });
            }
        }
      }
    },
    // 清除事件
    clear() {
      const a = this.calendarApi.getEvents().length
      for (let i = 0; i < this.calendarApi.getEvents().length;) {
        console.log(a)
        this.calendarApi.getEvents()[i].remove()
      }
    },
    // 查询事件
    search() {
      this.clear()
      const begin = dayjs(this.calendarApi.view.activeStart).format(
        'YYYY-MM-DD '
      )
      const end = dayjs(this.calendarApi.view.activeEnd).format('YYYY-MM-DD ')
      const title = prompt('请输入要查询的姓名')
      const a = []
      if (title) {
        console.log(1)
        console.log(title)
        for (let i = 0; i < this.calendarOptions.events.length; i++) {
          console.log(this.calendarOptions.events[i].title)
          if (this.calendarOptions.events[i].title.trim() === title.trim()) {
            console.log(2)
            a.push(this.calendarOptions.events[i])

            if (
              dayjs(this.calendarOptions.events[i].beginDate).format(
                'YYYY-MM-DD '
              ) >= begin &&
              dayjs(this.calendarOptions.events[i].endDate).format(
                'YYYY-MM-DD '
              ) <= end
            ) {
              console.log('000')
              this.calendarApi.addEvent(this.calendarOptions.events[i])
            }
          }
        }
        if (a.length === 0) {
          alert('查无此人！！！！')
          this.calendarOptions.events.push()
        } else if (this.calendarApi.getEvents().length === 0) {
          console.log(this.calendarApi.getEvents())
          alert('当前周没安排此人！！！！')
          this.calendarOptions.events.push()
        }
      } else {
        console.log('111')
        // ???
        this.calendarOptions.events.push()
      }
    },
    // 新增日历事件
    getReservationList(arrayData) {
      const newArr = []
      this.subList = arrayData
      arrayData.forEach((item) => {
        newArr.push({
          start: this.dealWithTime(item.beginDate),
          end: this.addDate(this.dealWithTime(item.endDate), 1),
          color: item.status,
          id: item.id,
          title: `${this.getTitle(item.beginDate, item.endDate)} ${item.title}`
        })
        console.log(newArr)
        this.calendarOptions.events = newArr
      })
    },
    // 点击切换门店
    changeRoom(index) {
      console.log(this.value)
      // 查询该门店下面的排班信息
      if (index === 0) {
        this.getReservationList(this.scheduleList0)
      } else if (index === 1) {
        this.getReservationList(this.scheduleList1)
      } else if (index === 2) {
        this.getReservationList(this.scheduleList2)
      }
    },
    // 日期加1天？？？？
    addDate(date, days) {
      var d = new Date(date)
      d.setDate(d.getDate() + days)
      var mon =
        d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      const endD = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      return `${d.getFullYear()}-${mon}-${endD}`
    },
    // 获取排班事件title
    getTitle(date1, date2) {
      const start = date1.substring(11, 16)
      const end = date2.substring(11, 16)
      return `${start}~${end}`
    },
    getShowTime(beginDate, endDate) {
      this.form.startDate = this.dealWithTime(beginDate)
      this.form.startTime = this.getHoursMin(beginDate)
      this.form.endDate = this.dealWithTime(endDate)
      this.form.endTime = this.getHoursMin(endDate)
    },
    // 获取时分时间
    getHoursMin(value) {
      return value.substring(11, 16)
    },
    // 处理排班时间格式
    dealWithTime(date) {
      const newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date)[0]
      return newDate
    },
    // 点击日历
    handleDateClick: function(arg) {
      this.$forceUpdate()
      console.log(arg, '事件1')
      this.dialogVisible = true
    },
    // 日历日程点击事件
    handleEventClick(calEvent) {
      console.log(calEvent, '事件2')
      this.dialogVisible = true
      const id = calEvent.event.id
      const info = this.subList.filter((item) => {
        return item.id === id
      })
      this.$nextTick(() => {
        this.form = _.cloneDeep(info[0])
        // 处理时间回显
        this.getShowTime(this.form.beginDate, this.form.endDate)
        // console.log(info[0], '数据')
      })
    },
    handleEvents(events) {
      // console.log(events, '事件3')
    },
    handleDateSelect(selectInfo) {
      // console.log(selectInfo, '事件4')
    },
    // 时间轮播栏 左按钮事件
    prev() {
      this.calendarApi.prev()
      this.title = this.calendarApi.view?.title
      this.ptitle()
      this.ntitle()
      this.calendarApi.prev()
    },
    // 时间轮播栏 右按钮事件
    next() {
      this.calendarApi.next()
      this.title = this.calendarApi.view?.title
      this.ptitle()
      this.ntitle()
      this.calendarApi.prev()
    },
    ptitle() {
      this.calendarApi.prev()
      this.prevtitle = this.calendarApi.view?.title
    },
    ntitle() {
      this.calendarApi.next()
      this.calendarApi.next()
      this.nexttitle = this.calendarApi.view?.title
    },
    // 点击今天按钮
    today() {
      this.calendarApi.today()
    },
    // 提交数据
    submitForm(formName) {
      console.log('111' + this.value)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.startDate = `${this.form.startDate} ${this.form.startTime}`
          this.form.endDate = `${this.form.endDate} ${this.form.endTime}`
          console.log(this.form, '数据')
          // 上交日历的配置项events
          const { startDate, endDate, title, userId } = this.form
          this.calendarOptions.events.push({
            start: this.dealWithTime(startDate),
            end: this.addDate(this.dealWithTime(endDate), 1),
            color: 'red',
            id: userId,
            title: `${this.getTitle(startDate, endDate)} ${title}`
          })
          if (this.value === 0) {
            this.scheduleList0.push({
              id: userId,
              title: title,
              userId: 1,
              beginDate: startDate,
              endDate: endDate,
              remark: '什么',
              status: 'red'
            })
          } else if (this.value === 1) {
            this.scheduleList1.push({
              id: userId,
              title: title,
              userId: 1,
              beginDate: startDate,
              endDate: endDate,
              remark: '什么',
              status: 'red'
            })
          } else if (this.value === 2) {
            this.scheduleList2.push({
              id: userId,
              title: title,
              userId: 1,
              beginDate: startDate,
              endDate: endDate,
              remark: '什么',
              status: 'red'
            })
          }
          // 上交服务器
          // ？？？
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 关闭弹窗，重置表单
    close() {
      this.dialogVisible = false
      this.$refs['form'].resetFields()
    }
  }
}
</script>
<style>
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
/* 中间部分--轮播栏和按职位选择框 */
.middle {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
}
/* 主体部分--fullcalendar */
.main {
  margin-top: 15px;
}
/* 编辑和删除按钮 样式 */
.button {
  display: flex;
  justify-content: right;
  margin-top: 10px;
}
</style>
