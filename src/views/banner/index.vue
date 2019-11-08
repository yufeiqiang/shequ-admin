<template>
  <div class="app-container">
    <div class="head_box">
      <el-select v-model="listQuery.type" clearable filterable placeholder="请选发布类型">
        <el-option
          v-for="item in typeList"
          :key="item.type"
          :label="item.val"
          :value="item.type">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.status" clearable filterable placeholder="请选发布状态">
        <el-option
          v-for="item in statusList"
          :key="item.type"
          :label="item.val"
          :value="item.type">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" autocomplete="off"></el-input>
      <el-button type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
      <el-button type="primary" @click="revise">添加广告</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="机构" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.organization | extract('organizationName') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderNum }}
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.image" width="40" height="40"></span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span :class="{active:parseInt(scope.row.status)}">{{ scope.row.status | translate({0:'未发布',1:'已发布'})}}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type | translate({1:'轮播图',2:'活动资讯'})}}</span>
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
      <el-table-column align="center" prop="created_at" width="240" label="操作"  fixed="right">
        <template slot-scope="scope" >
          <el-row>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button type="primary" size="mini" @click="revise(scope.row)">修改</el-button>
            <el-button type="primary" size="mini" @click="publish(scope.row)" :disabled="!!parseInt(scope.row.status)">
              发布
            </el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>10" :total="total" :pageNum.sync="listQuery.pageNum" :pageSize.sync="listQuery.pageSize" @pagination="fetchData" />
  </div>
</template>

<script>
import {posterList, delPoster, publishPoster } from '@/api/poster'
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
      list: [],
      listLoading: true,
      dialogVisible: false,
      loading:false,
      total:0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        communityId:'' 
      },
      typeList:[
        {
          val:'请选择',
          type:""
        },
        {
          val:'轮播图',
          type:"1"
        },
        {
          val:'活动资讯',
          type:"2"
        }
      ],
      statusList:[
         {
          val:'请选择',
          type:""
        },
        {
          val:'已发布',
          type:"1"
        },
        {
          val:'未发布',
          type:"0"
        }
      ]
    }
  },
  created() {
      this.fetchData()
  },
  methods: {
    //请求列表
    fetchData() {
      this.listLoading = true
      posterList(this.listQuery).then(response => {
        this.list = response.data.entryList;
        // console.log(this.list)
        this.total = response.data.totalCount;
        this.listLoading = false;
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
        delPoster({id}).then(res =>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.total= this.total-1
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    //点击修改按钮
    revise(row={}){
      this.$router.push({path:'addbanner',query:{id:row.id}})
    },
    // 发布广告
    publish(row){
      const id = row.id
      this.$confirm('确定发布此信息?, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        publishPoster({id}).then(res =>{
          this.$message({
            type: 'success',
            message: '发布成功!'
          });
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        });          
      });
    }

  }
}
</script>
