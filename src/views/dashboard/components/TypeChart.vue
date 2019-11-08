<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '95%'
    },
    height: {
      type: String,
      default: '85%'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title:{
            text:'开门方式',
            left: 'center',
            top: 0,
            textStyle: {
                color: '#fff'
            }
        },
        tooltip:{
            trigger: 'axis',
            // axisPointer: {
            //     type: 'cross',
            //     label: {
            //         backgroundColor: '#6a7985'
            //     }
            // }
        },
        grid: {
            top: 30,
            left: '0',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type : 'category',
            name:'时', 
            axisTick:{
              alignWithLabel:true
            },
            nameGap:5,
            boundaryGap: ['20%', '20%'], 
            data: ['8:00', '12:00', '16:00', '20:00']
        },
        yAxis: {
            type: 'value',
            nameGap:5,
            name:'张'
        },
        series: [
          {
            name: '刷卡',
            type: 'bar',
            barGap: 0,
            barWidth:'10px',
            data: [30, 33, 301, 84, 50]
          },
          {
              name: '人脸',
              type: 'bar',
              barWidth:'10px',
              data: [200, 150, 70, 23, 29]
          },
          {
              name: '远程',
              type: 'bar',
              barWidth:'10px',
              data: [15, 73, 80, 15, 190]
          },
          {
              name: '密码',
              type: 'bar',
              barWidth:'10px',
              data: [98, 77, 101, 99, 40]
          }
        ]
      })
    }
  }
}
</script>
