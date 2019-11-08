<template>
  <div class="app-container">
    <div class="head_box">
      <el-select v-model="listQuery.organizationId" clearable  filterable placeholder="请选择机构">
        <el-option
          v-for="item in organListData"
          :key="item.id"
          :label="item.organizationName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.rolesId" clearable filterable placeholder="请选择角色">
        <el-option
          v-for="item in roleName"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
      <el-button type="primary" @click="addRole">添加账号</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="账号" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="角色"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role | extract('roleName') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机构" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.org | extract('organizationName') }}</span>
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
      <!-- <el-table-column align="center" prop="created_at" label="状态" >
        <template slot-scope="scope">
          <span :class="{active:parseInt(scope.row.deleteFlag)}">{{scope.row.deleteFlag | translate(tranParam)}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="created_at" label="头像" >
        <template slot-scope="scope">
          <span><img :src="scope.row.image" width="40" height="40"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" fixed="right" width="148" label="操作">
        <template slot-scope="scope" >
          <el-row>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
            <el-button type="primary" size="mini" @click="revise(scope.row)">修改</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>10" :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @pagination="fetchData" />
    <el-dialog title="添加账号" :visible.sync="dialogVisible"  center>
      <el-form  
      label-width="90px"
      :model="form" 
      ref="form" 
      size="small"
      :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户账号"  prop="username">
                <el-input v-model="form.username"  autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="选择角色"  prop="rolesId">
                <el-select v-model="form.rolesId" style="width:100%" filterable placeholder="请选择">
                  <el-option
                    v-for="item in roleName"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="地址"  prop="">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号"  prop="phone">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
              <el-form-item label="选择机构"   prop="organizationId">
                <el-select v-model="form.organizationId" style="width:100%" filterable placeholder="请选择机构">
                  <el-option
                    v-for="item in organListData"
                    :key="item.id"
                    :label="item.organizationName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="头像" class="photo_style" prop="image">
                <upload-photo @imgUrl="imgUrl" :imageUrl.sync="form.image"></upload-photo> 
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
import {managerList, deleteById, queryRolesName, organList, addManager, isUserName} from '@/api/app'
import Pagination from '@/components/Pagination'
import UploadPhoto from '@/components/uploadPhoto'
import { setTimeout } from 'timers';
import publicIndex from '../mixins/publicIndex'

export default {
  components:{
    Pagination,
    UploadPhoto
  },
  mixins:[publicIndex],
  data() {

    var usernameCheck = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'));
      } else {
         if(!this.form.id){
            isUserName({username:value}).then(res=>{
              callback()
            }).catch(res=>{
              return callback(new Error(res.message))
            })
          }else{
            callback()
          }
      }
    };
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      loading:false,
      total:0,
      tranParam:{0:'已注销',1:'使用中'},
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        organizationId:'',
        rolesId:''
      },
      form:{
        username:'',
        password:'',
        pass:'',
        phone:'',
        id:'',
        address:'',
        rolesId:'',
        organizationId:''
      },
      roleName:[],
      organListData:[],
      rules:{
        username: [
          { required: true, validator: usernameCheck, trigger: 'blur' },
        ]
      }
    }
  },
  created() {
      this.fetchData()
      this.queryRolesName()
      this.organList()
  },
  methods: {
    //请求列表
    fetchData() {
      this.listLoading = true
      managerList(this.listQuery).then(response => {
        this.list = response.data.entryList;
        this.total = response.data.totalCount;
        this.listLoading = false
      })
    },
    //请求角色列表
    queryRolesName(){
      queryRolesName({}).then(res =>{
        if (res.code ==200 && res.data.length>0) {
          let { data } = res
          this.roleName = data
        }
      })
    },
    // 请求机构列表
    organList(){
      organList({}).then(res =>{
        if (res.code ==200 && res.data.length>0) {
          let { data } = res
          this.organListData = data
          // console.log(data)
        }
      })
    },
    //删除账号
    handleDelete(index,row){
      const id = row.id
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById({id}).then(res =>{
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
      this.form.rolesId = row.role.id
      this.form.organizationId = row.org.id
       this.$nextTick(function(){
        this.$refs['form'].clearValidate()
      })
    },
    //增加或修改公共方法
    insert(params){
      this.loading = true;
      addManager(params).then(res=>{
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
          delete  this.form.pass
          console.log(this.form)
          this.dialogVisible = false;
        }
      })
    },
    // 接受图片
    imgUrl(e){
      this.form.image=e
    }
  }
}
</script>
<style>

</style>

