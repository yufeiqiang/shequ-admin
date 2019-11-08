<template>
  <el-upload :action="url"
    style=" display: inline-block; margin-left:10px" 
    :show-file-list='false' 
    :on-success="handleSuccess" 
    name="file"
    :on-progress="handleProgress"
    :on-error="errorFun"
    v-if="adminShow"
    :headers="{'X-Token':token}">
    <el-button type="primary" :loading="loading">批量导入</el-button>
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/auth'
import {mapGetters} from 'vuex'
export default {
  props: {
    url:{
      type:String,
      default:'/community/ImportExcelContrller/importMansionExcel.do'
    }
  
  },
  data() {
    return {
      loading: false,
      adminShow:false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  computed:{
    token:function(){
      return getToken()
    },
    ...mapGetters(['roles'])
  },
  created:function(){
    if(this.roles[0]=="admin"){
      this.adminShow=true
    }
  },
  methods: {
     // 导入进行时
     handleProgress(){
      this.loading= true
     },
     // 批量导入
     handleSuccess(res, file, fileLis){
      this.$message({
      type:'success',
      message:res.message})
      this.loading = false;
      if(res.code==200){
        this.$emit('SuccessReset')
      }
     },
     errorFun(err){
       this.loading = false;
     }
  }
}
</script>

<style scoped>

</style>
