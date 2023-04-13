<template>
  <div>
    <h3>{{ start }} -- {{ end }}</h3>
    <el-button-group>
      <el-button @click="pre">上一周</el-button>
      <el-button @click="next">下一周</el-button>
    </el-button-group>
    <div id="one">
      <div style="width: 1200px; height: 600px" id="ec"></div>
      <div style="width: 1200px; height: 1000px" id="pie"></div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  props: ["shopid_"],
  data() {
    return {
      id: 4,
      shopid: 0,
      start: "2023-05-08",
      end: "2023-05-14",
      empid: [],
      name: [],
      time: [],
    };
  },
  async created() {
    this.shopid = this.shopid_;
  },
  async mounted() {
    // this.getinfo();
    setTimeout(async () => {
      await this.getinfo();
      this.test();
      this.pie();
    }, 1000);
  },
  methods: {
    async getinfo() {
      let res;

      await this.$http
        .get("/analyze/getEmpWeekTime/" + this.shopid_ + "/" + this.id)
        .then((success) => {
          res = success.data.data;
        })
        .catch((err) => {
          alert("目前只有1个月的数据！");
        });
      for (let i = 0; i < res.length; i++) {
        this.empid.push(res[i].mes.empId);
        this.time.push(res[i].mes.weekTime);
        this.name.push(res[i].name);
      }
      //   console.log(this.time);
    },
    // clear() {
    //   let data1 = this.empid;
    //   let data2 = this.time;
    //   myChart.setOption({
    //     xAxis: { data: data1 },
    //     series: [
    //       {
    //         data: data2,
    //       },
    //     ],
    //   });
    // },
    test() {
      var myChart = this.echarts.init(
        document.querySelector("#ec")
      );

      var option = {
        title: {
          text: "工时柱状图",
        },
        tooltip: {
          trigger: "axis",
          title: "详细信息",
          fontFamily: "宋体",
          fontWeight: 100,
          padding: 20,
          //   formatter: (params) => {
          //     let title = "详细信息";
          //     let a = parseInt(params[0].name);
          //     let b = this.empid.indexOf(a);
          //     let c = this.name[b];
          //     let d = params[0].data;
          //     // return `姓名：${c} ;ID: ${a} ;工时: ${d}`
          //     return (
          //       "<span>" +
          //       title +
          //       "<span><br>" +
          //       "<span>ID:" +
          //       a +
          //       "<span><br>" +
          //       "<span>姓名:" +
          //       c +
          //       "<span><br>" +
          //       "<span>工时:" +
          //       d +
          //       "<span><br>"
          //     );
          //   },
        },
        legend: {
          data: ["工时"],
        },
        xAxis: {
          name: "员工ID",
          data: this.name,
          axisLabel: {
            rotate: 270, // 设置标签旋转角度
          },
        },
        yAxis: {
          name: "工时",
        },
        series: [
          {
            name: "工时",
            type: "bar",
            data: this.time,
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    pie() {
      let data = [];
      for (let i = 0; i < this.name.length; i++) {
        data.push({
          value: this.time[i],
          name: this.name[i],
        });
      }
      var myChart =  this.echarts.init(
        document.querySelector("#pie")
      );

      var option = {
        title: {
          text: "工时饼图",
        },
        tooltip:{},
        legend: {
          orient: "vertical",
          left: "left",
          top: 20,
          data: this.name,
        },
        series: [
          {
            type: "pie",
            data: data,
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    pre() {
      if (this.id - 7 > 0) {
        let ec = document.querySelector("#ec");
        let pie = document.querySelector("#pie");
        let fa = document.querySelector("#one");
        ec.remove();
        pie.remove();
        this.id = this.id - 7;
        this.start = dayjs(this.start).subtract(7, "day").format("YYYY-MM-DD");
        this.end = dayjs(this.end).subtract(7, "day").format("YYYY-MM-DD");
        this.empid.splice(0, this.empid.length);
        this.time.splice(0, this.time.length);
        this.name.splice(0, this.name.length);
        this.getinfo();
        fa.innerHTML +=
          '<div style="width: 1200px; height: 600px" id="ec"></div>';
        fa.innerHTML +=
          '<div style="width: 1200px; height: 1000px" id="pie"></div>';
      } else {
        this.$message({
          message: "上一周暂无数据",
          type: "error",
        });
        return;
      }
      setTimeout(() => {
        this.test();
        this.pie();
      }, 800);
    },
    next() {
      let ec = document.querySelector("#ec");
      let pie = document.querySelector("#pie");
      let fa = document.querySelector("#one");
      ec.remove();
      pie.remove();
      this.id = this.id + 7;
      this.start = dayjs(this.start).add(7, "day").format("YYYY-MM-DD");
      this.end = dayjs(this.end).add(7, "day").format("YYYY-MM-DD");
      this.empid.splice(0, this.empid.length);
      this.time.splice(0, this.time.length);
      this.name.splice(0, this.name.length);
      //   console.log(111);
      //   console.log(this.empid);
      this.getinfo();
      fa.innerHTML +=
        '<div style="width: 1200px; height: 600px" id="ec"></div>';
      fa.innerHTML +=
        '<div style="width: 1200px; height: 1000px" id="pie"></div>';
      setTimeout(() => {
        this.test();
        this.pie();
      }, 800);
    },
  },
};
</script>

<style>
</style>
