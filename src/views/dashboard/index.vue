<template>
    <div class="box">
      <div class="header">
      <div class="header_content">
         <el-row :gutter="20">
           <el-col :span="2"><p></p></el-col>
           <el-col :span="4">
             <div class="header_content_item">
               <p>6544</p> 登记人口
              </div>
           </el-col>
           <el-col :span="4">
             <div class="header_content_item">
               <p>64</p>楼栋数
             </div>
           </el-col>
           <el-col :span="4">
             <div class="header_content_item">
               <p>16</p>小区数
             </div>
           </el-col>
           <el-col :span="4">
             <div class="header_content_item">
               <p>1244</p>总户数
             </div>
           </el-col>
           <el-col :span="4">
             <div class="header_content_item">
               <p>80</p>门禁投放
             </div>
           </el-col>
           <el-col :span="2">
             <p></p>
           </el-col>
         </el-row>
      </div>
      </div>
      <div class="box_left">
        <el-row class="box_left_a">
          <el-col :span="24">
            <div class="ecological-livability-content">
              <div class="chart-container">
                <div class="chart-content-name">
                    <span class="chart-content-title">实时信息</span>
                    <img class="chart-content-img" :src="titleBck" alt="">
                </div>
                <div class="info_content">
                  <p>监控系统</p>
                  <ul class="monitor">
                    <li>
                      <video id="myPlayer1" poster="" controls="" playsinline="" width="96%" webkit-playsinline="" autoplay="autoplay" src="http://hls.open.ys7.com/openlive/984a8b14d1b744c9ade7a5fb187a8616.hd.m3u8">
                          <source src="http://hls.open.ys7.com/openlive/984a8b14d1b744c9ade7a5fb187a8616.hd.m3u8" type="application/x-mpegURL">
                      </video>
                    </li>
                    <li>
                      <video id="myPlayer2" poster="" controls="" playsinline="" width="96%" webkit-playsinline="" autoplay="autoplay" src="http://hls.open.ys7.com/openlive/415c2a073e4a4fe8ba3a36c5fc8d6cb1.hd.m3u8">
                          <source src="http://hls.open.ys7.com/openlive/415c2a073e4a4fe8ba3a36c5fc8d6cb1.hd.m3u8" type="application/x-mpegURL">
                      </video>
                    </li>
                    <li>
                      <video id="myPlayer3" poster="" controls="" playsinline="" width="96%" webkit-playsinline="" autoplay="autoplay" src="	http://hls.open.ys7.com/openlive/9b2ba75298b345ebb4b0d1f8f56388c2.hd.m3u8">
                          <source src="	http://hls.open.ys7.com/openlive/9b2ba75298b345ebb4b0d1f8f56388c2.hd.m3u8" type="application/x-mpegURL">
                      </video>
                    </li>
                    <li>
                      <video id="myPlayer4" poster="" controls="" playsinline="" width="96%" webkit-playsinline="" autoplay="autoplay" src="http://hls.open.ys7.com/openlive/ccf5b8252dad4653b7ff6b51cab982d9.hd.m3u8">
                          <source src="	http://hls.open.ys7.com/openlive/ccf5b8252dad4653b7ff6b51cab982d9.hd.m3u8" type="application/x-mpegURL">
                      </video>
                    </li>
                  </ul>
                </div>
                <div class="repair info_content">
                  <p>报修信息</p>
                  <ul class="repair_content">
                    <li><a href="javascipt:;"><span>信息1：</span>家里没电了是不是电路坏了</a><em>2019/08/22 10:21</em></li>
                    <li><a href="javascipt:;"></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row  class="box_left_b">
          <el-col :span="24">
            <div class="ecological-livability-content">
              <div class="chart-container">
                <div class="chart-content-name">
                    <span class="chart-content-title">车辆进出</span>
                    <img class="chart-content-img" :src="titleBck" alt="">
                </div>
                <park-chart></park-chart>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div id="container" ref="container"></div>
      <div class="box_right">
        <el-row>
          <el-col :span="24">
            <div class="ecological-livability-content">
              <div class="chart-container">
                <div class="chart-content-name">
                    <span class="chart-content-title">运营分析</span>
                    <img class="chart-content-img" :src="titleBck" alt="">
                </div>
                <cost-chart></cost-chart>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='24'>
            <div class="ecological-livability-content">
              <div class="chart-container">
                <div class="chart-content-name">
                    <span class="chart-content-title">人口分析</span>
                    <img class="chart-content-img" :src="titleBck" alt="">
                </div>
                <pie-chart></pie-chart>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='24'>
            <div class="ecological-livability-content">
              <div class="chart-container">
                <div class="chart-content-name">
                    <span class="chart-content-title">设备情况</span>
                    <img class="chart-content-img" :src="titleBck" alt="">
                </div>
                <bar-chart :className='chart'></bar-chart>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="box_bottom">
        <el-row>
          <el-col :span="6">
            
          </el-col>
          <el-col :span="12">
            <div class="ecological-livability-content">
              <div class="chart-container">
                <div class="chart-content-name">
                    <span class="chart-content-title">出入信息</span>
                    <img class="chart-content-img" :src="titleBck" alt="">
                </div>
                <el-row>
                  <el-col :span="12">
                    <type-chart></type-chart>
                  </el-col>
                  <el-col :span="12">
                    <access-chart></access-chart>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item_chart">
              
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import AccessChart from './components/AccessChart'
import CostChart from './components/CostChart'
import TypeChart from './components/TypeChart'
import ParkChart from './components/ParkChart'
import titleBck from '@/img/title-bck.png'

