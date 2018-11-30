<template>
  <div>
    <div class='marginB20'>
      <div class='marginB20'>
        <el-input v-model="asset_number" placeholder="维修编号搜索" class='search width200'></el-input>
        <el-date-picker v-model="create_time" type="daterange" range-separator="至" start-placeholder="维修起始日期" end-placeholder="维修起始日期"></el-date-picker>
        <el-select v-model="categoryName" placeholder="所属仓库">
          <el-option label='全部' value=''></el-option>
          <el-option v-for='(val,key) in listAll' :label='val.whName' :key='val.whId' :value='val.whId'></el-option>
        </el-select>
        <el-select v-model="status" placeholder="状态">
          <el-option label='全部' value=''></el-option>
          <el-option label='维修中' value='1'></el-option>
          <el-option label='维修完成' value='2'></el-option>
          <el-option label='报废' value='3'></el-option>
        </el-select>
      </div>
      <div class="flex jc-sb">
        <div>
          <el-button type="primary" @click='ajax_list($event,true)'>搜索</el-button>
        </div>
        <div>
          <el-button type="primary" @click='revoke'>批量维修完成</el-button>
          <el-button type="primary" @click='batch_scrap'>批量报废</el-button>
        </div>
      </div>
    </div>
    <el-table :data="list" style="width: 100%" class='marginB20' @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="使用寿命" class='width30' v-if='props.row.serviceLife'> <span>{{ props.row.serviceLife }}</span> </el-form-item>
            <el-form-item label="采购人" class='width30' v-if='props.row.buyer'> <span>{{ props.row.buyer }}</span> </el-form-item>
            <el-form-item label="采购时间" class='width30' v-if='props.row.buyDt'> <span>{{ props.row.buyDt }}</span> </el-form-item>
            <el-form-item label="发生时间" class='width30' v-if='props.row.applyDt'> <span>{{ props.row.applyDt }}</span> </el-form-item>
            <el-form-item label="故障等级" class='width30' v-if='props.row.troubleRank'> <span>{{ props.row.troubleRank }}</span> </el-form-item>
            <el-form-item label="维修说明" class='width30 marginB0' v-if='props.row.checkNotes'> <span>{{ props.row.checkNotes }}</span> </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" width="40"> </el-table-column>
      <el-table-column label="维修编号" prop="repairNo"> </el-table-column>
      <el-table-column label="资产名称" prop="devName"> </el-table-column>
      <el-table-column label="标签号" prop="labNo"> </el-table-column>
      <!-- <el-table-column label="所属公司" prop="desc"> </el-table-column> -->
      <el-table-column label="申请人" prop="applyBy"> </el-table-column>
      <el-table-column label="所属仓库" prop="branchWh"> </el-table-column>
      <el-table-column label="维修状态" prop="status">
        <template slot-scope="scope">
          <span v-if='scope.row.status==0'>待审核</span>
          <span v-else-if='scope.row.status==1'>维修中</span>
          <span v-else-if='scope.row.status==2'>维修完成</span>
          <span v-else-if='scope.row.status==3'>报废</span>
        </template>
      </el-table-column>
      <el-table-column label="维修时间" width='160'>
        <template slot-scope="scope">
          {{scope.row.repairDtTo}}<!-- -{{scope.row.repairDtTo}} -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="维修说明" prop="checkNotes"> </el-table-column> -->
      <el-table-column label="操作" width='250'>
        <template slot-scope="scope">
          <el-button v-if='scope.row.status==1' type="primary" size="mini" @click='is_modal=!is_modal,device=scope.row'>维修完成</el-button>
          <el-button v-if='scope.row.status==1' type="danger" size="mini" @click='scrap([scope.row.brId])'>报废</el-button>
          <!-- 维修中显示 -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size='8' :total="total" @current-change="handleCurrentChange"> </el-pagination>
    <div class="modal" v-if='is_modal'>
      <div class='modal-content'>
        <div class="center marginB20 size18">
          维修是否完成
        </div>
        <div class="marginB20">
          <textarea v-model='note' class="textarea padding10" name="" placeholder="维修完成或者维修报废说明100字以内" maxlength="100"></textarea>
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
      depot:'',//所属仓库
      selectionChange:[],//多选框
      list: [],
      listAll:[],//仓库列表
      is_modal:false,
      is_query:false,//是否是查询
      total:100,//总信息条数，
      device:{},
      index:1,
      batch:false,//是否是批量操作
      note:'',//维修说明
      categoryName:null,//所属仓库
      status:null,//状态

    }
  },
  created(){
    this.ajax_list()
    this.belong_to()
  },
  methods:{
    ajax_list(e,boo=false,page=1){/*获取维修列表*/
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
        url: '/ems/api/repair/list',
        data: {
          body
        },
        success(res){
          for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].applyDt=res.data.body.rows[i].applyDt ? self.TIME(res.data.body.rows[i].applyDt) : ''
            // res.data.body.rows[i].buyDt=res.data.body.rows[i].buyDt ? self.TIME(res.data.body.rows[i].buyDt) : ''
            // res.data.body.rows[i].occurredTime=res.data.body.rows[i].occurredTime ? self.TIME(res.data.body.rows[i].occurredTime) : ''
            // res.data.body.rows[i].repairDtFrom=res.data.body.rows[i].repairDtFrom ? self.TIME(res.data.body.rows[i].repairDtFrom) : ''
            // res.data.body.rows[i].repairDtTo=res.data.body.rows[i].repairDtTo ? self.TIME(res.data.body.rows[i].repairDtTo) : '--'
            // if(res.data.body.rows[i].status==1 || res.data.body.rows[i].status==2){
              self.list.push(res.data.body.rows[i])
            // }
          }
          self.total=res.data.body.count
        }
      })
    },
    handleSelectionChange(arr){ /*表格多选*/
      this.selectionChange=arr
    },
    batch_scrap(){//批量报废
      if(this.selectionChange.length<1){
        this.$message({
          message: '请选择资产',
          type: 'warning'
        });
      }else{
        var arr=[]
        for(let i=0;i<this.selectionChange.length;i++){
          arr.push(this.selectionChange[i].brId)
        }
        this.scrap(arr)
      }
    },
    handleCurrentChange(val){ /*分页获取数据*/
      this.index=val
      this.ajax_list(true,this.is_query,this.index)
    },
    no_finish(){
      this.is_modal=false
    },
    revoke(){/*批量维修完成按钮*/
      if(this.selectionChange.length<1){
        this.$message({
          message: '请选择资产',
          type: 'warning'
        });
      }else{
        for(let i=0;i<this.selectionChange.length;i++){
          if(this.selectionChange[i].status!=0){
            this.$message({
              message: '请选择待审核状态订单',
              type: 'warning'
            });
            return false
          }
        }
        this.is_modal=!this.is_modal
        this.batch=true
      }
    },
    finish(){/*维修完成*/   
      var self=this
      var arr=[]
      if(this.batch){
        if(this.selectionChange.length<1){
          this.$message({
            message: '请选择资产',
            type: 'warning'
          });
          return false
        }
        for(let i=0;i<this.selectionChange.length;i++){
          arr.push(this.selectionChange[i].brId)
        }
      }else{
        arr=[self.device.brId]
      }
      this.ajax({
        mode: 'post',
        url: '/ems/api/repair/changeStatus',
        data: {
          body:{
            ids:arr,
            status:2,
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
    scrap(arr){/*报废*/
      var self=this
      self.$confirm('此操作将该设备置为报废状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.ajax({
              mode: 'post',
              url: '/ems/api/repair/changeStatus',
              data: {
                body:{
                  ids:arr,
                  status:3
                }
              },
              success(res){
                self.$message({
                  message: '恭喜你，操作成功',
                  type: 'success'
                });
                self.ajax_list(true,self.is_query,self.index)
              }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    belong_to(){/*仓库列表*/
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
