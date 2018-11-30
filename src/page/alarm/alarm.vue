<template>
  <div>
    <div class='marginB20'>
      <div class='marginB20'>
        <!-- <el-date-picker v-model="create_time" type="date" placeholder="告警时间查询"> </el-date-picker> -->
        <el-date-picker v-model="create_time" type="daterange" range-separator="至" start-placeholder="告警时间查询" end-placeholder="告警时间查询"></el-date-picker>
        <el-select v-model="depot" placeholder="分类">
          <el-option label='全部' value=''></el-option>
          <el-option label='告警' value='1'></el-option>
          <el-option label='通知' value='2'></el-option>
        </el-select>
        <el-button type="primary" @click='ajax_list($event,true)'>搜索</el-button>
      </div>
    </div>
    <el-table :data="list" style="width: 100%" class='marginB20'>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="事件类型" class='width30'> <span>{{ props.row.evenType }}</span> </el-form-item>
            <!-- <el-form-item label="处理类型" class='width30'> <span>{{ props.row.handType }}</span> </el-form-item> -->
            <el-form-item label="设备编号" class='width30'> <span>{{ props.row.devNo }}</span> </el-form-item>
            <!-- <el-form-item label="分类" class='width30'> <span >{{ props.row.type==1 ? '告警' : '通知' }}</span> </el-form-item> -->
          </el-form>
        </template>
      </el-table-column>
      <!-- <el-table-column type="selection" width="40"></el-table-column> -->
      <el-table-column type="index" width="40"> </el-table-column>
      <el-table-column label="告警来源" prop="labNo"> </el-table-column>
      <el-table-column label="告警分类" prop="labNo">
        <template slot-scope="scope">
          <span v-if='scope.row.type==1' class='red'>
            告警
          </span>
          <span v-else>
            通知
          </span>
        </template>
      </el-table-column>
      <el-table-column label="告警内容" prop="content"> </el-table-column>
      <!-- <el-table-column label="原始内容" prop="originContent"> </el-table-column> -->
      <el-table-column label="告警提示" prop="evenType"> </el-table-column>
      <el-table-column label="告警时间" prop="handDt"> </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size='8' :total="total" @current-change="handleCurrentChange"> </el-pagination>
    <div class="modal" v-if='is_modal'>
      <div class='modal-content'>
        <div class="center marginB20 size18">
          维修是否完成
        </div>
        <div class="marginB20">
          <textarea class="textarea padding10" name="" placeholder="维修说明100字以内" maxlength="100"></textarea>
        </div>
        <div class="center">
          <el-button @click='no_finish'>未完成</el-button>
          <el-button type="primary" @click='finish'>已完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    	asset_number:'',//资产编号搜索
      create_time:'',//维修时间
      depot:null,//告警分类
      selectionChange:[],//多选框
      batch:'',//批量修改的状态
      list: [],
      is_modal:false,
      is_query:false,//是否是查询
      total:100,//总信息条数，
      listAll:[],//仓库列表
      index:1,
    }
  },
  created(){
    this.ajax_list()
  },
  methods:{
    ajax_list(e,boo=false,page=1){/*获取订单列表*/
      this.index=1
      var body={},self=this
      self.is_query=boo
      if(boo){
        body={
            // keyWord: self.query_name, 
            
            beginDate:self.create_time[0] ? self.TIME(self.create_time[0],true) : '',
            endDate:self.create_time[1] ? self.TIME(self.create_time[1],true) : '',
            type:self.depot ? Number(self.depot) : '',
            // warehouse:self.warehouse,
            page:page,
            pageSize:8,
          }
      }else{
        body={
          page: page, 
          pageSize: 8
        }
      }
      self.ajax({
        mode: 'post',
        url: '/ems/api/even/list',
        data: {
          body
        },
        success(res){
          // for(let i=0;i<res.data.body.rows.length;i++){
          //   res.data.body.rows[i].returnDt=res.data.body.rows[i].returnDt ? self.TIME(res.data.body.rows[i].returnDt) : '--' 
          //   res.data.body.rows[i].applyDt=res.data.body.rows[i].applyDt ? self.TIME(res.data.body.rows[i].applyDt) : '--' 
          //   res.data.body.rows[i].pickDt=res.data.body.rows[i].pickDt ? self.TIME(res.data.body.rows[i].pickDt) : '--' 
          //   res.data.body.rows[i].handDt=res.data.body.rows[i].handDt ? self.TIME(res.data.body.rows[i].handDt) : '--' 
          // }
          self.list=res.data.body.rows
          self.total=res.data.body.count
        }
      })
    },
    handleSelectionChange(arr){ /*表格多选*/
      this.selectionChange=arr
    },
    modify_state(){/*批量修改状态*/
      if(this.selectionChange.length<1){
        this.$message({
          message: '请选择资产',
          type: 'warning'
        });
      }else{

      }
    },
    handleCurrentChange(val){ /*分页获取数据*/
     this.index=val
      this.ajax_list(true,this.is_query,this.index)
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
            url:'/ems/api/even/deleteBatch',
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
    belong_to(page=1){/*仓库列表*/
      var self=this
      self.listAll=[]
      self.listF=[]
      self.ajax({
        mode: 'post',
        url: '/ems/api/warehouse/list',
        data: {
          body:{
            page:page,
            pageSize:1000
          }
        },
        success(res){
          for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt) : '--'
            if(res.data.body.rows[i].whType==2 && (res.data.body.rows[i].status==1 || res.data.body.rows[i].status==0)){
              self.listAll.push(res.data.body.rows[i])
            }
          }
          self.radio=0
          self.merge_depot=self.listAll[0].whName
          // self.ajax_listF(self.listAll[0].parWhId)
          self.total=self.listAll.length
        }
      })
    }
  },
  watch:{
    
  }
}
</script>

<style scoped>
	.textarea{
    width:500px;
    height:200px;
  }
</style>
