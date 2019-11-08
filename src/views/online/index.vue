<template>
  <div class="app-container">
    <div class="head_box">
      <el-select v-model="listQuery.communityId" clearable filterable placeholder="请选择小区">
        <el-option
          v-for="item in villageList"
          :key="item.id"
          :label="item.communityName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.realName" placeholder="用户名" style="width: 200px;"  autocomplete="off"></el-input>
      <el-input v-model="listQuery.username" placeholder="手机号" style="width: 200px;"  autocomplete="off"></el-input>
      <el-button type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="用户名"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appUser | extract('realName') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appUser | extract('username') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="指派时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.handleDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="完成时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.maintainerDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="图片" >
        <template slot-scope="scope">
          <span><img :src="scope.row.image" width="40" height="40"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="描述" >
        <template slot-scope="scope">
          {{scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="处理状态" >
        <template slot-scope="scope">
          <span :class="{active : scope.row.state=='已处理'}"> {{scope.row.state}} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="驳回理由" >
        <template slot-scope="scope">
          {{scope.row.refute}}
        </template>
      </el-table-column>
      <el-table-column label="维修人员" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceman | extract('servicemanName') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" fixed="right" width="268" label="操作">
        <template slot-scope="scope" >
          <el-row>
            <el-button type="primary" size="mini" @click="popup(scope.row,'指派人员')">指派人员</el-button>
            <el-button 
            type="primary" 
            size="mini" 
            :disabled="scope.row.state=='已处理' || scope.row.state=='未审核' "
            @click="handle(scope.row)">{{ scope.row.state=='已处理' ? '已处理' : '处理' }}</el-button>
            <el-button type="danger" size="mini" @click="popup(scope.row,'驳回')">驳回</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>10" :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @pagination="fetchData" />
    <el-dialog :title="title" :visible.sync="dialogVisible"  center>
      <div v-if="title=='指派人员'"> 
        <Assign :repairList="repairList" @paginParam='paginParam' :total='totalAssign' @assignRow='assignRow'></Assign>
      </div>
      <template v-if="title=='驳回'">
        <el-form  
        :model="form" 
        ref="form" 
        :rules="rules">
          <el-form-item label="驳回理由" prop="remark">
              <el-input  type="textarea"  v-model="form.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')" :loading="loading">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {repairsList, repairsPersonList, changeState} from '@/api/repair'
import {communityList} from '@/api/house'
import Pagination from '@/components/Pagination'
import Assign from '@/components/assign'
import { setTimeout } from 'timers';
import publicIndex from '../mixins/publicIndex'

export default {
  components:{
    Pagination,
    Assign
  },
  mixins:[publicIndex],
  data() {
    return {
      list:[],
      repairList: [],
      listLoading: true,
      dialogVisible: false,
      loading:false,
      total:0,
      totalAssign:0,
      title:'指派人员',
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        username:'',
        communityId:'',
        realName:''
      },
      form:{
        remark:''
      },
      id:'',
      villageList:[],
      formLabelWidth:'110px',
      rules:{

      }
    }
  },
  created() {
      this.fetchData()
      // this.repairsPersonList()
      this.communityList()
  },
  mounted(){
    
  },
  methods: {
    //请求列表
    fetchData() {
      this.listLoading = true
      repairsList(this.listQuery).then(response => {
        this.list = response.data.entryList;
        this.total = response.data.totalCount;
        this.listLoading = false
      })
    },
    //维修人员列表
    repairsPersonList(param={}){
      repairsPersonList(param).then(res=>{
        let {data} = res
        this.repairList = data
        this.totalAssign = parseInt(res.data.totalCount);
        // this.totalAssign = parseInt(12);

      })
    },
    //点击弹窗按钮
    popup(e,title){
      this.dialogVisible = true;
      this.id = e.id;
      this.title=title;
      this.repairsPersonList()
      if(title=='驳回'){
        this.form = {};
        this.$nextTick(function(){
          this.$refs['form'].clearValidate()
        })
      }
    },
    // 小区列表
    communityList(){
      communityList().then(res=>{
        // console.log(res)
        if(res.code==200){
          this.villageList=res.data.entryList
        }
      })
    },
    //指派人员，处理，驳回
    changeState(param){
      changeState(param).then(res=>{
          if(res.code==200){
            this.fetchData()
            this.dialogVisible = false
          }
      })
    },
    // 指派人员
    assignRow(e){
      let param = {
        id:this.id,
        maintainerId:e.id,
        state:'指派人员',
        refute:''
      }
      this.changeState(param)
    },
    // 点击翻页
    paginParam(e){
      this.repairsPersonList(e)
    },
    // 处理
    handle(e){
      let param = {
        id:e.id,
        maintainerId:'',
        state:'已处理',
        refute:''
      }
      this.changeState(param)
    },
    // 提交驳回
    submitForm(fromName){
      this.$refs['form'].validate((valid)=>{
        if(valid){
          let param = {
                id:this.id,
                maintainerId:'',
                state:'驳回',
                refute:this.form.remark
              }
          this.changeState(param)
          this.dialogVisible = false;
        }
      })
    }
  }
}
</script>
