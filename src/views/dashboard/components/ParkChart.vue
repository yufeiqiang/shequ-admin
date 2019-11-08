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
            left: 'left',
            top: 0,
            textStyle: {
                color: '#fff'
            }
        },
        tooltip:{
            trigger: 'axis',
        },
        grid: {
            top: 20,
            left: '0',
            right: '8%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type : 'category',
            boundaryGap : false,
            nameTextStyle:{
              color:'rgba(250, 250, 250, 0.7)'
            },
            axisLabel:{
              color:'rgba(250, 250, 250, 0.7)'
            },
            axisTick:{
              lineStyle:{
                color:'rgba(250, 250, 250, 0.7)'
              }
            },
            axisLine:{
              lineStyle:{
                color:'rgba(250, 250, 250, 0.7)'
              }
            },
            name:'时',
            nameGap:5,
            data: ['8:00', '12:00', '16:00', '20:00']
        },
        yAxis: {
            type: 'value',
            nameGap:5,
            nameTextStyle:{
              color:'rgba(250, 250, 250, 0.7)'
            },
            axisLabel:{
              color:'rgba(250, 250, 250, 0.7)'
            },
            axisTick:{
              lineStyle:{
                color:'rgba(250, 250, 250, 0.7)'
              }
            },
            axisLine:{
              lineStyle:{
                color:'rgba(250, 250, 250, 0.7)'
              }
            },
            name:'辆'
        },
        series: [
          {
            name:'进',
            type:'line',
            stack: '总量',
            data:[120, 132, 101, 134, 90, 230, 210],
          },
          {
            name:'出',
            type:'line',
            stack: '总量',
            data:[220, 182, 191, 234, 290, 330, 310],
          },
        ]
      })
    }
  }
}
</script>
