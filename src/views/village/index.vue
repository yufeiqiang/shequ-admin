<template>
  <div class="app-container">
    <div class="head_box">
      <el-select v-model="listQuery.orgId" clearable filterable placeholder="请选择机构">
        <el-option
          v-for="item in organizationList" 
          :key="item.id"
          :label="item.organizationName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.propertyCategory" clearable filterable placeholder="请选择类型">
        <el-option
          v-for="item in properCategList"
          :key="item.index"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.communityName" placeholder="小区名称" style="width: 200px;"  autocomplete="off"></el-input>
      <el-button type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
      <el-button type="primary" @click="addRole">添加小区</el-button>
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
          <span>{{ scope.row.org | extract('organizationName') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小区名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.communityName }}
        </template>
      </el-table-column>
      <el-table-column label="联系地址" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="占地面积" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.floorSpace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="建筑面积" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buildingArea }}</span>
        </template>
      </el-table-column>
      <el-table-column label="停车位" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parkingSpot }}</span>
        </template>
      </el-table-column>
      <el-table-column label="楼栋总数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sumBuilding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总户数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sumHousehold }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物业类别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.propertyCategory }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="建筑类别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buildingCategory }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="产品年限" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.periodInt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="建筑类别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buildingCategory }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="开发商" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.developers }}</span>
        </template>
      </el-table-column> -->
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
      <el-table-column align="center" prop="created_at" label="描述" >
        <template slot-scope="scope">
          {{scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" width="148"  fixed="right" label="操作">
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
    <el-dialog title="添加小区" :visible.sync="dialogVisible"  center>
      <el-form  
      label-width="100px"
      :model="form" 
      ref="form" 
      size="small"
      class="form_style"
      :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="小区名称" prop="communityName">
              <el-input v-model="form.communityName"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" ></el-input>
            </el-form-item>
            <el-form-item label="容积率" prop="occupancyRate">
              <el-input v-model="form.occupancyRate"></el-input>
            </el-form-item>
            <el-form-item label="绿化率" prop="greeningRate">
              <el-input v-model="form.greeningRate"></el-input>
            </el-form-item>
            <el-form-item label="楼宇状况" prop="buildingCondition">
              <el-input v-model="form.buildingCondition"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构"  prop="organizationId">
              <el-select v-model="form.organizationId" filterable placeholder="请选择">
                <el-option
                  v-for="item in organizationList" 
                  :key="item.id"
                  :label="item.organizationName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="建筑类别" prop="buildingCategory">
              <el-select v-model="form.buildingCategory" filterable placeholder="请选择">
                <el-option
                  v-for="item in builCateList"
                  :key="item.id"
                  :label="item.buiName"
                  :value="item.buiName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物业类别" prop="propertyCategory">
              <el-select v-model="form.propertyCategory" filterable placeholder="请选择">
                <el-option
                  v-for="item in properCategList"
                  :key="item.index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开发商" prop="developers">
              <el-input v-model="form.developers"></el-input>
            </el-form-item>
            <el-form-item label="物业费(元)"  prop="propertyFee">
              <el-input v-model="form.propertyFee"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="占地面积(m²)"   prop="floorSpace">
              <el-input-number v-model="form.floorSpace" controls-position="right"  :min="1" ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="建筑面积(m²)"  prop="buildingArea">
              <el-input-number v-model="form.buildingArea" controls-position="right"  :min="1" ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼栋总数(栋)"  prop="sumBuilding">
              <el-input-number v-model="form.sumBuilding" controls-position="right"  :min="1" ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="停车位(个)"  prop="parkingSpot">
              <el-input-number v-model="form.parkingSpot" controls-position="right"  :min="1" ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总户数(户)"  prop="sumHousehold">
              <el-input-number v-model="form.sumHousehold" controls-position="right"  :min="1" ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品年限(年)"  prop="periodInt">
              <el-input-number v-model="form.periodInt" controls-position="right"  :min="1" ></el-input-number>
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
import { communityList, propertyType, selectOgrName, addCommunity, delCommunity } from '@/api/house'
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
        communityName:'',
        propertyCategory:'',
        orgId:''
      },
      form:{
        id:'',
        communityName:'',                          
        address:'',
        floorSpace:'',
        buildingArea:'',
        occupancyRate:'',
        greeningRate:'',
        parkingSpot:'',
        sumBuilding:'',
        sumHousehold:'',
        propertyFee:'',
        propertyCategory:'',
        buildingCategory:'',
        buildingCondition:'',
        periodInt:'',
        developers:'',
        remark:'',
        organizationId:'',
      },
      builCateList:[
        {id:1,buiName:'楼梯'},
        {id:2,buiName:'板楼'},
        {id:3,buiName:'楼梯/电梯'}
      ],
      properCategList:[],
      organizationList:[]
    }
  },
  created() {
      this.fetchData()
      this.propertyType()
      this.selectOgrName()   
  },
  methods: {
    //请求列表
    fetchData() {
      this.listLoading = true
      communityList(this.listQuery).then(response => {
        this.list = response.data.entryList;
        this.total = response.data.totalCount;
        this.listLoading = false
      })
    },
    // 物业列表
    propertyType() {
      propertyType().then(res =>{
        let { data } = res
        this.properCategList = data.propertyCategory
      })
    },
    // 机构列表
    selectOgrName() {
      selectOgrName().then(res =>{
        let {data} = res
        this.organizationList = data
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
        delCommunity({id}).then(res =>{
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
    //点击添加按钮
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
      this.form.organizationId=row.org.id
       this.$nextTick(function(){
        this.$refs['form'].clearValidate()
      })
    },
    //增加或修改公共方法
    insert(params){
      this.loading = true;
      addCommunity(params).then(res=>{
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
