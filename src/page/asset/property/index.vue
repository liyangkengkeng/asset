<template>
  <div>
    <div class='marginB20'>
      <!-- <div class='marginB20'>
        <el-input v-model="asset_number" placeholder="资产编号搜索" class='search width200'></el-input>
        <el-date-picker v-model="create_time" type="daterange" range-separator="至" start-placeholder="维修起始日期" end-placeholder="维修起始日期"></el-date-picker>
        <el-select v-model="depot" placeholder="所属仓库">
          <el-option label='类型1' value='类型1'></el-option>
        </el-select>
      </div> -->
      <div class="flex jc-sb">
        <div>
          <!-- <el-button type="primary" @click='query'>搜索</el-button> -->
          <el-button type="primary" @click='is_modal=true'>创建</el-button>
        </div>
        
      </div>
    </div>
    <el-table :data="list" style="width: 100%" class='marginB20'>
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand flex ">
            <el-form-item label="设备类型"> <span>{{ props.row.type == 1 ? '借用设备' : '基础设施' }}</span> </el-form-item>
            <el-form-item label="备注"> <span>{{ props.row.remark }}</span> </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->
      <el-table-column type="index" width="40"> </el-table-column>
      <el-table-column label="属性编号" prop="categoryId"> </el-table-column>
      <el-table-column label="属性名称" prop="categoryName"> </el-table-column>
      <el-table-column label="更新时间" prop="updateDt"> </el-table-column>
      <el-table-column label="备注" prop="remark"> </el-table-column>
      <el-table-column label="操作" width='160'>
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click='edit(scope.row,scope.$index)'>编辑</el-button>
          <el-button type="danger" size="mini" @click='del(scope.row,scope.$index)'>删除</el-button><!-- 是否有标签 -->
          <!-- <el-button type="primary" size="mini" @click='repair(scope.row,scope.$index)'>维修</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size='10' :total="total" @current-change="handleCurrentChange"> </el-pagination>
    <div class="modal" v-if='is_modal'>
      <div class='modal-content'>
        <div class="center marginB20 size18">
          创建属性
        </div>
        <div class="marginB20">
          <div class="flex al-ce marginB20">
            <p class="must width120 fs0">属性名称</p><el-input v-model="categoryName" placeholder="请输入内容"></el-input>
          </div>
          <div class="flex marginB20">
            <p class="height40 width120 fs0">属性备注</p>
            <textarea name="" class='width100 textarea' v-model="remark"></textarea>
          </div>
        </div>
        <div class="center">
          <el-button @click='is_modal=false'>取消</el-button>
          <el-button type="primary" @click='sub'>确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      depot:'',//所属仓库
    	asset_number:'',//资产编号搜索
      create_time:'',//维修时间
      list: [],
      is_modal:false,
      categoryName:'',//属性名称
      remark:'',//属性备注
      type:'',//属性级别
      total:1,
      categoryId:'',
    }
  },
  created(){
    this.ajax_list()
  },
  methods:{
    ajax_list(page=1){/*获取人员列表*/
      var self=this
      self.ajax({
        mode: 'post',
        url: '/ems/api/category/list',
        data: {
          body:{
            page: page, 
            pageSize: 10
          }
        },
        success(res){
          // for(let i=0;i<res.data.body.rows.length;i++){
          //   res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt,true) : '--'
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
            url:'/ems/api/category/deleteBatch',
            data:{
              body:{
                ids:[val.categoryId]
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
    edit(val,index){/*编辑*/
      this.is_modal=true
      this.categoryName=val.categoryName
      this.remark=val.remark
      this.categoryId=val.categoryId
    },
    handleCurrentChange(val){ /*分页获取数据*/
      this.ajax_list(val)
    },
    sub(){
      var self=this
      if(self.categoryName){
        var url='/ems/api/category/save'
        var body={
              categoryName:self.categoryName,
              remark:self.remark
            }
        if(this.categoryId){
          body.categoryId=this.categoryId
          url='/ems/api/category/update'
        }
        self.ajax({
          mode: 'post',
          url: url,
          data: {
            body
          },
          success(res){
            self.is_modal=false
            self.ajax_list()
          }
        })
      }else{
        this.$message({
          message: '请填写属性名称',
          type: 'warning'
        });
      }
    }
  },
  watch:{
    is_modal(val){
      if(!val){
        this.categoryName=''
        this.remark=''
        this.categoryId=''
      }
    }
  }
}
</script>

<style scoped>
	.modal-content{
    width: 600px;
  }
  .textarea{
    padding: 10px;
    height: 130px;
    border:1px solid #dcdfe6;
  }
</style>
