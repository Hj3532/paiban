<template>
  <el-card>
    <!-- <h3>欢迎 {{ id }}</h3> -->
    <!-- 中间部分start -->
    <div class="middle">
      <div class="fc-left">
        <el-button-group>
          <el-button @click="month"> 月 </el-button>
          <el-button @click="day"> 日 </el-button>
          <el-button @click="week"> 周 </el-button>
          <el-button @click="today"> 今天 </el-button>
        </el-button-group>
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
      </div>
      <!-- 时间轮播栏end -->
      <el-select v-model="jobValue" placeholder="按职位分组" style="float: right;" @change="jobchange">
        <el-option
          v-for="item in jobList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <!-- 中间部分start -->
    <!-- 按钮合集start -->
    <div>
      <el-button class="search" type="button" @click="search"> 查询 </el-button>
      <div class="button">
        <el-button icon="el-icon-edit" style="border-width: 1.5px"
          >编辑</el-button
        >
        <el-button icon="el-icon-delete" style="border-width: 1.5px"
          >删除</el-button
        >
        <el-button style="border-width: 1.5px" @click="showall">显示全部</el-button>
        <el-button style="border-width: 1.5px" @click="show"
          >一键自动排班</el-button
        >
      </div>
    </div>
    <!-- 按钮合集end -->
    <!-- 日历组件start -->
    <div class="main">
      <FullCalendar
        id="calendar"
        ref="fullCalendar"
        class="demo-app-calendar"
        :options="calendarOptions"
      >
        <template v-slot:eventContent="arg">
          <el-popover
            placement="top-start"
            title="标题"
            width="200"
            :visible-arrow="false"
            trigger="hover"
          >
            <i class="title">姓名：{{ arg.event.title }}</i>
            <br>
            <i class="title">职务：{{ arg.event.extendedProps.work }}</i>
            <br>
            <i>工作时间：{{ arg.timeText }}</i>
            <br />
            <el-button @click="more"> 更多 </el-button>
            <div slot="reference" class="popper-content">
              <span style="display: inline-block;height: 30px;text-align: center;line-height: 30px; margin-right: 20px" v-if="isshow">{{
                arg.timeText
              }}</span>
              <i>{{ arg.event.title }}</i>
              <span style="float: right;height: 30px;text-align: center;line-height: 30px; margin-right: 800px" v-if="isshow"
                >职务：{{ arg.event.extendedProps.work }}</span
              >
            </div>
          </el-popover>
        </template>
      </FullCalendar>
    </div>
    <!-- 日历组件end-->
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
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import dayjs from "dayjs";
import _ from "lodash";

