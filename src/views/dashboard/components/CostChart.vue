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
            default: '80%'
        }
    },
    data(){
        return {
            chart:null,
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
                    top: 10,
                    left: '2%',
                    right: '2%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: ['管理费', '水费', '电费', '其他'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: false
                    }
                }],
                series: [
                    {
			            name:'实收',
			            type:'bar',
			            stack: '总量',
			            barWidth: '40%',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'insideRight'
			                }
			            },
			            itemStyle: {
			            	normal: {
			            		color:'#44e0f7',
			            	}
			            },
			            data:[55, 40, 30, 66]
			        },
			        {
			            name:'未收',
			            type:'bar',
			            stack: '总量',
			            barWidth: '40%',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'insideRight'
			                }
			            },
			            itemStyle: {
			            	normal: {
			            		color:'#1c5a63',
			            	}
			            },
			            data:[15, 20, 20, 9]
			        }

                ]
            })
        }
    }
}
</script>
