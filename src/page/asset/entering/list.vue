<template>
  <div>
    <div class='marginB20'>
      <div class='marginB20'>
        <!-- <el-input v-model="asset_number" placeholder="资产编号搜索" class='search width200'></el-input> -->
        <el-date-picker v-model="foundDate" format="yyyy 年 MM 月 dd 日" type="daterange" range-separator="至" start-placeholder="创建起始日期" end-placeholder="创建起始日期"></el-date-picker>
        <el-date-picker v-model="inspectData" format="yyyy 年 MM 月 dd 日" type="daterange" range-separator="至" start-placeholder="年检起始日期" end-placeholder="年检起始日期"></el-date-picker>
        <el-select v-model="whNo" placeholder="请选择总仓">
          <el-option v-for="item in listAll" :key="item.whName" :label="item.whName" :value="item.whNo"> </el-option>
        </el-select>
        <el-select v-model="branchWhNo" placeholder="请选择分仓">
          <el-option v-for="item in listF" :key="item.whName" :label="item.whName" :value="item.whNo"> </el-option>
        </el-select>
        <div class='marginT20'>
          <el-select v-model="obj.isActive" placeholder="激活状态">
             <el-option label='全部' value=''></el-option>
            <el-option label='已激活' value='1'></el-option>
            <el-option label='未激活' value='0'></el-option>
          </el-select>
          <el-select v-model="obj.useType" placeholder="设备类型">
            <el-option label='全部' value=''></el-option>
            <el-option label='可借用' value='1'></el-option>
            <el-option label='不可借用' value='2'></el-option>
          </el-select>
          <el-select v-model="obj.borrowStatus" placeholder="设备借出状态">
            <el-option label='全部' value=''></el-option>
            <el-option label='已借出' value='2'></el-option>
            <el-option label='未借出' value='0'></el-option>
          </el-select>
          <el-select v-model="obj.abnormalStatus" placeholder="异常状态">
            <el-option label='全部' value=''></el-option>
            <el-option label='在库' value='0'></el-option>
            <el-option label='异常出库' value='1'></el-option>
            <el-option label='场外丢失' value='2'></el-option>
          </el-select>
          <el-select v-model="obj.workOrderStatus" placeholder="工单状态">
            <el-option label='全部' value=''></el-option>
            <el-option label='维修' value='1'></el-option>
            <el-option label='报废' value='2'></el-option>
            <el-option label='丢失' value='3'></el-option>
            <el-option label='年检' value='4'></el-option>
          </el-select>
        </div>
        
      </div>
      <div class="flex jc-sb">
        <div>
          <el-button type="primary" @click='query'>搜索</el-button>
          <el-button type="primary" @click='resetting'>重置</el-button>
          <router-link class='btn marginL20' :to='{name:"add"}'>录入</router-link>
        </div>
        <div>
          <!-- <el-select v-model="state" placeholder="选择批量状态修改" :disabled='edit_state'>
            <el-option label='取消' value='10'></el-option>
            <el-option label='置为维修' value='类型1'></el-option>
            <el-option label='置为年检' value='类型1'></el-option>
            <el-option label='置为报废' value='类型1'></el-option>
            <el-option label='置为丢失' value='类型1'></el-option>
          </el-select> -->
          <!-- <el-select v-model="isActive" placeholder="选择激活设备" :disabled='edit_isActive'>
            <el-option label='取消' value='10'></el-option>
            <el-option label='置为激活' value='激活'></el-option>
            <el-option label='置为未激活' value='未激活'></el-option>
          </el-select> -->
          <el-button type="primary" @click='modify_state'>批量激活</el-button>
          <el-button type="primary" @click='excel'>导出资源列表</el-button>
        </div>
      </div>
    </div>
    <el-table :data="list" style="width: 100%" class='marginB20' @selection-change="handleSelectionChange" @expand-change='spread'>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="规格型号" class='width30 marginB0' v-if='props.row.spec'> <span>{{ props.row.spec }}</span> </el-form-item>
            <el-form-item label="生产厂商" class='width30 marginB0' v-if='props.row.facturer'> <span>{{ props.row.facturer }}</span> </el-form-item>
            <el-form-item label="供应商" class='width30 marginB0' v-if='props.row.supplier'> <span>{{ props.row.supplier }}</span> </el-form-item>
            <el-form-item label="使用寿命" class='width30 marginB0' v-if='props.row.serviceLife'> <span>{{ props.row.serviceLife }}</span> </el-form-item>
            <el-form-item label="采购时间" class='width30 marginB0' v-if='props.row.buyDt'> <span>{{ props.row.buyDt }}</span> </el-form-item>
            <el-form-item label="采购人" class='width30 marginB0' v-if='props.row.buyer'> <span>{{ props.row.buyer }}</span> </el-form-item>
            <el-form-item label="备注" class='width30 marginB0' v-if='props.row.notes'> <span>{{ props.row.notes }}</span> </el-form-item>
            <el-form-item label="设备最近注册时间" class='width30 marginB0' v-if='props.row.lastRegDt'> <span>{{ props.row.lastRegDt }}</span> </el-form-item>
            <el-form-item label="设备在线状态" class='width30 marginB0'> 
              <span>{{ props.row.onlineState==1 ? '在线' : '不在线' }}</span> 
            </el-form-item>
            <el-form-item label="年检说明" class='width30 marginB0' v-if='props.row.checkNote'> <span>{{ props.row.checkNote }}</span> </el-form-item>
            <el-form-item label="年检报警天数" class='width30 marginB0' v-if='props.row.checkWarnDayNum'> <span>{{ props.row.checkWarnDayNum }}</span> </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" width="40"> </el-table-column>
      <el-table-column label="缩略图">
        <template slot-scope="scope">
          <img :src="scope.row.imageLarge || logo" class="thumbnail" alt="">
        </template>
      </el-table-column>
      <el-table-column label="资产编号" prop="devNo"> </el-table-column>
      <el-table-column label="资产名称" prop="devName"> </el-table-column>
      <el-table-column label="标签号" prop="labNo"> </el-table-column>
      <el-table-column label="所属仓库" prop="branchWh">
        <template slot-scope="scope">
          <span v-if='scope.row.deviceType==1'>{{scope.row.whName}}</span>
          <span v-else>{{scope.row.branchWh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" prop="useType">
        <template slot-scope="scope">
          {{scope.row.useType==1 ? '可借用' : '不可借用'}}
        </template>
      </el-table-column>
      <el-table-column label="激活状态" prop="isActive">
        <template slot-scope="scope">
          {{scope.row.isActive==1 ? '已激活' : '未激活 '}}
        </template>
      </el-table-column>
      <el-table-column label="设备借出状态" prop="borrowStatus">
        <template slot-scope="scope">
          <span v-if='scope.row.borrowStatus==1'>
            待审核
          </span>
          <span v-else-if='scope.row.borrowStatus==2'>
            已借出
          </span>
          <span v-else>
            未借出
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate" width='160'> </el-table-column>
      <el-table-column label="年检时间" prop="checkDt" width='160'> </el-table-column>
      <el-table-column label="操作" width='160'>
        <template slot-scope="scope">
          <router-link class='min-btn marginL20' :to='{name:"add",query:{obj:scope.row.devId}}'>编辑</router-link>
          <el-button type="danger" size="mini" @click='del(scope.row,scope.$index)'>删除</el-button>
          <!-- <el-button type="primary" size="mini" @click='edit(scope.row,scope.$index)'>编辑</el-button> -->
          
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size='10' :total="total" @current-change="handleCurrentChange"> </el-pagination>
    <!-- <v-entering v-if='entering' :edit_data='edit_data' :status='status' @sub='sub' @cancel='cancel'></v-entering> -->
  </div>
</template>

<script>
// import vEntering from './entering'
export default {
  data () {
    return {
      logo:require('@/assets/logo.png'),
      obj:{
        beginDate:'',//创建开始日期
        endDate:'',//创建结束日期
        beginCheckDate:'',//年检开始日期,
        endCheckDate:'',//年检结束日期
        whNo:'',//总仓库编号
        branchWhNo:'',//分仓库编号
        isActive:null,//是否激活
        useType:null,//设备类型
        borrowStatus:null,//设备借用状态
        abnormalStatus:null,//设备异常状态
        workOrderStatus:null,//工单状态
      },
      inspectData:'',//年检时间
      foundDate:'',//创建时间

      state:'',//批量修改的状态
      edit_state:false,
      isActive:'',//批量修改激活状态
      edit_isActive:false,

      list: [],//资产列表
      total:0,//总信息条数，
      selectionChange:[],//多选框
      listAll:[],//总仓列表
      listF:[],//分仓列表
      whNo:null,//总仓
      branchWhNo:'',//分仓
      is_search:false,//是否是搜索
    }
  },
  created(){
    this.ajax_list()
    this.ajax_AllList()
  },
  methods:{
    resetting(){/*重置按钮*/
      this.ajax_list()
      this.obj={
        beginDate:'',//创建开始日期
        endDate:'',//创建结束日期
        beginCheckDate:'',//年检开始日期,
        endCheckDate:'',//年检结束日期
        whNo:'',//总仓库编号
        branchWhNo:'',//分仓库编号
        isActive:'',//是否激活
        useType:'',//设备类型
        borrowStatus:'',//设备借用状态
        abnormalStatus:'',//设备异常状态
        workOrderStatus:'',//工单状态
      }
    },
    ajax_list(page=1){/*获取人员列表*/
      this.is_search=false
      var self=this
      self.ajax({
        mode: 'post',
        url: '/ems/api/device/list',
        data: {
          body:{
            page: page, 
            pageSize: 10
          }
        },
        success(res){
          // for(let i=0;i<res.data.body.rows.length;i++){
          //   res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt) : '--'
          //   res.data.body.rows[i].createDate=res.data.body.rows[i].createDate ? self.TIME(res.data.body.rows[i].createDate) : '--'
          //   res.data.body.rows[i].checkDt=res.data.body.rows[i].checkDt ? self.TIME(res.data.body.rows[i].checkDt) : ''
          //   res.data.body.rows[i].buyDt=res.data.body.rows[i].buyDt ? self.TIME(res.data.body.rows[i].buyDt) : ''
          //   res.data.body.rows[i].lastRegDt=res.data.body.rows[i].lastRegDt ? self.TIME(res.data.body.rows[i].lastRegDt) : ''
          // }
          self.list=res.data.body.rows
          self.total=res.data.body.count
        }
      })
    },
    query(e,page=1){/*搜索*/
      var self=this
      self.is_search=true
      this.list=[]
      if(this.inspectData){
        this.obj.beginCheckDate=this.TIME(this.inspectData[0],true)
        this.obj.endCheckDate=this.TIME(this.inspectData[1],true)
      }
      if(this.foundDate){
        this.obj.beginDate=this.TIME(this.foundDate[0],true)
        this.obj.endDate=this.TIME(this.foundDate[1],true)
      }
      this.obj.whNo=this.whNo
      this.obj.branchWhNo=this.branchWhNo
      self.obj.page=page
      self.obj.pageSize=10
      this.ajax({
        mode: 'post',
        url: '/ems/api/device/list',
        data:{
          body:self.obj
        },
        success(res){
          // for(let i=0;i<res.data.body.rows.length;i++){
          //   res.data.body.rows[i].createDt=res.data.body.rows[i].createDt ? self.TIME(res.data.body.rows[i].createDt) : '--'
          //   res.data.body.rows[i].createDate=res.data.body.rows[i].createDate ? self.TIME(res.data.body.rows[i].createDate) : '--'
          //   res.data.body.rows[i].checkDt=res.data.body.rows[i].checkDt ? self.TIME(res.data.body.rows[i].checkDt) : ''
          //   res.data.body.rows[i].buyDt=res.data.body.rows[i].buyDt ? self.TIME(res.data.body.rows[i].buyDt) : ''
          //   res.data.body.rows[i].lastRegDt=res.data.body.rows[i].lastRegDt ? self.TIME(res.data.body.rows[i].lastRegDt) : ''
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
            url:'/ems/api/device/deleteBatch',
            data:{
              body:{
                ids:[val.devId]
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
      if(this.is_search)
        this.query(true,val)
      else
        this.ajax_list(val)
    },
    handleSelectionChange(arr){ /*表格多选*/
      this.selectionChange=arr
    },
    spread(val,index){
      if(index.length>1)
        index.splice(0,1)
    },
    modify_state(){/*批量激活*/
      var self=this
      if(this.selectionChange.length<1){
        this.$message({
          message: '请选择资产',
          type: 'warning'
        });
      }else{
        for(let i=0;i<this.selectionChange.length;i++){
          if(this.selectionChange[i].isActive==1){
            this.$message({
              message: '选择的设备中存在已激活设备',
              type: 'warning'
            });
            return false
          }
        }
        var arr=[]
        for(let i=0;i<this.selectionChange.length;i++){
          arr.push(this.selectionChange[i].devId)
        }
        this.ajax({
          mode: 'post',
          url: '/ems/api/device/changeActive',
          data: {
            body:{
              ids:arr,
              status:1,
            }
          },
          success(res){
            self.$message({
              message: '恭喜你，操作成功',
              type: 'success'
            })
            if(self.is_search)
              self.query()
            else
              self.ajax_list()
          }
        })
      }
    },
    ajax_AllList(page=1){/*总仓列表*/
      var self=this
      self.listAll=[]
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
          self.listAll.push({whName:'全部',whId:''})
          for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].createDt=self.TIME(res.data.body.rows[i].createDt)
            if(res.data.body.rows[i].whType==1 && res.data.body.rows[i].status==1){
              self.listAll.push(res.data.body.rows[i])
            }
          }
        }
      })
    },
    ajax_listF(id){/*分仓列表*/
      var self=this
      self.listF=[]
      self.ajax({
        mode: 'post',
        url: '/ems/api/warehouse/list',
        data: {
          body:{
            page:1,
            pageSize:1000,
            parId:id
          }
        },
        success(res){
          self.listF.push({whName:'全部',whId:''})
          for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].createDt=self.TIME(res.data.body.rows[i].createDt)
            if(res.data.body.rows[i].whType==2 && res.data.body.rows[i].status==1){
              self.listF.push(res.data.body.rows[i])
            }
          }
        }
      })
    },
    excel(){
      this.ajax({
        mode: 'get',
        url: '/ems/api/report/device',
        data: {},
        success(res){
          const a = document.createElement('a'); // 创建a标签
          a.setAttribute('download', '');// download属性
          a.setAttribute('href', res.data.body);// href链接
          a.click();

        }
      })
    }
  },
  watch:{
    whNo(val){
      this.ajax_listF(val.parWhId)
    },
    isActive(val){
      if(val){
        this.edit_state=true
      }else{
        this.edit_state=false
      }
    },
    state(val){
      if(val){
        this.edit_isActive=true
      }else{
        this.edit_isActive=false
      }
    }
  },
  components:{
    // vEntering
  }
}
</script>

<style scoped>
	.thumbnail{
    width: 50px;height: 50px;
  }
  .btn{
    padding:0px 20px;
    height:40px;
    line-height: 40px;
  }
</style>