let clickCount = 0;
let prev = ""; // 上一次点击的dom节点
export default {
  props: ["id"],
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  data() {
    return {
      isshow: false,
      color_: [
        "#f08f00",
        "#12DEBC",
        "#5DB4E8",
        "#12DE29",
        "#FA8650",
        "#C129CE",
        "#EA2105",
        "#B2B267",
      ],
      showFullcalendar: true,
      title: "",
      all: [],
      test: [],
      prevtitle: "",
      nexttitle: "",
      currentView: {},
      dialogVisible: false,
      meetingRoomList: [
        { value: 0, label: "门店1" },
        { value: 1, label: "门店2" },
        { value: 2, label: "门店3" },
      ], // 门店列表
      roomValue: "", // v-model的值
      // 选择门店end

      // 选择职位start
      jobList: [
        { value: 0, label: "普通员工" },
        { value: 1, label: "店长" },
        { value: 2, label: "收银员" },
        { value: 3, label: "清洁员"}
      ], // 职位列表
      jobValue: "", // v-model的值
      job: ["普通员工","店长","收银员","清洁员"],
      // 选择职位end

      userList: [
        {
          userId: 1,
          name: "店员",
        },
        {
          userId: 2,
          name: "店长",
        },
        {
          userId: 3,
          name: "经理",
        },
      ], // 员工职位列表
      // 门店1排班安排
      scheduleList0: [
        {
          id: 1,
          title: "门店1员工",
          userId: 3,
          beginDate: "2023-03-02 09:30",
          endDate: "2023-03-02 11:30",
          remark: "备注内容",
          status: "#f08f00",
        },
        {
          id: 1,
          title: "门店1员工1",
          userId: 1,
          beginDate: "2023-03-02 09:30",
          endDate: "2023-03-02 11:30",
          remark: "备注内容",
          status: "#f08f00",
        },
      ],
      // 门店2排班安排
      scheduleList1: [
        {
          id: 1,
          title: "门店2员工",
          userId: 2,
          beginDate: "2023-02-15 09:30",
          endDate: "2023-02-15 11:30",
          remark: "备注内容",
          status: "#f08f00",
        },
      ],
      // 门店3排班安排
      scheduleList2: [
        {
          id: 1,
          title: "门店3员工",
          userId: 4,
          beginDate: "2023-02-16 09:30",
          endDate: "2023-02-16 11:30",
          remark: "备注内容",
          status: "#f08f00",
        },
      ],
      form: {
        title: "",
        userId: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        remark: "",
      },
      // 表单验证规则
      rules: {
        title: [{ required: true, message: "请输入员工姓名", trigger: "blur" }],
        userId: [
          { required: true, message: "请选择员工职位", trigger: "change" },
        ],
        startDate: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择结束日期", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        remark: [
          { required: true, message: "请填写注意事项", trigger: "blur" },
        ],
      },
      subList: [],
      all_: [],
      old:[],
      // fullcalendar配置项start
      calendarOptions: {
        
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        initialDate: '2023-05-08',//默认开始日期
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        select: this.handleDateSelect,
        // stickyFooterScrollbar: true ,
        selectable: true,
        navLinks: true,//日历头部是否能点击
        navLinkDayClick: this.tab,//日历头部点击函数重写
        eventMinWidth: 40,
        slotMinWidth: 200,
        schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
        slotEventOverlap: false,
        locale: "zh",
        timeZone: "UTC",
        firstDay: 1, //设置一周中显示的第一天是哪天，周日为0，周一为1，类推
        height: 900,
        timeGridEventMinHeight: "40", // 设置事件的最小高度
        // aspectRatio: 100, // 设置日历单元格宽度与高度的比例。
        eventLimit: true, // 设置月日程，与all-day slot的最大显示数量，超过的通过弹窗显示
        initialView: "timeGridWeek", // 设置默认显示周，可选日
        editable: true,
        dayMaxEvents: true, // allow "more" link when too many events
        eventDurationEditable: true, // 可以调整事件的时间
        selectable: true, // 日历格子可选择
        nowIndicator: true, // 现在的时间线显示
        eventDisplay: "block", // 争对全天的情况下，以块状显示
        header: false, // 显示头部的导航栏
        headerToolbar: false,
        selectMirror: false,
        displayEventEnd: true, // like 08:00 - 13:00
        eventsSet: this.handleEvents,
        eventMinHeight: 70, //事件最小高度
        eventMinWidth: 550,
        slotMinTime: "06:00:00",
        eventTimeFormat: {
          // like '14:30:00'
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false, // 设置时间为24小时
        },
        events: [],
        
        // eventColor: "#f08f00",
        allDayText: "全天",
        dateClick: this.handleDateClick,
        schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
        // 切换视图调用的方法
        datesSet() {},
      },
      calendarApi: null,
    };
  },
  async created(){
    const a = await this.$http.get("/schedule/1");
      console.log(this.calendarApi);
      console.log("这是我获取到的总数据：");
      console.log(a.data.data);
      console.log(a.data.data[0][0].date);
      console.log(
        dayjs(a.data.data[0][0].date).format("YYYY-MM-DD") +
          " " +
          a.data.data[0][0].startTime
      );
      const b = a.data.data;
      let end_ = "";
      for (let i = 0; i < b.length; i++) {
        for (let j = 0; j < b[i].length; j++) {
          for (let m = 0; m < b[i][j].clazzForEmpList.length; m++) {
            if (
              b[i][j].clazzForEmpList[m].endTime === "00:00:00" ||
              b[i][j].clazzForEmpList[m].endTime === "01:00:00"
            ) {
              end_ =
                dayjs(b[i][j].clazzForEmpList[m].date).add(1,'day')
                  .format("YYYY-MM-DD") +
                " " +
                b[i][j].clazzForEmpList[m].endTime;
            } else {
              end_ =
                dayjs(b[i][j].clazzForEmpList[m].date).format("YYYY-MM-DD") +
                " " +
                b[i][j].clazzForEmpList[m].endTime;
            }
            if(b[i][j].clazzForEmpList[m].empId){
              this.all_.push({
              id: b[i][j].clazzForEmpList[m].empId,
              title: b[i][j].clazzForEmpList[m].name,
              work: b[i][j].clazzForEmpList[m].position,
              start:
                dayjs(b[i][j].clazzForEmpList[m].date).format("YYYY-MM-DD") +
                " " +
                b[i][j].clazzForEmpList[m].startTime,
              end: end_,
              dayId: b[i][j].dayId,
                clazzId: b[i][j].clazzId,
                clazzForEmpId: b[i][j].clazzForEmpList[m].clazzForEmpId,
              backgroundColor: this.color_[j % 8],
            });
            }else {
              this.all_.push({
                id: b[i][j].clazzForEmpList[m].empId,
                title: b[i][j].clazzForEmpList[m].name,
                work: b[i][j].clazzForEmpList[m].position,
                start:
                dayjs(b[i][j].date).format("YYYY-MM-DD") +
                " " +
                b[i][j].startTime,
                end:dayjs(b[i][j].date).format("YYYY-MM-DD") +
                " " +
                b[i][j].end,
                backgroundColor: this.color_[j % 8],
              })
            }
            
          }
        }
      }
  },
  mounted() {
    setTimeout(() => {
      this.showFullcalendar = false;
      this.$nextTick(() => {
        this.calendarApi = this.$refs.fullCalendar.getApi();
        this.title = this.calendarApi.view?.title;
        this.ptitle();
        this.ntitle();
        this.calendarApi.prev();
        // this.getDtata();
      });
    }, 0);
  },
  methods: {
    tab(date) {
      this.isshow = true;
      this.calendarApi.changeView("dayGridDay");
      // this.calendarApi.today();
      this.calendarApi.gotoDate(date);
      this.title = this.calendarApi.view?.title;
      this.ptitle();
      this.ntitle();
      this.calendarApi.prev();
    },
    async showall(){
      this.jobValue = ''
      await this.calendarOptions.events.splice(0,this.calendarOptions.events.length)
      let star = dayjs(this.calendarApi.view.activeStart).format("YYYY-MM-DD ");
      let end = dayjs(this.calendarApi.view.activeEnd).format("YYYY-MM-DD ");
      console.log(star+''+end)
      for(let i = 0 ; i<this.all_.length ; i++){
        if(this.all_[i].start >= star && this.all_[i].end < end){
          this.calendarOptions.events.push(this.all_[i])
        }
      }
      this.old.splice(0,this.old.length)
      this.old = this.old.concat(this.calendarOptions.events)
    },
    show() {
      console.log(this.all_)
      this.clear()
      this.calendarOptions.events.splice(0,this.calendarOptions.events.length)
      let star = dayjs(this.calendarApi.view.activeStart).format("YYYY-MM-DD ");
      let end = dayjs(this.calendarApi.view.activeEnd).format("YYYY-MM-DD ");
      console.log(star+''+end)
      for(let i = 0 ; i<this.all_.length ; i++){
        if(this.all_[i].start >= star && this.all_[i].end < end){
          this.calendarOptions.events.push(this.all_[i])
        }else if(this.all_[i].end >= end){
          break
        }
      }
      this.old.splice(0,this.old.length)
      this.old = this.old.concat(this.calendarOptions.events)
    },
    more() {},
    // 增加事件
    // 单击事件
    handleDateClick(e) {
      if (e.dateStr !== prev) {
        clickCount = 0;
      }
      clickCount += 1;
      prev = e.dateStr;
      setTimeout(() => {
        if (clickCount === 2) {
          console.log("db click");
        } else if (clickCount === 1) {
          console.log("one click");
        }
        clickCount = 0;
      }, 300);
    },
    prev() {
      // this.calendarOptions.events.splice(0,this.calendarOptions.events.length)
      this.calendarApi.prev();
      this.title = this.calendarApi.view?.title;
      this.ptitle();
      this.ntitle();
      this.calendarApi.prev();
      this.show()
      this.jobchange()
    },
    ptitle() {
      this.calendarApi.prev();
      this.prevtitle = this.calendarApi.view?.title;
    },
    next() {
      this.calendarApi.next();
      this.title = this.calendarApi.view?.title;
      this.ptitle();
      this.ntitle();
      this.calendarApi.prev();
      this.show()
      this.jobchange()
    },
    ntitle() {
      this.calendarApi.next();
      this.calendarApi.next();
      this.nexttitle = this.calendarApi.view?.title;
    },
    today() {
      this.calendarApi.today();
      this.title = this.calendarApi.view?.title;
    },
    month() {
      if (this.type === "timeline") {
        this.calendarApi.changeView("customTimeLineMonth");
      } else {
        this.calendarApi.changeView("dayGridMonth");
      }
      // this.calendarApi.today();
      this.title = this.calendarApi.view?.title;
      this.ptitle();
      this.ntitle();
      this.calendarApi.prev();
    },
    week() {
      this.isshow = false;
      if (this.type === "timeline") {
        this.calendarApi.changeView("customTimeLineWeek");
      } else {
        this.calendarApi.changeView("timeGridWeek");
      }
      // this.calendarApi.today();
      this.title = this.calendarApi.view?.title;
      this.ptitle();
      this.ntitle();
      this.calendarApi.prev();
    },
    day() {
      this.isshow = true;
      this.calendarApi.changeView("dayGridDay");
      // this.calendarApi.today();
      this.title = this.calendarApi.view?.title;
      this.ptitle();
      this.ntitle();
      this.calendarApi.prev();
    },
    clear() {
      if(this.calendarApi.getEvents().length > 0){
        this.calendarApi.getEvents()[0].remove()
        this.clear()
      }else {
        return
      }
    },
    newload(){
        setTimeout( ()=> {
                this.clear()
                this.calendarOptions.events.push();
              }, 7000);
    },
    async search() {
      // this.clear();
      await this.calendarOptions.events.splice(0,this.calendarOptions.events.length)
      let title = prompt("请输入要查询的姓名");
      if (title) {
        for (let i = 0; i < this.old.length; i++) {
          if (this.old[i].title.trim() === title.trim()) {
            this.calendarOptions.events.push(this.old[i])
            // this.calendarApi.addEvent(this.old[i]);
          }
        }
        
      } else {
        console.log("111");
        this.calendarOptions.events = this.calendarOptions.events.concat(this.old)
      }
    },
    async jobchange(){
      if(this.jobValue === ''){
        return
      }else {
        await this.calendarOptions.events.splice(0,this.calendarOptions.events.length)
        // this.clear()
        for (let i = 0; i < this.old.length; i++) {
          if (this.old[i].work=== this.job[this.jobValue]) {
            this.calendarOptions.events.push(this.old[i])
            // this.calendarApi.addEvent(this.old[i]);
          }
        }
        // this.calendarOptions.events.splice(0,this.calendarOptions.events.length)
        console.log(this.calendarApi.getEvents())
        this.calendarOptions.events.push()
        // this.calendarOptions.events=this.calendarOptions.events.concat(b)
        // if (this.calendarOptions.events.length == 0) {
        //   alert("当前周没安排这个职位的人！！！！");
        //   this.calendarOptions.events.push();
        //   this.jobValue = ''
        // }
      }
    },
    handleType() {
      if (this.type === "timeline") {
        this.calendarApi.changeView("customTimeLineMonth");
        this.calendarOptions.slotLabelFormat = null;
      } else {
        this.calendarApi.changeView("timeGridWeek");
      }
    },
    handleEvents(events) {
      this.all = events;
    },
    handleDateClick: function (arg) {
      this.$forceUpdate();
      console.log(arg, "事件1");
      this.dialogVisible = true;
    },
    // 日历日程点击事件
    handleEventClick(calEvent) {
      console.log(this.calendarApi.getEvents());
      // this.dialogVisible = true;
      // const id = calEvent.event.id;
      // const info = this.subList.filter((item) => {
      //   return item.id === id;
      // });
      // this.$nextTick(() => {
      //   this.form = _.cloneDeep(info[0]);
      //   // 处理时间回显
      //   this.getShowTime(this.form.startDate, this.form.endDate);
      //   // console.log(info[0], '数据')
      // });
    },
    handleEvents(events) {
      // console.log(events, '事件3')
    },
    handleDateSelect(selectInfo) {
      // console.log(selectInfo, '事件4')
    },
    submitForm(formName) {
      console.log("111" + this.value);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.startDate = `${this.form.startDate} ${this.form.startTime}`;
          this.form.endDate = `${this.form.endDate} ${this.form.endTime}`;
          console.log(this.form, "数据");
          // 上交日历的配置项events
          const { startDate, endDate, title, userId } = this.form;
          this.calendarOptions.events.push({
            start: this.dealWithTime(startDate),
            end: this.addDate(this.dealWithTime(endDate), 1),
            color: "red",
            id: userId,
            title: `${this.getTitle(startDate, endDate)} ${title}`,
          });
          if (this.value === 0) {
            this.scheduleList0.push({
              id: userId,
              title: title,
              userId: 1,
              beginDate: startDate,
              endDate: endDate,
              remark: "什么",
              status: "red",
            });
          } else if (this.value === 1) {
            this.scheduleList1.push({
              id: userId,
              title: title,
              userId: 1,
              beginDate: startDate,
              endDate: endDate,
              remark: "什么",
              status: "red",
            });
          } else if (this.value === 2) {
            this.scheduleList2.push({
              id: userId,
              title: title,
              userId: 1,
              beginDate: startDate,
              endDate: endDate,
              remark: "什么",
              status: "red",
            });
          }
          // 上交服务器
          // ？？？
          this.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    // 关闭弹窗，重置表单
    close() {
      this.dialogVisible = false;
      this.$refs["form"].resetFields();
    },
  },
};
</script>
  
  <style>
* {
  margin: 0;
  padding: 0;
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
/* 编辑和删除按钮 样式 */
.button {
  display: flex;
  justify-content: right;
  margin-top: 10px;
}
/* .fc-col-header th{
    width: 200px !important;
  }
  .fc-scrollgrid-sync-table td {
    width: 200px !important;
  } */
.fc-timegrid-slots tr td:last-child {
  width: 2000px !important;
  height: 35px !important;
}
.fc-daygrid-day-events .fc-daygrid-event-harness a {
  border: none;
}
.el-popover__reference {
    height: 30px !important;
    margin: 3px 0 !important;
}
</style>
  