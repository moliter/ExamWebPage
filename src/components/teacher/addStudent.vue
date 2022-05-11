<!-- 添加学生 -->
<template>
  <section class="add">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.Name"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.Account"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.Password" show-password></el-input>
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="form.Class"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="onsubmit()">立即创建</el-button>
        <el-button type="warning" @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      form: {
        Account:'',
        Password:'',
        Name:'',
        Class:'',
      },
      Class:
      {
        Account:null,
        ClassName:null,
      },
      role:'student',
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
    };
  },
  methods: {
    cancel() { //取消按钮
      this.form = {}
    },
    onsubmit() {
      console.log("登录操作执行-------");
      if(this.role === 'student'){
        this.userreturnDTO.userStudent.Account=this.form.Account;
        this.userreturnDTO.userStudent.Password=this.form.Password;
        this.userreturnDTO.userStudent.Name=this.form.Name;
      }
      if(this.role === 'teacher'){
        this.userreturnDTO.userTeacher.Account=this.form.Account;
        this.userreturnDTO.userTeacher.Password=this.form.Password;
        this.userreturnDTO.userTeacher.Name=this.form.Name;
      }
      this.Class.ClassName=this.form.Class;
      this.Class.Account = this.form.Account;
      var self = this;
      this.$axios({
        url: `https://localhost:49153/users/adduser`,
        method: 'post',
        data: {
            ...this.userreturnDTO
        }
      }).then(res => {
        if(res.status == 200) {
          this.$message({
            message: '创建学生成功',
            type: 'success'
          }).$axios(
            {
              url:`https://localhost:49153/class/UserClass/${self.Class.Account}`,
              method:'post',
              data:{
                ...self.Class
              }
            }
          ).then(res => {
            if(res.status == 200){
              this.$message({
                message: '添加班级成功',
                type: 'success'
              })
              this.$router.push({path: '/studentManage'})
            }
          })
        }
      })
    },
  }
};
</script>
<style lang="scss" scoped>
.add {
  padding: 0px 40px;
  width: 400px;
}
</style>

