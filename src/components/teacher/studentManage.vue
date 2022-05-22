// 学生管理页面
<template>
  <div class="all">
    <el-table :data="stus" border>
      <el-table-column fixed="left" prop="name" label="姓名" width="240"></el-table-column>
      <el-table-column prop="className" label="班级" width="240"></el-table-column>
      <el-table-column prop="account" label="账号" width="440"></el-table-column>
      <el-table-column fixed="right" label="操作" width="240">
        <template slot-scope="scope">
          <el-button @click="checkGrade(scope.row)" type="danger" size="small">编辑</el-button>
          <el-button @click="deleteById(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑对话框-->
    <el-dialog
      title="编辑学生信息"
      :visible.sync="dialogVisible"
      width="30%">
      <section class="update">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-input v-model="form.className"></el-input>
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="form.account"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stus:null,
      form: {
        name:'',
        className:'',
        account:'',
        password:'',
      },
      dialogVisible:null,
      account:null,
    };
  },
  created() {
    this.getStudentInfo();
  },
  methods: {
    getStudentInfo() {
      //获取所有的学生
      this.$axios(`https://localhost:49153/api/student/students`).then(res => {
        this.stus = res.data
      }).catch(error => {});
    },
    deleteById(row){
      this.$axios({
        url:`https://localhost:49153/users/${row.account}`,
        method:'delete'}).then(res => {
        if(res.status ==200) {
          this.getStudentInfo();
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    checkGrade(row) { //修改学生信息
      this.dialogVisible = true
      this.account = row.account
      this.form.name = row.name
      this.form.className = row.className
      this.form.account = row.account
      this.form.password = row.password
    },

    submit() { //提交更改
      this.dialogVisible = false
      this.$axios({
        url: `https://localhost:49153/userstu/${this.account}`,
        method: 'put',
        data: {
          ...this.form
        }
      }).then(res => {
        console.log(res)
        if(res.status ==200) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        }
        this.getStudentInfo()
      })
    },
  }
};
</script>
<style lang="scss" scoped>
.all {
  padding: 0px 40px;
  .page {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edit {
    margin-left: 20px;
  }
  .el-table tr {
    background-color: #dd5862 !important;
  }
}
.el-table .warning-row {
  background: #000 !important;
}

.el-table .success-row {
  background: #dd5862;
}
</style>
