<template>
  <div class="app-container">
    <div class="head_box">
      <el-input v-model="listQuery.organizationName" placeholder="机构名称" style="width: 200px;"  autocomplete="off"></el-input>
      <el-input v-model="listQuery.organizationEnName" placeholder="机构英文名称" style="width: 200px;"  autocomplete="off"></el-input>
      <el-button type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
      <el-button type="primary" @click="addRole">添加机构</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="机构名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.organizationName }}
        </template>
      </el-table-column>
      <el-table-column label="机构英文名称"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.organizationEnName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主要负责人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.chief }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系地址"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contactAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="传真" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.faxes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="修改时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateDate | parseTime( '{y}/{m}/{d} {h}:{i}') }}
        </template>
      </el-table-column> -->
      <el-table-column align="center"  label="描述" >
        <template slot-scope="scope">
          {{scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="148" fixed="right" label="操作">
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
    <el-dialog title="添加机构" :visible.sync="dialogVisible"  center>
      <el-form  
      size="small"
      class="form_style number_style"
      label-width="110px"
      :model="form" 
      ref="form" 
      :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构名称" :label-width="formLabelWidth" prop="organizationName">
              <el-input v-model="form.organizationName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" :label-width="formLabelWidth" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址" :label-width="formLabelWidth" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="主要的负责人" :label-width="formLabelWidth" prop="secondary">
              <el-input v-model="form.secondary"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构英文名称" prop="organizationEnName">
              <el-input v-model="form.organizationEnName"></el-input>
            </el-form-item>
            <el-form-item label="传真" :label-width="formLabelWidth" prop="faxes">
              <el-input v-model="form.faxes"></el-input>
            </el-form-item>
            <el-form-item label="联系地址" :label-width="formLabelWidth" prop="contactAddress">
              <el-input v-model="form.contactAddress"></el-input>
            </el-form-item>
            <el-form-item label="次要的负责人" :label-width="formLabelWidth" prop="chief">
              <el-input v-model="form.chief"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item  label="描述"  class="textarea_width" prop="remark">
              <el-input type="textarea"  v-model="form.remark"></el-input>
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
import { OrganizationList, deleteOrgan, insertOrgan } from '@/api/app'
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
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        organizationName:'',
        organizationEnName:''
      },
      form:{
        organizationName:'',
        organizationEnName:'',
        remark:'',
        id:'',
        contactAddress:'',
        chief:'',
        phone:'',
        faxes:'',
        email:''
      }
    }
  },
  created() {
      this.fetchData()
      // this.total = 10
  },
  methods: {
    //请求列表
    fetchData() {
      this.listLoading = true
      OrganizationList(this.listQuery).then(response => {
        this.list = response.data.entryList;
        this.total = response.data.totalCount;
        this.listLoading = false
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
        deleteOrgan({id}).then(res =>{
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
       this.$nextTick(function(){
        this.$refs['form'].clearValidate()
      })
    },
    //增加或修改公共方法
    insert(params){
      this.loading = true;
      insertOrgan(params).then(res=>{
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
          // this.$refs[fromName].resetFields()
          this.dialogVisible = false;
        }
      })
    }
  }
}
</script>
