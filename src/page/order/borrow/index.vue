<template>
  <div>
    <div class='marginB20'>

      <div class="flex jc-sb">
        <div class='marginB20'>
          <el-input v-model="asset_number" placeholder="订单编号搜索" class='search width200'></el-input>
          <el-date-picker v-model="create_time" type="daterange" range-separator="至" start-placeholder="订单起始日期" end-placeholder="订单起始日期"></el-date-picker>
          <el-select v-model="categoryName" placeholder="所属仓库">
            <el-option label='全部' value=''></el-option>
            <el-option v-for='(val,key) in listAll' :label='val.whName' :key='val.whId' :value='val.whId'></el-option>
          </el-select>
          <el-select v-model="status" placeholder="状态">
            <el-option label='全部' value=''></el-option>
            <el-option label='待审核' value='1'></el-option>
            <el-option label='待归还' value='2'></el-option>
            <el-option label='审核失败' value='3'></el-option>
            <el-option label='已撤销' value='4'></el-option>
            <el-option label='已归还' value='5'></el-option>
          </el-select>
          <el-button type="primary" @click='ajax_list($event,true)'>搜索</el-button>
        </div>
       <!--  <div>
          <el-select v-model="batch" placeholder="选择批量状态修改">
            <el-option label='类型1' value='类型1'></el-option>
          </el-select>
          <el-button type="primary" @click='modify_state'>确认</el-button>
        </div> -->
      </div>
    </div>
    <el-table :data="list" style="width: 100%" class='marginB20' @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="借出单位" class='width30 marginB0' v-if='props.row.rentCompany'> <span>{{ props.row.rentCompany}}</span> </el-form-item>
            <!-- <el-form-item label="取货时间" class='width30 marginB0' v-if='props.row.pickDt'> <span>{{ props.row.pickDt}}</span> </el-form-item> -->
            <el-form-item label="审核时间" class='width30 marginB0' v-if='props.row.reviewDt'> <span>{{ props.row.reviewDt}}</span> </el-form-item>
            <el-form-item label="预计归还时间" class='width30 marginB0' v-if='props.row.plReturnDt'> <span>{{ props.row.plReturnDt}}</span> </el-form-item>
            <el-form-item label="撤销时间" class='width30 marginB0' v-if='props.row.revocationDt'> <span>{{ props.row.revocationDt}}</span> </el-form-item>

            <el-form-item label="用途" class='width30 marginB0' v-if='props.row.purpose'> <span>{{ props.row.purpose}}</span> </el-form-item>
            <el-form-item label="施工地点" class='width30 marginB0' v-if='props.row.useAddress'> <span>{{ props.row.useAddress}}</span> </el-form-item>
            <el-form-item label="申请备注" class='width30 marginB0' v-if='props.row.applyNotes'> <span>{{ props.row.applyNotes}}</span> </el-form-item>
            <el-form-item label="审批意见" class='width30 marginB0' v-if='props.row.reviewNote'> <span>{{ props.row.reviewNote}}</span> </el-form-item>
            <el-form-item label="小挂件编号" class='width30 marginB0' v-if='props.row.hangLabNo'> <span>{{ props.row.hangLabNo}}</span> </el-form-item>
            <el-form-item label="施工领班编号" class='width30 marginB0' v-if='props.row.headmanNo'> <span>{{ props.row.headmanNo}}</span> </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" width="40"> </el-table-column>
      <el-table-column label="订单编号" prop="orderNo"> </el-table-column>
      <!-- <el-table-column label="所属公司" prop="name"> </el-table-column> -->
      <el-table-column label="所属仓库" prop="whName"> </el-table-column>
      <el-table-column label="借用人" prop="rentPeople"> </el-table-column>
      <el-table-column label="借用物品数量" prop="applyCount"> </el-table-column>

      <el-table-column label="借用时间" prop="applyDt" width='170'> </el-table-column>
      <el-table-column label="订单状态" prop="status">
        <template slot-scope="scope">
          <span v-if='scope.row.status==1'>待审核</span>
          <span v-else-if='scope.row.status==2'>待归还</span>
          <span v-else-if='scope.row.status==3'>已驳回</span>
          <span v-else-if='scope.row.status==4'>已撤销</span>
          <span v-else-if='scope.row.status==5'>已归还</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="rentPeople"> </el-table-column>
      <el-table-column label="归还时间" prop="returnDt" width='170'>
        <template slot-scope="scope">
          <span v-if='scope.row.status==1 || scope.row.status==2'>--</span>
          <span v-else>{{scope.row.returnDt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width='220'>
        <template slot-scope="scope">
          <el-button v-if='scope.row.status==1' type="primary" size="mini" @click='auditing("approve",scope.row,scope.$index)'>通过</el-button>
          <el-button v-if='scope.row.status==1' type="danger" size="mini" @click='auditing("reject",scope.row,scope.$index)'>不通过</el-button>
          <el-button v-if='scope.row.status==2' type="primary" size="mini" @click='giveBack(scope.row,scope.$index)'>确认归还</el-button>
          <!-- 状态：已完成无按钮 -->
          <!-- 审核通过：确认入库按钮 -->
          <!-- <el-button type="primary" size="mini" @click='repair(scope.row,scope.$index)'>报废</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size='8' :total="total" @current-change="handleCurrentChange"> </el-pagination>
    <div class="modal" v-if='is_modal'>
      <div class='modal-content'>
        <div class="center marginB20 size18">
          是否报废物品
        </div>
        <div class="marginB20">
          <textarea class="textarea padding10" name="" placeholder="报废说明100字以内" maxlength="100"></textarea>
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
      index:1,
    }
  },
  created(){
    this.ajax_list()
    this.belong_to()
  },
  methods:{
    ajax_list(e,boo=false,page=1){/*获取订单列表*/
      this.index=1
      var body={},self=this
      self.is_query=boo
      if(boo){
        body={
            keyWord:self.asset_number,//订单编号
            status:self.status,
            beginDate:self.create_time[0] ? self.TIME(self.create_time[0],true) : "",
            endDate:self.create_time[0] ? self.TIME(self.create_time[1],true) : "",
            type:self.categoryName,//分仓
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
        url: '/ems/api/order/list',
        data: {
          body
        },
        success(res){
          // for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].plReturnDt=res.data.body.rows[i].plReturnDt ? self.TIME(Number(res.data.body.rows[i].plReturnDt)) : ''
            // res.data.body.rows[i].returnDt=res.data.body.rows[i].returnDt ? self.TIME(Number(res.data.body.rows[i].returnDt)) : '--'
            // res.data.body.rows[i].applyDt=res.data.body.rows[i].applyDt ? self.TIME(Number(res.data.body.rows[i].applyDt)) : ''
            // res.data.body.rows[i].pickDt=res.data.body.rows[i].pickDt ? self.TIME(Number(res.data.body.rows[i].pickDt)) : ''
            // res.data.body.rows[i].reviewDt=res.data.body.rows[i].reviewDt ? self.TIME(Number(res.data.body.rows[i].reviewDt)) : ''
            // res.data.body.rows[i].revocationDt=res.data.body.rows[i].revocationDt ? self.TIME(Number(res.data.body.rows[i].revocationDt)) : ''
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
      this.ajax_list(true,this.is_query,this.index)
    },
    auditing(key,val,index){/*审核通过  审核不通过 已归还*/
      var self=this
      self.$confirm('此操作将修改订单状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.ajax({
            mode:'get',
            url:'/ems/api/order/'+key+'/order/'+val.orderId+'/branchWhNo/'+val.whNo,
            data:{},
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
    giveBack(val,index){/*已归还*/
      var self=this
      self.$confirm('此操作将修改订单状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.ajax({
            mode:'post',
            url:'/ems/api/order/compelGiveBack/order/'+val.orderId+'/branchWhNo/'+val.whNo,
            data:{},
            success(res){
              self.$message({
                message: '修改成功',
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
