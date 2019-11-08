<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="repairList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center"  label="名字" >
        <template slot-scope="scope">
          {{ scope.row.servicemanName }}
        </template>
      </el-table-column>
      <el-table-column label="手机" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="性别"  align="center">
        <template slot-scope="scope">
          {{ scope.row.sex }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作">
        <template slot-scope="scope" >
          <el-row>
            <el-button type="primary" size="mini" @click="assignList(scope.row)">指派</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>10"  :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @pagination="paginList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { setTimeout } from 'timers';

export default {
  components:{
    Pagination
  },
  props:{
    repairList:{
      required:true,
      type:Array
    },
    total:{
      required:true,
      type:Number
    }
  },
  data() {
    return {
      listLoading: true,
      loading:false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        roleEnName:'',
        roleName:''
      },
    }
  },
  created() {
    console.log(this.total)
  },
  computed:{
    
  },
  watch:{
    repairList:function(nweVal,oldVal){
      if(nweVal){
        this.listLoading = false
      }
    }
  },
  methods: {
    assignList(e){
      this.$emit('assignRow',e)
    },
    paginList(){
      this.$emit('paginParam', this.listQuery)
    }
  }
}
</script>
