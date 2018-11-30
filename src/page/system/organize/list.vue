<template>
  <div>
    <div class='marginB20'>
      <!-- <div class='flex marginB20'>
        <el-input v-model="query_name" placeholder="名称搜索" class='search marginR20 width200'></el-input>
        <el-select v-model="depot" placeholder="所属仓库" class='marginR20'>
          <el-option label='类型1' value='类型1'></el-option>
        </el-select>
        <el-select v-model="customer_type" placeholder="用户类型选择">
          <el-option label='类型1' value='类型1'></el-option>
        </el-select>
      </div> -->
      <div>
        <!-- <el-button type="primary" @click='ajax_list($event,true)'>搜索</el-button> -->
        <router-link class='btn marginL20' :to='{name:"addOrganize"}'>创建</router-link>
      </div>
    </div>
    <el-table :data="list" style="width: 100%" class='marginB20'>
      
      <el-table-column type="index" width="40"> </el-table-column>
      <!-- <el-table-column label="所属公司" prop="id"> </el-table-column> -->
      <el-table-column label="组织名称" prop="deptName"> </el-table-column>
      <!-- <el-table-column label="组织级别">
        <template slot-scope="scope">
          {{scope.row.parentDeptId+1}}
        </template>
      </el-table-column> -->
      <el-table-column label="所属上级" prop="parentDeptName"> </el-table-column>
      <el-table-column label="操作" width='160'>
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" @click='edit(scope.row,scope.$index)'>编辑</el-button> -->
          <router-link class='min-btn marginL20' :to='{name:"addOrganize",query:{obj:JSON.stringify(scope.row)}}'>编辑</router-link>
          <el-button type="danger" size="mini" @click='del(scope.row,scope.$index)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size='10' :total="total" @current-change="handleCurrentChange"> </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query_name:'',
      depot:'',//所属仓库
      customer_type:'',//用户类型选择
      list: [],
      system:false,//模态框
      status:true,//录入、编辑
      edit_data:{},
      total:100,//总信息条数，
      is_query:false,//是否是查询
    }
  },
  created(){
    this.ajax_list()
  },
  methods:{
    ajax_list(e,boo=false,page=1){/*获取人员列表*/
      var body={},self=this
      self.is_query=boo
      if(boo){
        body={
            keyWord: self.query_name, 
            page:page,
            pageSize:10,
          }
      }else{
        body={
          page: page, 
          pageSize: 10
        }
      }
      self.ajax({
        mode: 'post',
        url: '/ems/api/dept/list',
        data: {
          body
        },
        success(res){
          // for(let i=0;i<res.data.body.rows.length;i++){
          //   res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt) : '--'

          // }
          self.list=res.data.body.rows
          self.total=res.data.body.count
        }
      })
    },
    del(val,index){/*删除*/
      var self=this
      self.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.ajax({
            mode:'post',
            url:'/ems/api/dept/deleteBatch',
            data:{
              body:{
                ids:[val.deptId]
              }
            },
            success(res){
              self.list.splice(index,1)
              self.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleCurrentChange(val){ /*分页获取数据*/
      this.ajax_list(true,this.is_query,val)
    }
  },
  watch:{
    
  }
}
</script>

<style scoped>
  .btn{
    padding:0px 20px;
    height:40px;
    line-height: 40px;
  }
</style>
