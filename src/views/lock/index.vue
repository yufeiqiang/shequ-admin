<template>
  <div class="app-container">
    <div class="head_box">
      <el-select v-model="listQuery.communityId"  @change='buildingList' clearable filterable placeholder="请选择小区">
        <el-option
          v-for="item in CommunityList"
          :key="item.index"
          :label="item.communityName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.mansionId" clearable filterable placeholder="请选择楼栋">
        <el-option
          v-for="item in NewmansionList"
          :key="item.index"
          :label="item.buildingName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.doorGuardName" placeholder="设备名称" style="width: 200px;"  autocomplete="off"></el-input>
      <el-button type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
      <el-button type="primary"  @click="addRole">添加设备</el-button>
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
      <el-table-column label="楼栋" align="center">
        <template slot-scope="scope">
          {{ scope.row.mansion | extract('buildingName') }}
        </template>
      </el-table-column>
      <el-table-column label="设备名称"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.doorGuardName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产厂家"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplierid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="mac编码"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mac }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="修改时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column>
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
    <el-dialog title="添加设备" :visible.sync="dialogVisible" center>
      <el-form  
      size="small"
      class="form_style number_style"
      label-width="110px"
      :model="form" 
      ref="form" 
      :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="隐藏id" prop="id" v-show="false">
              <el-input v-model="form.id" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="设备名称" :label-width="formLabelWidth" prop="doorGuardName">
              <el-input v-model="form.doorGuardName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="使用类型" :label-width="formLabelWidth" prop="doorGuardType">
              <el-select v-model="form.doorGuardType" filterable placeholder="请选择">
                <el-option v-for="item in doorGuardList" :key="item.index" :label="item.val" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="MAC编号" :label-width="formLabelWidth" prop="mac">
              <el-input v-model="form.mac" controls-position="right" :min="1"></el-input>
            </el-form-item>
            <el-form-item label="选择楼栋" :label-width="formLabelWidth" prop="mansionId">
              <el-select v-model="form.mansionId" filterable :disabled="disabled" placeholder="请选择">
                <el-option v-for="item in mansionList" :key="item.index" :label="item.buildingName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="厂商" :label-width="formLabelWidth" prop="supplierid">
              <el-input v-model="form.supplierid"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌" prop="trademark">
              <el-input v-model="form.trademark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" :label-width="formLabelWidth" prop="remark">
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
import { equipList ,buildingList, equipDelete, equipAdd } from '@/api/equip'
import { selectCommunityList, MansionHouseList } from '@/api/house'
import { MansionList } from '@/api/userinfo'
import Pagination from '@/components/Pagination'
import { setTimeout } from 'timers';
import publicIndex from '../mixins/publicIndex'

export default {
  components:{
    Pagination
  },
  mixins:[publicIndex],
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      loading:false,
      total:0,
      disabled:false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        communityId:'',
        mansionId:'',
        doorGuardName:''
      },
      form:{
        id: "",
        doorGuardType: "",
        trademark: "",
        doorGuardName: "",
        supplierid: "",
        address: "",
        mac: "",
        mansionId: "",
        remark: ""
      },
      mansionPar: {
        pageNum: 1,
        pageSize: 10,
        communityId:'',
        buildingName:''
      },
      formLabelWidth:'110px',
      doorGuardList:[
        {
          id:'1',
          val:'楼栋机'
        },
        {
          id:'2',
          val:'围墙机'
        }
      ],
      CommunityList:[],
      mansionList:[],
      NewmansionList:[],
    }
  },
  created() {
      this.fetchData()
      // this.buildingList()
      this.selectCommunityList()
      this.MansionHouseList()
  },
  methods: {
    //请求列表
    fetchData() {
      this.listLoading = true
      equipList(this.listQuery).then(response => {
        this.list = response.data.entryList;
        this.total = response.data.totalCount;
        this.listLoading = false
      })
    },
    // 请求楼栋
    MansionList(id){
      MansionList({communityId:id,buildingName:'',pageNum:'',pageSize:''}).then(res=>{
        this.NewmansionList = res.data
        // console.log(res)
      }).catch(err=>{
        // console.dir(err)
        
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
    // 请求小区 
    selectCommunityList(){
      selectCommunityList().then(res=>{
        this.CommunityList = res.data
      })
    },
     // 动态请求楼栋
    buildingList(e){
      this.listQuery.mansionId='';
      this.MansionList(e)
    },
    //删除机构
    handleDelete(index,row){
      const id = row.id
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipDelete({id}).then(res =>{
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
    //点击添加设备
    addRole(){
      this.dialogVisible = true;
      this.disabled = false;
      this.resetForm()
      this.$nextTick(()=>{
        this.$refs['form'].clearValidate()
      })
      // this.form = {};
      
    },
    //点击修改按钮
    revise(row){
      this.dialogVisible = true;
      this.disabled = true;
      // this.form = Object.assign({},row);
      let data=this.form
      for(var item in data){
        data[item] = row[item]
      }
      this.$nextTick(()=>{
        this.$refs['form'].clearValidate()
      })
    },
    resetForm(){
      this.form={
        id: "",
        doorGuardType: "",
        trademark: "",
        doorGuardName: "",
        supplierid: "",
        address: "",
        mac: "",
        mansionId: "",
        remark: ""
      }
    },
    //增加或修改公共方法
    insert(params){
      this.loading = true;
      equipAdd(params).then(res=>{
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
