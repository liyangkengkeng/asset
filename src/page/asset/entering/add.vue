<template>
  <div>
    <div class="flex jc-sb marginB20">
      <el-button @click='$router.back(-1)'>返回</el-button>
      <el-button type="primary" @click='sub'>保存</el-button>
    </div>
    <div class="flex">
      <div class="marginR40 width100">
        <div class="padding10 background colorF marginB20">
          基本信息
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">设备名称</p><el-input v-model="obj.devName" placeholder="请输入内容"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class=" width120 fs0">编号</p><el-input v-model="obj.selfNo" placeholder="请输入内容"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class="width120 fs0">规格型号</p><el-input v-model="obj.spec" placeholder="请输入内容"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">设备分类</p>
          <el-select v-model="category_obj" placeholder="请选择" class='width100'>
            <el-option v-for="(item,key) in device_class_list" :key="item.categoryName" :label="item.categoryName" :value="key"> </el-option>
          </el-select>
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">所属仓库</p>
          <el-select v-model="whNo_obj" placeholder="请选择总仓" class='width100'>
            <el-option v-for="(item,index) in listAll" :key="item.whName" :label="item.whName" :value="index"> </el-option>
          </el-select>
          <el-select v-model="branchWh_obj" placeholder="请选择分仓" class='width100' v-if='deviceType!=1'>
            <el-option v-for="(item,index) in listF" :key="item.whName" :label="item.whName" :value="index"> </el-option>
          </el-select>
        </div>
        <div class="flex al-ce marginB20" v-if='listF.length && deviceType==1'>
          <p class="width120 fs0"> &emsp;</p>
          <el-checkbox-group v-model="branchWh_obj_1" @change="handleCheckedCitiesChange" class='flex fw width100'>
              <el-checkbox class='width30 marginB10 marginL0 nowrap' :indeterminate="isIndeterminate" v-model="all_check" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox class='width30 marginB10 marginL0 nowrap' v-for="(item,index) in listF" :label="item.whNo" :key="index+100">{{item.whName}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="flex marginB20">
          <p class="width120 height40 fs0">图片上传</p>
          <div class="flex al-fe file-box">
            <div class="pr">
              <img :src="file_img" alt="" class="file-img">
              <!-- <form enctype="multipart/form-data" method='post' name="myform">
                <input type="file" name="upload" id="upload"  class="file-input pa cp" @change='change'>
                <button type="submit1" style="display:none" @click='check'>上传</button>
              </form> -->
              <input type="file" name=""  id="file" class="file-input pa cp" @change='change'>
            </div>
            <div>
              <p>点击上传图片</p>
              <el-button type="primary" class='width120 marginT20' :disabled='!file_img' @click='check'>上传</el-button>
            </div>
          </div>
        </div>
        <div class="padding10 background colorF marginB20">
          年检信息
        </div>
        <div class="flex al-ce marginB20">
          <p class="width120 fs0">年检预警</p><el-input v-model="obj.checkWarnDayNum" placeholder="输入提前多少天告警"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class="width120 fs0">年检时间</p>
          <el-date-picker class='width100' v-model="obj.checkDt" type="date" placeholder="选择年检时间"> </el-date-picker>
        </div>
        <div class="flex al-ce marginB20">
          <p class="width120 fs0">年检说明</p><el-input v-model="obj.checkNote" placeholder="请输入内容"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class="width120 fs0">年检周期</p>
          <el-input placeholder="请输入整数" v-model="obj.checkCycle" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"  onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}">
            <template slot="append">月</template>
          </el-input>
        </div>
        <div class="padding10 background colorF marginB20">
          入库信息
        </div>
        <div class="flex al-ce marginB20">
          <p class=" width120 fs0">生产日期</p>
          <el-date-picker class='width100' v-model="obj.buildDate" type="date" placeholder="生产日期"> </el-date-picker>
        </div>
        <div class="flex al-ce marginB20">
          <p class=" width120 fs0">生产商</p><el-input v-model="obj.facturer" placeholder="生产商"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class=" width120 fs0">供应商</p><el-input v-model="obj.supplier" placeholder="供应商"></el-input>
        </div>
        <div class="flex al-ce marginB20">
          <p class=" width120 fs0">采购时间</p><el-date-picker class='width100' v-model="obj.buyDt" type="date" placeholder="采购时间"> </el-date-picker>
        </div>
        <div class="flex al-ce marginB20">
          <p class=" width120 fs0">采购人</p><el-input v-model="obj.buyer" placeholder="采购人"></el-input>
        </div>
      </div>
      <div class="width100">
        <div class="padding10 background colorF marginB20">
          硬件信息
        </div>
        <div class="flex al-ce marginB20">
          <p class="must width120 fs0">硬件类型</p>
          <el-select v-model="deviceType" placeholder="请选择" :disabled='is_labNo ? true : false' class='width100'>
            <el-option label="无" value="0"></el-option>
            <el-option label="基站" value="1"></el-option>
            <el-option label="标签" value="2"></el-option>
          </el-select>
        </div>
        <div class="flex marginB20">
          <p class="must width120 height20 fs0">设备类型</p>
          <div>
            <p class="marginB5">
              <el-radio v-model="obj.useType" label="2">不可借用</el-radio>
              <el-radio v-model="obj.useType" label="1" v-if='deviceType=="2"'>可借用</el-radio>
            </p>
            <p class="size12">设备可借用，仓库盘点可见</p>
          </div>
        </div>
        <div class="flex marginB20">
          <p class="must width120 height20 fs0">激活状态</p>
          <div>
            <p class="marginB5">
              <el-radio v-model="obj.isActive" label="0">未激活</el-radio>
              <template v-if='deviceType!="0"'>
                <el-radio v-model="obj.isActive" label="1">激活</el-radio>
              </template>
            </p>
            <p class="size12">设备激活后,绑定的标设备监控签数据将上报</p>
          </div>
        </div>
        
        <div class="flex al-ce marginB20" v-if='deviceType!="0"'>
          <p class="width120 fs0 must">硬件编码</p>
          <el-input v-model="obj.labNo" :disabled='is_labNo ? true : false' placeholder="填写标签号码"></el-input>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  data () {
    return {
      input:'',
      file_img:'',
      deviceType:'0',//硬件类型
      obj:{
        imageLarge:'',//上传图片
        devName:'',//设备名称
        devNo:'',//设备编号
        spec:'',//设备型号
        categoryName:'',//设备分类
        categoryId:'',//分类ID
        checkWarnDayNum:'',//年检预警
        checkDt:'',//年检时间
        checkNote:'',//年检说明
        buildDate:'',//生产日期
        facturer:'',//生产商
        supplier:'',//供应商
        buyDt:'',//采购时间
        buyer:'',//采购人
        useType:'2',//设备类型 是否可借用
        isActive:'0',//设备激活状态
        labNo:'',//标签编码
        whNo:'',//总仓
        whName:'',//总仓名称
        branchWhNo:'',//分仓库
        branchWh:'',//分仓名称
        deviceType:0,//硬件类型
        checkCycle:'',//年检周期
      },
      boo_checkDt:true,//年检时间是否大于今天
      category_obj:null,//分类
      whNo_obj:null,//总仓
      branchWh_obj:'',//分仓单选
      branchWh_obj_1:[],//分仓 多选
      device_class_list:[],//设备分类列表
      listAll:[],//总仓列表
      listF:[],//分仓列表
      status:false,//是否是编辑
      file:null,
      is_labNo:false,//是否可编辑标签编码
      isIndeterminate:false,//分仓是否全选
      all_check:false,//分仓是否全选
    }
  },
  created(){
    var self=this
    if(this.$route.query.obj){
      this.ajax({
        mode:'get',
        url:'/ems/api/device/info/'+self.$route.query.obj,
        data:{},
        success(res){
          self.obj=res.data.body
          self.$set(self.obj,'isActive',self.obj.isActive.toString())
          self.$set(self.obj,'useType',self.obj.useType.toString())
          self.file_img=self.obj.imageLarge
          self.status=true
          self.is_labNo= self.obj.labNo ? true : false
          self.deviceType=''+self.obj.deviceType
          self.branchWh_obj_1=self.obj.branchWhNos
          self.ajax_list()
          self.ajax_class()
        }
      })
    }else{
      this.ajax_list()
      this.ajax_class()
    }
    
  },
  methods:{
    handleCheckedCitiesChange(val){
      // console.log(val)
    },
    handleCheckAllChange(val){
      if(val){
        for(let i=0;i<this.listF.length;i++){
          if(this.listF[i].whNo)
            this.branchWh_obj_1.push(this.listF[i].whNo)
        }
      }else{
        this.branchWh_obj_1 = []
      }
      
      this.isIndeterminate = false;
    },
    sub(){
      var self=this
      this.obj.deviceType=this.deviceType
      if(!this.deviceType){
        this.obj.labNo=''
      }
      if(this.deviceType==1){
        this.obj.whNoList=this.branchWh_obj_1
        this.obj.branchWh=null
        this.obj.branchWhNo=null
        if(!this.obj.whNoList || this.obj.whNoList.length<1){
          this.$message({message: '分仓不能为空',type: 'warning'})
          return;
        }
      }else{
        this.obj.whNoList=null
      }
      if(this.deviceType!=0 && !this.obj.labNo){
          this.$message({message: '请填写硬件编码',type: 'warning'})
          return false
      }
      if(this.obj.checkDt && !this.boo_checkDt){
        this.$message({message: '年检时间不能小于当前时间',type: 'warning'})
        return false;
      }
      if(this.obj.devName && this.obj.categoryName && this.obj.useType && this.obj.isActive){
        var url = this.status ? '/ems/api/device/update' : '/ems/api/device/save'
        this.obj.deviceType=Number(this.obj.deviceType)
        this.obj.useType=Number(this.obj.useType)
        this.obj.isActive=Number(this.obj.isActive)
        this.ajax({
          mode:'post',
          url:url,
          data:{
            body:self.obj
          },
          success(res){
            self.$message({
              message: '录入成功',
              type: 'success'
            });
            self.$router.push({name:'entering'})
          },
          error(err){
            self.$set(self.obj,'useType',self.obj.useType+'')
            self.$set(self.obj,'isActive',self.obj.isActive+'')
          }
        })
      }else{
        if(!this.obj.devName)
          this.$message({message: '请填写设备名称',type: 'warning'})
        else if(!this.obj.categoryName)
          this.$message({message: '请选择设备分类',type: 'warning'});
        else if(!self.obj.branchWhNo)
          this.$message({message: '请选择设备所属分仓',type: 'warning'});
        else if(!this.obj.useType)
          this.$message({message: '请选择设备类型',type: 'warning'});
        else if(!this.obj.isActive)
          this.$message({message: '请选择设备激活状态',type: 'warning'});
        
      }
    },
    change(event){ /*上传图片*/
      const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
      var self=this
      let file0 = event.target.files[0]
      let param = new FormData()  // 创建form对象
      param.append('upload', file0)  // 通过append向form对象添加数据
      self.file=param
      var file = new FileReader();
      file.readAsDataURL(event.currentTarget.files[0]);
      file.onload = function (url) {
          self.file_img=url.currentTarget.result
          loading.close();
          document.getElementById('file').outerHTML=document.getElementById('file').outerHTML.replace(/(value=\").+\"/i,"$1\""); 
      };
    },
    check(){
      var self=this
      const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
      self.axios.post(YBDL_URL+'/ems/api/file/uploadImage',self.file,{
        headers:{'Authorization': localStorage.getItem('YBDL_token')},
      })
      .then(rs=>{
        loading.close();
        self.$set(self.obj,'imageLarge',rs.data.url)
        self.$message({
          message: '上传成功',
          type: 'success'
        });
      })
    },
    ajax_list(page=1){/*总仓列表*/
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
          for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].createDt=self.TIME(res.data.body.rows[i].createDt)
            if(res.data.body.rows[i].whType==1 && res.data.body.rows[i].status==1){
              self.listAll.push(res.data.body.rows[i])
            }
          }
          self.whNo=self.listAll[0].whId
          self.total=res.data.body.count
          if(self.status){
            for(let j=0;j<self.listAll.length;j++){
              if(self.listAll[j].whNo==self.obj.whNo){
                self.whNo_obj=j
              }
            }
            // self.ajax_listF(self.listAll[self.whNo_obj].whId)
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
          // self.listF.push({whName:'全部',whId:''})
          for(let i=0;i<res.data.body.rows.length;i++){
            // res.data.body.rows[i].createDt=self.TIME(res.data.body.rows[i].createDt)
            if(res.data.body.rows[i].whType==2 && res.data.body.rows[i].status==1){
              self.listF.push(res.data.body.rows[i])
            }
          }
          if(self.status){
            for(let j=0;j<self.listF.length;j++){
              if(self.listF[j].whNo==self.obj.branchWhNo){
                self.branchWh_obj=j
              }
            }
          }
        }
      })
    },
    ajax_class(){/*设备分类*/
      var self=this
      self.ajax({
        mode: 'post',
        url: '/ems/api/category/list',
        data: {
          body:{
            page:1,
            pageSize:1000
          }
        },
        success(res){
          self.device_class_list=res.data.body.rows
          if(self.status){
            for(let j=0;j<self.device_class_list.length;j++){
              if(self.device_class_list[j].categoryId==self.obj.categoryId){
                self.category_obj=j
              }
            }
          }
        }
      })
    },
  },
  computed:{
    com_checkDt(){
      return this.obj.checkDt
    }
  },
  watch:{
    whNo_obj(val){
      this.ajax_listF(this.listAll[val].whId)
      this.obj.whNo=this.listAll[val].whNo
      this.obj.whName=this.listAll[val].whName
    },
    branchWh_obj(val){
      this.obj.branchWh=this.listF[val].whName
      this.obj.branchWhNo=this.listF[val].whNo
    },
    category_obj(val){
      this.obj.categoryName=this.device_class_list[val].categoryName
      this.obj.categoryId=this.device_class_list[val].categoryId
    },
    deviceType(val){
      if(val==0){
        this.$set(this.obj,'isActive','0')
      }
      if(val!=2){
        this.$set(this.obj,'useType','2')
      }
    },
    com_checkDt(newVal,oldVal){
      if(newVal){
        var date=(new Date).valueOf()
        var newDate=(new Date(newVal)).valueOf()
        if(!(date<newDate)){
          this.$message({message: '年检时间不能小于当前时间',type: 'warning'})
          this.boo_checkDt=false
        }else{
          this.boo_checkDt=true
        }
      }
    }
  }
}
</script>

<style scoped>
	.file-img{
    width:150px;
    height:150px;
    border:1px solid #d9d9d9;
    margin-right: 10px;
    display: block
  }
  .file-input{
    width:150px;height: 150px;left: 0px;top: 0px;opacity: 0;
  }
  .nowrap{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>
