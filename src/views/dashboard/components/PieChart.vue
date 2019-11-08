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
      default: '80%'
    },
    height: {
      type: String,
      default: '88%'
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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        title:{
            left: 'left',
            top: 0,
            textStyle: {
                color: '#fff'
            }
        },
        grid: {
            top: 0,
            left: '20%',
            right: '2%',
            containLabel: true
        },
        legend: {
          textStyle:{
            color:'#fff'
          },
          // top:60,
          // orient: 'vertical',
          type: 'scroll',
          // y:'bottom',
          // x: 'left',
          bottom:12,
          data: ['0-18', '19-30', '31-40', '41-60', '60以上']
        },
        series: [
          {
            name: '年龄段比列',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            label:{
              show:true,
              position:'outside'
            },
            labelLine:{
              length:5,
              length2:10
            },
            itemStyle:{
             
            },
            data: [
              { value: 320, name: '0-18' },
              { value: 240, name: '19-30' },
              { value: 149, name: '31-40' },
              { value: 100, name: '41-60' },
              { value: 59, name: '60以上' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            radius:'60%'
          },
        ]
      })
    }
  }
}
</script>
