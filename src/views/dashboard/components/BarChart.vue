<template>
    <div :class="className" :style="{width:width,height:height}"></div>
</template>
<script>
import echarts from 'echarts';
require('echarts/theme/macarons');
import resize from './mixins/resize'
const animationDuration = 6000
export default {
    mixins:[resize],
    props:{
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '90%'
        },
        height: {
            type: String,
            default: '85%'
        }
    },
    data(){
        return {
            chart:null,
            dataList:[179, 52, 200, 334, 390, 330, 220]
        }
    },
    mounted() {
        // console.log(this.$el)
        this.$nextTick(() => {
            this.initChart()
        })
    },
    beforeDestroy(){
        if(this.chart){
            return
        }
        this.chart.dispose();
        this.chart = null
    },
    methods:{
        initChart(){
            this.chart = echarts.init(this.$el, 'macarons');
            this.chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                title:{
                    left: 'left',
                    top: 0,
                    textStyle: {
                        color: '#fff'
                    }
                },
                grid: {
                    top: 20,
                    left: '2%',
                    right: '2%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: ['监控', '烟感', '门禁', '电表', '水表', '充电桩', '其他'],
                    axisTick: {
                        alignWithLabel: true,
                        interval:0
                    },
                    axisLabel:{
                        interval:0
                    },
                    boundaryGap: ['40%', '40%']
                }],
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: false
                    }
                }],
                series: [
                    {
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#83bff6'},
                                        {offset: 0.5, color: '#188df0'},
                                        {offset: 1, color: '#188df0'}
                                    ]
                                )
                            },
                            emphasis: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2378f7'},
                                        {offset: 0.7, color: '#2378f7'},
                                        {offset: 1, color: '#83bff6'}
                                    ]
                                )
                            }
                        },
                        data:this.dataList,
                        stack: 'vistors',
                        name: '设备数',
                        barWidth: '20',
                        animationDuration
                    }
                ]
            })
        }
    }
}
</script>
