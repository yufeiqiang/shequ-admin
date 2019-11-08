<template>
  <div class="app-container">
    <div class="head_box">
      <el-select v-model="listQuery.communityId" @change='buildingList' clearable  filterable placeholder="请选择小区">
        <el-option
          v-for="item in communityList"
          :key="item.index"
          :label="item.communityName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.mansionId" clearable  filterable placeholder="请选择楼栋">
        <el-option
          v-for="item in NewmansionList"
          :key="item.id"
          :label="item.buildingName"
          :value="item.id">
        </el-option>
      </el-select>
      <!-- <buildingselect></buildingselect> -->
      <el-input v-model="listQuery.roomNumber" placeholder="房号" style="width: 200px;"  autocomplete="off"></el-input>
      <el-button type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
      <el-button type="primary" @click="addRole">添加房间</el-button>
      <UploadExcel url="https://www.weaving-comm.com/community/ImportExcelContrller/importHouseExcel.do" @SuccessReset="SuccessReset">
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
      <el-table-column label="所属小区"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.community | extract('communityName') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属楼栋" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mansion | extract('buildingName') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房号" align="center">
        <template slot-scope="scope">
          {{ scope.row.roomNumber }}
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属楼层"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.countFloor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单元号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unitNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="套内面积" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.innerArea }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="公摊面积">
        <template slot-scope="scope">
          {{scope.row.poolArea}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="建面积筑">
        <template slot-scope="scope">
          {{scope.row.sumArea}}
        </template>
      </el-table-column>
      <el-table-column label="开始使用时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.usedDate | parseTime( '{y}/{m}/{d} {h}:{i}')  }}</span>
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
    <el-dialog title="添加房间" :visible.sync="dialogVisible"  center>
      <el-form  
      label-width="110px"
      :model="form" 
      ref="form" 
      size="small"
      class="form_style number_style"
      :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="房号" :label-width="formLabelWidth" prop="roomNumber">
              <el-input v-model="form.roomNumber" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="使用类型" prop="type">
              <el-select v-model="form.type" filterable placeholder="请选择">
                <el-option v-for="item in typeList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="套内面积" :label-width="formLabelWidth" prop="innerArea">
              <el-input v-model="form.innerArea"></el-input>
            </el-form-item>
            <el-form-item label="公摊面积" prop="poolArea">
              <el-input v-model="form.poolArea"></el-input>
            </el-form-item>
            <el-form-item label="建筑面积" prop="sumArea">
              <el-input v-model="form.sumArea"></el-input>
            </el-form-item>
            <el-form-item label="单元号" prop="unitNumber">
              <el-input v-model="form.unitNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择楼栋" :label-width="formLabelWidth" prop="mansionId">
              <el-select v-model="form.mansionId" filterable placeholder="请选择">
                <el-option v-for="item in mansionList" :key="item.id" :label="item.buildingName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="户型" prop="houseType">
              <el-select v-model="form.houseType" filterable placeholder="请选择">
                <el-option v-for="item in houseTypeList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属楼层" prop="countFloor">
              <el-input v-model="form.countFloor"></el-input>
            </el-form-item>
            <el-form-item label="朝向" prop="direction">
              <el-input v-model="form.direction"></el-input>
            </el-form-item>
            <el-form-item label="装修等级" prop="decorateGrade">
              <el-input v-model="form.decorateGrade"></el-input>
            </el-form-item>
            <el-form-item label="开始使用日期" :label-width="formLabelWidth" prop="usedDate">
              <el-date-picker v-model="form.usedDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
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
import {houseList, delHouseById, MansionHouseList, selectCommunityList, HouseEnum, HouseTypeEnum, addHouse } from '@/api/house'
import { MansionList } from '@/api/userinfo'
import UploadExcel from '@/components/UploadExcel'
import Pagination from '@/components/Pagination';
import Buildingselect from '@/components/Buildingselect';
import publicIndex from '../mixins/publicIndex'
import { setTimeout } from 'timers';

export default {
  components:{
    Pagination,
    Buildingselect,
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
        roomNumber:'',
        communityId:'',
        mansionId:'',
        countFloor:''
      },
      form:{
        id:'',
        mansionId:'',
        roomNumber:'',
        type:'',
        innerArea:'',
        poolArea:'',
        sumArea:'',
        countFloor:'',
        unitNumber:'',
        houseType:'',
        direction:'',
        decorateGrade:'',
        usedDate:'',
        remark:''
      },
      mansionList:[],
      NewmansionList:[],
      houseTypeList:[],
      typeList:[],
      communityList:[],
    }
  },
  created() {
      this.fetchData()
      this.MansionHouseList()
      this.HouseEnum()
      this.HouseTypeEnum()
      this.selectCommunityList()
  },
  methods: {
    //请求列表
    fetchData() {
      this.listLoading = true
      houseList(this.listQuery).then(response => {
        this.list = response.data.entryList;
        // console.log(this.list)
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
    //请求楼栋列表
    MansionList(id){
      MansionList({communityId:id,buildingName:'',pageNum:'',pageSize:''}).then(res =>{
        if (res.code ==200 && res.data.length>0) {
          let { data } = res
          // console.log(data)
          this.NewmansionList = data
        }
      })
    },
    // 添加的时候楼栋接口
    MansionHouseList(){
      MansionHouseList().then(res =>{
        if (res.code ==200 && res.data.length>0) {
          let { data } = res
          // console.log(data)
          this.mansionList = data
        }
      })
    },
    // 请求类型
    HouseEnum(){
      HouseEnum({}).then(res =>{
        if (res.code ==200 && res.data.type.length>0) {
          let { data } = res
          this.typeList = data.type
        }
      })
    },
    // 请求户型
    HouseTypeEnum(){
      HouseTypeEnum({}).then(res =>{
        if (res.code ==200 && res.data.houseType.length>0) {
          let { data } = res
          this.houseTypeList = data.houseType
          // console.log(data)
        }
      })
    },
    //删除
    handleDelete(index,row){
      const id = row.id
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delHouseById({id}).then(res =>{
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
      this.form = Object.assign({}, row)
      this.form.mansionId = row.mansion.id
      // console.log(row)
      this.form.usedDate = new Date(row.usedDate)
       this.$nextTick(function(){
        this.$refs['form'].clearValidate()
      })
    },
    // 动态请求楼栋
    buildingList(e){
      this.listQuery.mansionId='';
      this.MansionList(e)
    },
    //增加或修改公共方法
    insert(params){
      this.loading = true;
      addHouse(params).then(res=>{
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
          delete  this.form.pass
          // console.log(this.form)
          this.dialogVisible = false;
        }
      })
    }
  }
}
</script>
