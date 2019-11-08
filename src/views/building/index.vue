<template>
  <div class="app-container">
    <div class="head_box">
      <el-select v-model="listQuery.communityId" clearable filterable placeholder="请选择小区">
        <el-option v-for="item in communityList" :key="item.index" :label="item.communityName" :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.buildingName" placeholder="楼栋名称" style="width: 200px;" autocomplete="off">
      </el-input>
      <el-input v-model="listQuery.unitNumber" placeholder="单元号" style="width: 200px;" autocomplete="off">
      </el-input>
      <el-button type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" @click="addRole">添加楼栋</el-button>
      <UploadExcel url="https://www.weaving-comm.com/community/ImportExcelContrller/importMansionExcel.do"
        @SuccessReset="SuccessReset">
      </UploadExcel>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="小区名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.community | extract('communityName') }}
        </template>
      </el-table-column>
      <el-table-column label="楼栋名称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buildingName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="街道" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.street }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单元号" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unitNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="层数" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sumFloor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电梯数" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sumElevator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物业类型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.useCategory }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column class-name="status-col" label="修改时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="created_at" label="描述" >
        <template slot-scope="scope">
          {{scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" fixed="right" width="148" label="操作">
        <template slot-scope="scope" >
          <el-row>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button type="primary" size="mini" @click="revise(scope.row)">修改</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>10" :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @pagination="fetchData" />
    <el-dialog title="添加楼栋" :visible.sync="dialogVisible"  center>
      <el-form  
      label-width="110px"
      :model="form" 
      ref="form" 
      size="small"
      class="form_style number_style"
      :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="楼栋名称"  prop="buildingName">
              <el-input v-model="form.buildingName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="选择小区"  prop="communityId">
              <el-select v-model="form.communityId" filterable placeholder="请选择">
                <el-option
                  v-for="item in communityList"
                  :key="item.index"
                  :label="item.communityName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单元号(号)"  prop="unitNumber">
              <el-input v-model="form.unitNumber"></el-input>
            </el-form-item>
            <el-form-item label="楼层数量(层)" prop="sumFloor">
              <el-input-number v-model="form.sumFloor" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="街道地址" prop="street">
              <el-input v-model="form.street"></el-input>
            </el-form-item>
            <el-form-item label="使用类型"  prop="useCategory">
              <el-select v-model="form.useCategory" filterable placeholder="请选择">
                <el-option v-for="item in useCategoryList" :key="item.index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="建筑年代"  prop="time">
              <el-date-picker v-model="form.time" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="朝向" prop="direction">
              <el-input v-model="form.direction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电梯数量(个)"  prop="sumElevator">
              <el-input-number v-model="form.sumElevator" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="楼梯数量(个)"  prop="sumStairs">
              <el-input-number v-model="form.sumStairs" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述"  prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { MansionList,selectCommunityList, delMansion, addMansion } from '@/api/house'
import Pagination from '@/components/Pagination'
import UploadExcel from '@/components/UploadExcel'
import { setTimeout } from 'timers';
import { getToken } from '@/utils/auth'
import publicIndex from '../mixins/publicIndex'

export default {
  components:{
    Pagination,
    UploadExcel
  },
  mixins:[publicIndex],
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      loading:false,
      total:0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      form:{
        id:'',
        communityId:'',
        buildingName:'',
        buildingName:'',
        unitNumber:'',
        sumFloor:'',
        sumElevator:'',
        sumStairs:'',
        direction:'',
        useCategory:'',
        time:'',
        remark:'',
        email:''
      },
      formLabelWidth:'110px',
      useCategoryList:[
            "住宅",
            "停车场",
            "办公楼",
            "厂房",
            "商场",
            "酒店",
            "娱乐场",
            "商住两用"
      ],
      communityList:[],
    }
  },
  created() {
      this.fetchData()
      this.selectCommunityList()
      // this.total = 10
  },
  methods: {
    //请求列表
    fetchData() {
      this.listLoading = true
      MansionList(this.listQuery).then(response => {
        this.list = response.data.entryList;
        this.total = response.data.totalCount;
        this.listLoading = false
      })
    },
    // 请求小区列表
    selectCommunityList(){
      selectCommunityList().then(res=>{
        let { data } = res
        this.communityList = data
      })
    },
    //删除机构
    handleDelete(index,row){
      const id = row.id
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMansion({id}).then(res =>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchData()
        })
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    //点击添加角色按钮
    addRole(){
      this.dialogVisible = true;
      this.form = {};
      this.$nextTick(function(){
        this.$refs['form'].clearValidate()
      })
    },
    //点击修改按钮
    revise(row){
      this.dialogVisible = true;
      this.form = Object.assign({},row);
      this.form.communityId = row.community.id;
      this.form.time = new Date(row.time);
      this.$nextTick(function(){
        this.$refs['form'].clearValidate()
      })
    },
    //增加或修改公共方法
    insert(params){
      this.loading = true;
      addMansion(params).then(res=>{
        if(res.code==200){
          this.$message({
            type: 'success',
            message:res.message
          });
          this.fetchData();
          this.loading = false;
        }
      }).catch((error)=>{
          this.loading = false;
      })
    },
    // 批量导入成功后刷新
    SuccessReset(){
    this.fetchData()
    },
    //确认提交
    submitForm(fromName){
      this.$refs[fromName].validate((valid)=>{
        if(valid){
          this.insert(this.form)
          this.dialogVisible = false;
        }
      })
    }
  }
}
</script>
