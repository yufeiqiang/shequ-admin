<template>
  <div :class="className" :style="{height:height,width:width}" id="boxsss" />
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
      default: '85%'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  created () {
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
            text:'进出信息',
            left: 'center',
            top: 0,
            textStyle: {
                color: '#fff'
            }
        },
        tooltip:{
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
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
            boundaryGap : false,
            name:'时',
            nameGap:5,
            data: ['8:00', '12:00', '16:00', '20:00', '24:00', '4:00']
        },
        yAxis: {
            type: 'value',
            name:'人',
            nameGap:5
        },
        series: [{
            name:'出入数',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[120, 132, 101, 134, 90, 230, 210]
        }]
      })
    }
  }
}
</script>
