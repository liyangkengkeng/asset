<template>
  <div>
    <div class='marginB20'>
      <div class='marginB20'>
        <el-input v-model="asset_number" placeholder="丢失编号搜索" class='search width200'></el-input>
        <el-date-picker v-model="create_time" type="daterange" range-separator="至" start-placeholder="丢失起始日期" end-placeholder="丢失起始日期"></el-date-picker>
        <el-select v-model="categoryName" placeholder="所属仓库">
          <el-option label='全部' value=''></el-option>
          <el-option v-for='(val,key) in listAll' :label='val.whName' :key='val.whId' :value='val.whId'></el-option>
        </el-select>
        <el-select v-model="status" placeholder="状态">
          <el-option label='全部' value=''></el-option>
          <el-option label='待审核' value='1'></el-option>
          <el-option label='已丢失' value='2'></el-option>
        </el-select>
      </div>
      <div class="flex jc-sb">
        <div>
          <el-button type="primary" @click='ajax_list($event,true)'>搜索</el-button>
        </div>
        <div>
          <el-button type="primary" @click='revoke(true)'>批量撤销丢失</el-button>
          <el-button type="primary" @click='revoke(false)'>批量丢失</el-button>
        </div>
      </div>
    </div>
    <el-table :data="list" style="width: 100%" class='marginB20' @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="使用寿命" class='width30' v-if='props.row.serviceLife'> <span>{{ props.row.serviceLife }}</span> </el-form-item>
            <el-form-item label="采购时间" class='width30' v-if='props.row.buyDt'> <span>{{ props.row.buyDt }}</span> </el-form-item>
            <el-form-item label="分仓名称" class='width30' v-if='props.row.branchWh'> <span>{{ props.row.branchWh }}</span> </el-form-item>
            <el-form-item label="总仓名称" class='width30' v-if='props.row.masterWh'> <span>{{ props.row.masterWh }}</span> </el-form-item>
            <el-form-item label="责任人" class='width30' v-if='props.row.duty'> <span>{{ props.row.duty }}</span> </el-form-item>
            <el-form-item label="损失金额" class='width30' v-if='props.row.lossAmount'> <span>{{ props.row.lossAmount }}</span> </el-form-item>
            <el-form-item label="赔偿说明" class='width30' v-if='props.row.paidNote'> <span>{{ props.row.paidNote }}</span> </el-form-item>
            <el-form-item label="丢失说明" class='width30' v-if='props.row.checkNotes'> <span>{{ props.row.checkNotes }}</span> </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" width="40"> </el-table-column>
      <el-table-column label="丢失编号" prop="blsNo"> </el-table-column>
      <el-table-column label="资产名称" prop="devName"> </el-table-column>
      <el-table-column label="标签号" prop="labNo"> </el-table-column>
      <!-- <el-table-column label="标签规则" prop="desc"> </el-table-column> -->
      <!-- <el-table-column label="所属公司" prop="desc"> </el-table-column> -->
      <el-table-column label="申请人" prop="applyBy"> </el-table-column>
      <el-table-column label="所属仓库" prop="branchWh"> </el-table-column>
      <el-table-column label="丢失状态">
        <template slot-scope="scope">
          <span v-if='scope.row.status==1'>待审核</span>
          <span v-else-if='scope.row.status==2'>已丢失</span>
          <span v-else-if='scope.row.status==3'>已撤销</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" prop="checkDt"> </el-table-column>
      <!-- <el-table-column label="撤销时间" prop="desc"> </el-table-column> -->09418401   18144465
      <el-table-column label="操作" width='200'>
        <template slot-scope="scope">
          <el-button v-if='scope.row.status==1' type="primary" size="mini" @click='is_modal=!is_modal,device=scope.row,is_endit=true'>丢失</el-button>
          <el-button v-if='scope.row.status==1' type="danger" size="mini" @click='revoke_lose(scope.row)'>撤销丢失</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size='8' :total="total" @current-change="handleCurrentChange"> </el-pagination>
    <div class="modal" v-if='is_modal'>
      <div class='modal-content'>
        <div class="center marginB20 size18">
          <span v-if='is_endit'>是否丢失物品</span>
          <span v-else>是否撤销丢失物品</span>
        </div>
        <div class="marginB20">
          <textarea v-model='note' class="textarea padding10" name="" placeholder="丢失说明100字以内" maxlength="100"></textarea>
        </div>
        <div class="center">
          <el-button @click='no_finish'>取消</el-button>
          <el-button type="primary" @click='finish'>确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      asset_number:'',
      create_time:'',
      categoryName:null,
      status:null,

      selectionChange:[],//多选框
      batch:'',//批量修改的状态
      list: [],
      is_modal:false,
      is_query:false,//是否是查询
      total:100,//总信息条数，
      listAll:[],//仓库列表
      device:{},
      index:1,
      batch:false,//是否是批量操作
      note:'',//说明
      is_revoke:false,//false批量丢失 true 批量撤销
      is_endit:false,//丢失还是撤销丢失状态
    }
  },
  created(){
    this.ajax_list()
    this.ong_to()
  },
  methods:{
    ajax_list(e,boo=false,page=1){/*获取人员列表*/
      this.index=1
      var body={},self=this
      self.list=[]
      self.is_query=boo
      if(boo){
        body={
            keyWord:self.asset_number,//订单编号
            status:self.status,
            beginDate:self.create_time[0] ? self.TIME(self.create_time[0],true) : "",
            endDate:self.create_time[0] ? self.TIME(self.create_time[1],true) : "",
            type:self.categoryName,//分仓
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
        url: '/ems/api/billLose/list',
        data: {
          body
        },
        success(res){
          // for(let i=0;i<res.data.body.rows.length;i++){
          //   res.data.body.rows[i].checkDt=res.data.body.rows[i].checkDt ? self.TIME(res.data.body.rows[i].checkDt) : '--'
          //   res.data.body.rows[i].buyDt=res.data.body.rows[i].buyDt ? self.TIME(res.data.body.rows[i].buyDt) : ''
          //   res.data.body.rows[i].loseDt=res.data.body.rows[i].loseDt ? self.TIME(res.data.body.rows[i].loseDt) : ''
          // }
          self.list=res.data.body.rows
          self.total=res.data.body.count
        }
      })
    },
    handleSelectionChange(arr){ /*表格多选*/
      this.selectionChange=arr
    },
    handleCurrentChange(val){ /*分页获取数据*/
      this.index=val
      this.ajax_list(true,this.is_query,val)
    },
    no_finish(){
      this.is_modal=false
    },
    ong_to(){/*仓库列表*/
      var self=this
      self.ajax({
        mode: 'post',
        url: '/ems/api/warehouse/list',
        data: {
          body:{
            page:1,
            pageSize:1000
          }
        },
        success(res){
          for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt) : '--'
            if(res.data.body.rows[i].whType==2 && res.data.body.rows[i].status==1){
              self.listAll.push(res.data.body.rows[i])
            }
          }
        }
      })
    },
    revoke(boo){/*批量按钮*/
      var self=this
      if(this.selectionChange.length<1){
        this.$message({
          message: '请选择订单',
          type: 'warning'
        });
      }else{
        this.batch=true
        this.is_revoke=boo  
        this.is_endit=!boo
        if(!boo){
          for(let i=0;i<this.selectionChange.length;i++){
            if(this.selectionChange[i].status!=1){
              this.$message({
                message: '所选表单中含有非待审核状态订单',
                type: 'warning'
              });
              return false
            }
          }
          this.is_modal=!this.is_modal
        }else{
          for(let i=0;i<this.selectionChange.length;i++){
            if(this.selectionChange[i].status!=1){
              this.$message({
                message: '所选表单中含有非待审核状态订单',
                type: 'warning'
              });
              return false
            }
          }
          self.$confirm('此操作将批量撤销, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
                self.finish()
          }).catch(() => {
            self.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        }
      }
    },
    revoke_lose(val){//撤销丢失
      this.batch=false
      this.is_endit=false
      var self=this
      self.$confirm('此操作将批量撤销, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            self.device=val
            self.finish()
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    finish(){/*丢失*/  
      var self=this
      var arr=[]
      if(this.batch){
        for(let i=0;i<this.selectionChange.length;i++){
          arr.push(this.selectionChange[i].blsId)
        }
      }else{
        arr=[self.device.blsId]
      }
      this.ajax({
        mode: 'post',
        url: '/ems/api/billLose/changeStatus',
        data: {
          body:{
            ids:arr,
            status:self.is_endit ? 2 : 3,
            note:self.note
          }
        },
        success(res){
          self.$message({
            message: '恭喜你，操作成功',
            type: 'success'
          });
          self.is_modal=false
          self.ajax_list(true,self.is_query,self.index)
          self.selectionChange=[]
          self.batch=false
        }
      })
    },
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
