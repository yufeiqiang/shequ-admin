<template>

   <!-- 扭扭捏捏你女 -->
      <el-cascader
        :options="options2"
        @active-item-change="handleItemChange"
        :props="customProps"
        v-model="currIdList"
        clearable
        @change='changes'
      ></el-cascader>
</template>

<script>
import { MansionList, HouseList } from '@/api/userinfo'
import { communityList } from '@/api/house'
import { setTimeout } from 'timers';

export default {
  components:{
  },
  props:{
    idList:{
      type:Array,
      default() {
        return []
      }
    },
    Validation:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      // idList:["c2ec3e3cc6e74a94bce6045154774fc1","334ebd9ac24d4b98a8c2371e4b11e971","15802e1308b648b8ba0295e7d1d1d6b5"],
      options2:[],
      // idList: ["a1b6b2c01af44bbe80b421a4e4f0f8cd", "d12bcf7ac86a425dabf7daca3b139e4f", "1a3dac56ef7e48e4809dba8569492730"],
      customProps: {
        value: 'id',
        label:"label",
        children: 'cities'
      },
    }
  },
  created() {
    this.communityList([])
    // console.log(this.idList)
  },
  mounted(){
    
  
  },
  watch:{
    idList:function(val, oldVal){
      this.communityList(val)
    }
  },
  computed:{
    currIdList: {
      get() {
        return this.idList
      },
      set(val) {
        this.$emit('update:idList', val)
      }
    },
  },
  methods: {
    //加载小区
    communityList(param){
      if(!param){
        console.log(666)
        return
      }
      communityList().then(res=>{
        this.communitySelectList = res.data.entryList;
        this.options2 = res.data.entryList.map((el)=>{
            return {label: el.communityName, id: el.id, cities:[]}
        })
        if(res.code==200){
          // console.log(this.idList)
          this.loudong(param,true,)
        }
      })
    },

    // 请求楼栋
    loudong(param,flag){
      MansionList({communityId:param[0],buildingName:'',pageNum:'',pageSize:''}).then((res)=>{
          //遍历小区列表
          this.options2.map((item)=>{
            //判断id与选项变化相同的一项val[0]
            if(item.id == param[0]){
              // console.log(item.id)
              // 给当前选项的子选项添加数据
              let data = res.data;
              item.cities=data.map(el=>{
                return {label:el.buildingName,id:el.id,cities: []}
              })
            }
          })
          // console.log(this.options2)
          if(res.code==200 && flag){
            this.fangjian(param[0],param[1])
          }
      })
    },
    // 请求房间
    fangjian(comunityId,mansionId){
       HouseList({mansionId:mansionId,roomNumber:'',pageNum:'',pageSize:''}).then((res)=>{
        //  console.log(res)
            this.options2.map(item => {
              if(item.id ==comunityId){
                item.cities.map(el=>{
                  if(el.id == mansionId){
                     let data = res.data;
                      el.cities = data.map(e=>{
                      return {label:e.roomNumber,id:e.id}
                      })
                      // console.log(item.cities)
                  }
                })
              }
            })
        })
    },
    // 多级联动选择房间
    handleItemChange(val) {
      // console.log(val)
      this.getPosition(val)
    },
    getPosition(val){
      // console.log(val)
      // this.idList=[]
      if(!val){
        console.log('初始化')
      }else if(val.length===1){
        // console.log(val[0])
        //传小区请求对应楼栋的列表
        MansionList({communityId:val[0],buildingName:'',pageNum:'',pageSize:''}).then((res)=>{
          //遍历小区列表
          this.options2.map((item)=>{
            //判断id与选项变化相同的一项val[0]
            if(item.id == val[0]){
              // 给当前选项的子选项添加数据
              let data = res.data;
              item.cities=data.map(el=>{
                return {label:el.buildingName,id:el.id,cities: []}
              })
            }
          })
        })
      }else{
        // console.log('加载三级级数据')
        HouseList({mansionId:val[1],roomNumber:'',pageNum:'',pageSize:''}).then((res)=>{
            this.options2.map(item => {
              if(item.id == val[0]){
                item.cities.map(el=>{
                  if(el.id == val[1]){
                     let data = res.data;
                      el.cities = data.map(e=>{
                      return {label:e.roomNumber,id:e.id}
                      })
                      // console.log(item.cities)
                  }
                })
              }
            })
        })
      }
    },
    changes(e){
      // console.log(e)
      // this.$emit('selectVal',e)
      // this.idList= e
    }
  }
}
</script>