export default {
  data(){
    return {
      titleBck:titleBck,
      capitals:[
        {
          adcode: "",
          center: [113.553532,23.115383],
          citycode: "1853",
          name: "星河word",
          text: '这是星河word小区',
          content: "<div class='area'>星河word</div>"
        }, 
        {
          adcode: "",
          center: [113.336877,23.146382],
          citycode: "3803",
          name: "保利华都",
          text: '这是保利华都小区',
          content: "<div class='area'>保利华都</div>"
        },
        {
          adcode: "",
          center: [113.306197,23.345978],
          citycode: "3803",
          name: "保利华都",
          text: '这是保利华都小区',
          content: "<div class='area'>保利华都</div>"
        },
        {
          adcode: "",
          center: [113.366197,23.455978],
          citycode: "3803",
          name: "保利华都",
          text: '这是保利华都小区',
          content: "<div class='area'>保利华都</div>"
        },
        {
          adcode: "",
          center: [113.36697,23.25978],
          citycode: "3803",
          name: "保利华都",
          text: '这是保利华都小区',
          content: "<div class='area'>保利华都</div>"
        }
      ],
      chart:'chart'
    }
  },
  components:{
    BarChart,
    PieChart,
    CostChart,
    AccessChart,
    TypeChart,
    ParkChart
  },
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created(){
    
    //  player = new EZUIPlayer(this.$refs['myPlayer']);
  },
  beforeMount: function () {
   
  },
  updated(){
    // let myPlayer=this.$refs['myPlayer']
    new EZUIPlayer('myPlayer1')
    new EZUIPlayer('myPlayer2')
    new EZUIPlayer('myPlayer3')
    new EZUIPlayer('myPlayer4')
  },
  mounted:function(){
    this.initMap()
    // console.log(this.$refs['myPlayer'])
    // new EZUIPlayer('myPlayer')
  },
  methods:{
    initMap(){
      let facilities = [];
      let capitals =this.capitals
      var map = new AMap.Map(this.$refs.container, {
        mapStyle:'amap://styles/8d8815f853eb2cab57bcb4a0e24b6eb3',
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:10, //初始化地图层级
        center: [capitals[0].center[0],capitals[0].center[1]] //初始化地图中心点
      });

      for(var item in capitals){
        var marker = new AMap.Marker({
          position: new AMap.LngLat(capitals[item].center[0],capitals[item].center[1]),
          title: this.capitals.name
        });
        facilities.push(marker)
      }
      

      // 将创建的点标记添加到已有的地图实例：
      map.add(facilities);

      // 移除已创建的 marker
      // map.remove(marker);
    }
  }
}
</script>

