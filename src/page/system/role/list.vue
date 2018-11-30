<template>
  <div>
    <div class='marginB20'>
      <div class='flex marginB20'>
        <!-- <el-input v-model="query_name" placeholder="名称搜索" class='search marginR20 width200'></el-input> -->
        <!-- <el-button type="primary" @click='ajax_list($event,true)'>搜索</el-button> -->
        <router-link class='btn marginL20' :to='{name:"addRole"}'>创建</router-link>
      </div>
    </div>
    <el-table :data="list" style="width: 100%" class='marginB20'>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand flex">
            <el-form-item label="创建者" class='fg'> <span>{{ props.row.createBy }}</span> </el-form-item>
            <el-form-item label="更新时间" class='fg'> <span>{{ props.row.updateDt }}</span> </el-form-item>
            <el-form-item label="更新人员" class='fg'> <span>{{ props.row.updateBy }}</span> </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" width="40"> </el-table-column>
      <el-table-column label="角色名称" prop="roleName"> </el-table-column>
      <el-table-column label="角色说明" prop="remark"> </el-table-column>
      <el-table-column label="创建时间" prop="createDt"> </el-table-column>
      <!-- <el-table-column label="标签规则" prop="desc"> </el-table-column> -->
      <el-table-column label="操作" width='160'>
        <template slot-scope="scope">
          <div v-if='scope.row.roleId==2 || scope.row.roleId==3 || scope.row.roleId==4'>
            
          </div>
          <div v-else>
            <router-link class='min-btn marginL20' :to='{name:"addRole",query:{obj:JSON.stringify(scope.row)}}'>编辑</router-link>
            <el-button type="danger" size="mini" @click='del(scope.row,scope.$index)'>删除</el-button>
          </div>
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
    ajax_list(e,boo=false,page=1){
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
        url: '/ems/api/role/list',
        data: {
          body
        },
        success(res){
          // for(let i=0;i<res.data.body.rows.length;i++){
          //   res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt) : '--'
          //   res.data.body.rows[i].updateDt=res.data.body.rows[i].updateDt ? self.TIME(res.data.body.rows[i].updateDt) : '--'
          // }
          self.list=res.data.body.rows
          self.total=res.data.body.count
        }
      })
    },
    del(val,index){/*删除*/
      var self=this
      self.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.ajax({
            mode:'post',
            url:'/ems/api/role/deleteBatch',
            data:{
              body:{
                ids:[val.roleId]
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
      console.log(val)
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
