//查询所有考试
<template>
  <div class="exam">
    <el-table :data="exams" border>
      <el-table-column fixed="left" prop="examName" label="试卷名称" width="240"></el-table-column>
      <el-table-column prop="examDate" label="考试日期" width="240"></el-table-column>
      <el-table-column prop="timeLong" label="持续时间" width="240"></el-table-column>
      <el-table-column prop="examScore" label="总分" width="240"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.id)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteRecord(scope.row.id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑对话框-->
    <el-dialog
      title="编辑试卷信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section class="update">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="试卷名称">
            <el-input v-model="form.ExamName"></el-input>
          </el-form-item>
          <el-form-item label="考试日期">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.ExamDate" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="持续时间">
            <el-input v-model="form.TimeLong"></el-input>
          </el-form-item>
          <el-form-item label="总分">
            <el-input v-model="form.ExamScore"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit(form.id)">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
      }, //保存点击以后当前试卷的信息
      exams:null,
      dialogVisible: false
    }
  },
  created() {
    this.getExamInfo()
  },
  methods: {
    edit(id) { //编辑试卷
      this.dialogVisible = true
      this.$axios(`https://localhost:49153/api/exam/exam/${id}`).then(res => { //根据试卷id请求后台
          this.form = res.data
      })
    },
    handleClose(done) { //关闭提醒
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        }).catch(_ => {});
    },
    submit(id) { //提交修改后的试卷信息
      this.dialogVisible = false
      this.$axios({
        url: `https://localhost:49153/exam/Id=${id}`,
        method: 'put',
        data: {
          ...this.form
        }
      }).then(res => {
          this.$message({ //成功修改提示
            message: '更新成功',
            type: 'success'
          });
        this.exams=null;
        this.getExamInfo()
      }).catch(error => console.log(error))
    },
    deleteRecord(id) {
      this.$confirm("确定删除该记录吗,该操作不可逆！！！","删除提示",{
        confirmButtonText: '确定',
        cancelButtonText: '留着',
        type: 'danger'
      }).then(()=> { //确认删除
        this.$axios({
          url: `https://localhost:49153/exam/Id=${id}`,
          method: 'delete',
        }).then(res => {
          this.getExamInfo()
        })
      }).catch(() => {

      })
    },
    getExamInfo() { //查询当前人员的试卷信息
      this.$axios(`https://localhost:49153/api/exam/examsteacher/${this.$cookies.get("caccount")}`).then(res => {
        this.exams = res.data
      }).catch(error => {
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.exam {
  padding: 0px 40px;
  .page {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edit{
    margin-left: 20px;
  }
}
</style>