<style>
  .box{
    width: 100%;
    position: relative;
    min-height: calc(100vh - 84px);
  }
  .header_content{
    width: 60%;
    margin: 7px auto;
    line-height: initial;
  }
  .header_content_item{
    width: 70%;
    padding: 6px 0;
    margin: 0 auto;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(25,180,204,.3);
    font-size: 14px;
    color: rgb(201, 198, 198)
  }
  .header_content_item p{
    padding: 0;
    margin: 0;
     color: #00fefe;
     font-size: 22px;
     text-align: center;
  }
  .header{
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 3;
    color: #fff;
    text-align: center;
    width: 100%;
    height: 70px;
    line-height: 70px;
    padding: 0 10px;
    background: rgba(32,220,231,0.1);
  }
  ul,li,ol{
    list-style: none;
  }
  .box_left, .box_right {
    position: absolute;
    display: flex;
    flex-direction: column;
    height: 100%;
    top: 0;
    padding-top: 95px;
  }
  .box_right .el-row{
    height: 32%;
    margin-bottom: 1.5%;
  }
  .box_left{
     position: absolute;
    display: flex;
    flex-direction: column;
    height: 100%;
    top: 0;
    padding-top: 95px;
    left: 0;
    width:25%;
    /* padding-left: 30px; */
    z-index: 1;
    background: linear-gradient(to right, #0e1b3d, rgba(14,27,61,.3) 90%,transparent);
  }
  .box_left_a{
    height: 64.5%;
    margin-bottom: 1.5%;
  }
  .box_left_b{
    height: 32%;
  }
  .box_right{
    right: 0;
    width:25%;
    /* padding-right: 30px; */
    background: linear-gradient(to left, #0e1b3d, rgba(14,27,61,.3) 90%,transparent);
  }
  .title_style{
    color: #fff;
    padding: 10px;
    font-size: 18px;
  }
  .chart{
    padding: 10px 0;
    margin: 0 auto;
  }
  .box_bottom{
    height: 30%;
    width: 100%;
    position: absolute;
    bottom: 16px;
    z-index: 4;
    /* background: rgba(64, 64, 64, 0.34); */
  }
  .box_bottom .el-row{
    height: 100%;
  }
  .el-col, .item_chart{
    height: 100%;
  }
  #container {
    width: 100%;
    min-height: calc(100vh - 84px);
  }

  .ecological-livability-content {
    width: 100%;
    height: 100%;
    padding: 0px 5px 5px 7.5px;
  }
.chart-container {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid rgba(13,62,91,1);
    box-shadow: 0px 0px 15px 0px rgba(32,220,231,0.25) inset;
}
.chart-container:before {
    content: '';
    position: absolute;
    right: 0px;
    bottom: 0px;
    height: 14px;
    width: 14px;
    border-bottom: 1px solid #20DCE7;
    border-right: 1px solid #20DCE7;
}
.chart-content-name {
    position: relative;
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
}
.chart-content-name:before {
    content: '';
    position: absolute;
    left: 0px;
    top: 0px;
    height: 14px;
    width: 14px;
    border-top: 1px solid #20DCE7;
    border-left: 1px solid #20DCE7;
}
:after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
.chart-content-name {
    position: relative;
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
}
.chart-content-title {
    position: absolute;
    font-size: 16px;
    font-family: 'MicrosoftYaHeiUI-Bold';
    color: rgba(32,220,231,1);
    letter-spacing: 2px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
    padding: 0 80px;
    z-index: 100;
    top: -1px;
    white-space: nowrap;
}
.chart-content-img {
    position: absolute;
    left: 50%;
    right: 0px;
    transform: translateX(-50%);
    /* opacity: 0.6; */
}
.chart-content-name:after {
    content: '';
    position: absolute;
    right: 0px;
    top: 0px;
    height: 14px;
    width: 14px;
    border-top: 1px solid #20DCE7;
    border-right: 1px solid #20DCE7;
}

:after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
.chart-container:after {
    content: '';
    position: absolute;
    left: 0px;
    bottom: 0px;
    height: 14px;
    width: 14px;
    border-bottom: 1px solid #20DCE7;
    border-left: 1px solid #20DCE7;
}

:after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
.info_content{
  /* min-height: 440px; */
}
.info_content p{
  color: #fff;
  padding-left: 4%;
}
.monitor{
  display: flex;
  flex-wrap:wrap;
  padding-left: 4%;
  box-sizing: border-box;
}
.monitor li{
  width: 49%;
  margin-bottom: 10px;
}
.repair_content {
  display: flex;
  flex-wrap:wrap;
  padding-left: 4%;
  box-sizing: border-box;
  color: #fff;
}
.repair_content li{
  width: 20%;
  font-size: 12px;
} 
.repair_content li:nth-of-type(1){
  width: 96%;
}
</style>
