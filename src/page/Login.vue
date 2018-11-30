<template>
    <div class="login-wrap flex al-ce jc-ce" :style='{backgroundImage:"url("+back+")"}'>
        <div>
            <div class="ms-title">资产管理系统</div>
            <div class="ms-login">
                <div class="flex al-ce marginB20">
                    <p class="must width60 fs0">账号</p>
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </div>
                <div class="flex al-ce marginB20">
                    <p class="must width60 fs0">密码</p>
                    <el-input type="password" placeholder="password" v-model="ruleForm.password"></el-input>
                </div>
                <div class="flex al-ce marginB20">
                    <p class="must width60 fs0">验证码</p>
                    <el-input placeholder="code" v-model="ruleForm.code" @keyup.enter.native="submitForm"></el-input>
                    <p class='fs0 code'><img :src="code_img" alt="" @click='renovate'></p>
                </div>
                
                <div class="login-btn center">
                    <el-button type="primary" class='width120' @click="submitForm">登录</el-button>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                uuid:'',
                code_img:'',
                ruleForm: {
                    username: '',
                    password: '',
                    code:'',
                },
                back:require('@/assets/Background3.png')
            }
        },
        created(){
            this.gain_code()     
        },
        methods: {
            gain_code(){/*获取验证码*/
                var self=this
                const loading = this.$loading({
                  lock: true,
                  text: 'Loading',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
                this.axios.get(YBDL_URL+'/ems/api/captcha')
                .then(function (response) {
                    loading.close();
                    self.code_img=response.data.img
                    self.uuid=response.data.uuid
                })
                .catch(function (response) {
                    loading.close();
                    console.log(response);
                })
            },
            submitForm() {
                var self=this
                localStorage.YBDL_name=self.ruleForm.username
                if(self.ruleForm.username && self.ruleForm.password && self.ruleForm.code){
                    self.ajax({
                      mode: 'post',
                      url: '/ems/api/login',
                      login:true,
                      data: {
                        account:self.ruleForm.username,
                        password:self.ruleForm.password,
                        captcha:self.ruleForm.code,
                        uuid:self.uuid
                      },
                      success(res){
                        localStorage.YBDL_update=res.data.body.refresh_token
                        localStorage.YBDL_token=res.data.body.token
                        localStorage.YBDL_num=res.data.body.user.userId
                        self.$router.push({ name: 'index' })
                      }
                    })
                }else{
                    if(!self.ruleForm.username){
                        self.$notify({
                          title: '警告',
                          message: '请输入账号',
                          type: 'warning'
                        });
                    }
                    else if(!self.ruleForm.password){
                        self.$notify({
                          title: '警告',
                          message: '请输入密码',
                          type: 'warning'
                        });
                    }
                    else if(!self.ruleForm.code){
                        self.$notify({
                          title: '警告',
                          message: '请输入验证码',
                          type: 'warning'
                        });
                    }
                }
                
            },
            renovate(){/*更新验证码*/
                this.gain_code()
            },
            getResource(){/*登录权限获取*/

            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        width:100%;
        height:100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
    .ms-title{
        text-align: center;
        font-size:30px;
        color: #fff;
        margin-bottom: 40px;
    }
    .ms-login{
        width:400px;
        height:230px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        margin-top: 30px;
    }
    .width60{
        width: 70px;
    }
    .code{
        height: 40px;
        width: 90px;border:1px solid #d9d9d9;
        margin-left: 20px
    }
    .code img{
        display: block;
        width:100%;
        height:100%;
    }
</style>