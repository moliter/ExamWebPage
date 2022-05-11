<!-- 用户登录界面 -->
<template>
  <div id="login">
    <div class="bg"></div>
    <el-row class="main-container">
      <el-col :lg="8" :xs="16" :md="10" :span="10">
        <div class="top">
          <i class="iconfont icon-kaoshi"></i><span class="title">在线考试系统</span>
        </div>
        <div class="bottom">
          <div class="container">
            <p class="title">账号注册</p>
            <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
              <el-form-item label="账号">
                <el-input v-model.number="formLabelAlign.Account" placeholder="请输入账号"></el-input>
              </el-form-item>
              <el-form-item label="用户名">
                <el-input v-model="formLabelAlign.Name" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="formLabelAlign.Password" placeholder="请输入密码" type='password'></el-input>
              </el-form-item >
              <el-form-item label="身份">
                <el-radio-group v-model="role" >
                        <el-radio label="student">学生</el-radio>
                        <el-radio  label="teacher">老师</el-radio>
                </el-radio-group>
               </el-form-item >
              <div class="submit">
                <el-button type="primary" class="row-login" @click="login()">注册</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from '@/vuex/store'
import {mapState} from 'vuex'
export default {
  store,
  name: "login",
  data() {
    return {
      labelPosition: 'left',
      formLabelAlign: {
        Account:'',
        Password:'',
        Name:''
      },
      role:'',
      userreturnDTO:{
        userStudent:{
            //string Required MaxLength(50)
            Account:null,
            //Required,MaxLength(50),MinLength(6)
            Password:null,
            //Required,MaxLength(50),MinLength(1)
            Name:null
        },
        userTeacher:{
            //string Required MaxLength(50)
            Account:null,
            //Required,MaxLength(50),MinLength(6)
            Password:null,
            //Required,MaxLength(50),MinLength(1)
            Name:null
        }
      },
    }
  },
  methods: {
    //用户登录请求后台处理
    
    login() {
    
      console.log("登录操作执行-------");
      if(this.role === 'student'){
        this.userreturnDTO.userStudent.Account=this.formLabelAlign.Account;
        this.userreturnDTO.userStudent.Password=this.formLabelAlign.Password;
        this.userreturnDTO.userStudent.Name=this.formLabelAlign.Name;
      }
      if(this.role === 'teacher'){
        this.userreturnDTO.userTeacher.Account=this.formLabelAlign.Account;
        this.userreturnDTO.userTeacher.Password=this.formLabelAlign.Password;
        this.userreturnDTO.userTeacher.Name=this.formLabelAlign.Name;
      }
      console.log(this.userreturnDTO);
      this.$axios({
        url: `https://localhost:49153/users/adduser`,
        method: 'post',
        data: {
            ...this.userreturnDTO
        }
      }).then(res=>{
          if(res.status===200){
              this.$cookies.set("caccount",this.formLabelAlign.Account )
              this.$cookies.set("cname",this.formLabelAlign.Name)
              if(this.role==='student'){ this.$router.push({path:'/student'})}
              if(this.role==='teacher'){ this.$router.push({path:'/index'})}
          }
      })
    },
    clickTag(key) {
      this.role = key
    }
  },
  computed: mapState(["userInfo"]),
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.remind {
  border-radius: 4px;
  padding: 10px 20px;
  display: flex;
  position: fixed;
  right: 20px;
  bottom: 50%;
  flex-direction: column;
  color: #606266;
  background-color: #fff;
  border-left: 4px solid #409eff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
}
.container {
  margin-bottom: 32px;
}
.container .el-radio-group {
  margin: 10px 0px;
}
a:link {
  color:#ff962a;
  text-decoration:none;
}
#login {
  font-size: 14px;
  color: #000;
  background-color: #fff;
}
#login .bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  overflow-y: auto;
  height: 100%;
  background: url('../../assets/img/loginbg.jpg')center top / cover no-repeat;
  background-color: #b6bccdd1 !important;
}
#login .main-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
#login .main-container .top {
  margin-top: 100px;
  font-size: 30px;
  color: #ff962a;
  display: flex;
  justify-content: center;
}
#login .top .icon-kaoshi {
  font-size: 80px;
}
#login .top .title {
  margin-top: 20px;
}
#login .bottom {
  display:flex;
  justify-content: center;
  background-color:#fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
#login .bottom .title {
  text-align: center;
  font-size: 30px;
}
.bottom .container .title {
  margin: 30px 0px;;
}
.bottom .submit .row-login {
  width: 100%;
  background-color: #04468b;
  border-color: #04468b;
  margin: 20px 0px 10px 0px;
  padding: 15px 20px;
}
.bottom .submit {
  display: flex;
  justify-content: center;
}
.footer {
  margin-top: 50px;
  text-align: center;
}
.footer .msg1 {
  font-size: 18px;
  color: #fff;
  margin-bottom: 15px;
}
.footer .msg2 {
  font-size: 14px;
  color: #e3e3e3;
  margin-top: 70px;
}
.bottom .options {
  margin-bottom: 40px;
  color: #ff962a;
  display: flex;
  justify-content: space-between;
}
.bottom .options > a {
  color: #ff962a;
}
.bottom .options .register span:nth-child(1) {
  color: #8C8C8C;
}
</style>
