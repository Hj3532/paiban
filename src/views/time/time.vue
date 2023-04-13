<template>
  <el-card style="background-color: #F6FAFD; border-radius: 20px;margin-top: 10px">
    <div>
      <!-- 切换时间start -->
      <div style="margin-top: 20px">
        <div style="text-align: center">
          <h2>{{ start }} 至 {{ end }} 员工工时情况展示</h2>
        </div>
        <!-- <h2>{{ start }} -- {{ end }}</h2> -->
      </div>
      <el-button-group style="margin-bottom: 15px">
        <el-button @click="pre">上一周</el-button>
        <el-button @click="next">下一周</el-button>
      </el-button-group>
      <!-- 切换时间end -->

      <!-- 柱状图和饼图容器start -->
      <div id="one">
        <div
          id="ec"
          style="width: 455px; height: 700px; float: left; margin-top: 50px"
        />
        <div
          id="pie"
          style="width: 455px; height: 800px; float: right; margin-top: 70px;margin-right: 10px"
        />
      </div>
      <!-- 柱状图和饼图容器end -->
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'

export default {
  props: ['shopid_'],
  data() {
    return {
      id: 4,
      shopid: 0,
      start: '2023-05-08',
      end: '2023-05-14',
      empid: [],
      name: [],
      time: []
    }
  },
  async created() {
    this.shopid = this.shopid_
  },
  async mounted() {
    setTimeout(async() => {
      await this.getinfo()
      this.test()
      this.pie()
    }, 0)
  },
  methods: {
    // 发请求
    async getinfo() {
      let res
      await this.$http
        .get('/analyze/getEmpWeekTime/' + this.shopid_ + '/' + this.id)
        .then((success) => {
          res = success.data.data
        })
      for (let i = 0; i < res.length; i++) {
        this.empid.push(res[i].mes.empId)
        this.time.push(res[i].mes.weekTime)
        this.name.push(res[i].name)
      }
    },
    // 柱状图配置
    test() {
      var myChart = this.echarts.init(document.querySelector('#ec'))
      var option = {
        // 柱状图
        title: {
          text: '工时柱状图'
        },
        tooltip: {
          trigger: 'axis',
          title: '详细信息',
          fontFamily: '宋体',
          fontWeight: 100,
          padding: 20
        },
        legend: {
          data: ['工时']
        },
        xAxis: {
          name: '员工ID',
          data: this.name,
          // 横坐标垂直显示
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              return value.split('').join('\n')
            }
          }
        },
        yAxis: {
          name: '工时'
        },
        series: [
          {
            name: '本周工时长',
            type: 'bar',
            data: this.time,
            // showBackground: true,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            }
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },

    // 饼状图配置
    pie() {
      const data = []
      for (let i = 0; i < this.name.length; i++) {
        data.push({
          value: this.time[i],
          name: this.name[i]
        })
      }
      var myChart = this.echarts.init(document.querySelector('#pie'))
      var option = {
        title: {
          text: '工时饼状图'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '本周工时长',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      }

      // var option = {
      //   //饼状图
      //   title: {
      //     text: "工时饼图",
      //   },
      //   tooltip: {},
      //   // legend: {
      //   //   orient: "vertical",
      //   //   left: "left",
      //   //   top: 20,
      //   //   data: this.name,
      //   // },
      //   series: [
      //     {
      //       type: "pie",
      //       data: data,
      //     },
      //   ],
      // };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },

    // 切换时间（前一周）
    pre() {
      if (this.id - 7 > 0) {
        const ec = document.querySelector('#ec')
        const pie = document.querySelector('#pie')
        const fa = document.querySelector('#one')
        ec.remove()
        pie.remove()
        this.id = this.id - 7
        this.start = dayjs(this.start).subtract(7, 'day').format('YYYY-MM-DD')
        this.end = dayjs(this.end).subtract(7, 'day').format('YYYY-MM-DD')
        this.empid.splice(0, this.empid.length)
        this.time.splice(0, this.time.length)
        this.name.splice(0, this.name.length)
        this.getinfo()
        fa.innerHTML +=
          '<div style="width: 655px; height: 700px; float: left;margin-top: 50px;" id="ec"></div>'
        fa.innerHTML +=
          ' <div style="width: 655px;height: 800px;float: left;margin-top: 70px;"id="pie"></div>'
      } else {
        this.$message({
          message: '上一周暂无数据',
          type: 'error'
        })
        return
      }
      setTimeout(() => {
        this.test()
        this.pie()
      }, 800)
    },

    // 切换时间（后一周）
    next() {
      const ec = document.querySelector('#ec')
      const pie = document.querySelector('#pie')
      const fa = document.querySelector('#one')
      ec.remove()
      pie.remove()
      this.id = this.id + 7
      this.start = dayjs(this.start).add(7, 'day').format('YYYY-MM-DD')
      this.end = dayjs(this.end).add(7, 'day').format('YYYY-MM-DD')
      this.empid.splice(0, this.empid.length)
      this.time.splice(0, this.time.length)
      this.name.splice(0, this.name.length)
      this.getinfo()
      fa.innerHTML +=
        '<div style="width: 655px; height: 700px; float: left;margin-top: 50px;" id="ec"></div>'
      fa.innerHTML +=
        ' <div style="width: 655px;height: 800px;float: left;margin-top: 70px;"id="pie"></div>'
      setTimeout(() => {
        this.test()
        this.pie()
      }, 800)
    }
  }
}
</script>

<style></style>
