<!-- 添加考试 -->
<template>
  <section class="add">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="试卷名称">
        <el-input v-model="form.source"></el-input>
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="form.grade"></el-input>
      </el-form-item>
      <el-form-item label="考试日期">
        <el-col :span="11">
          <el-date-picker v-model="form.examDate" type="datetime" placeholder="选择日期时间"> </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="持续时间">
        <el-input v-model="form.totalTime" placeholder="单位为分钟"></el-input>
      </el-form-item>
      <el-form-item label="总分">
        <el-input v-model="form.totalScore"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="onSubmit()">立即创建</el-button>
        <el-button type="text" @click="cancel()">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      form: { //表单数据初始化
        source: null,
        grade: null,
        examDate: null,
        totalTime: null,
        totalScore: null,
      },
    };
  },
  methods: {
    formatTime(date) { //日期格式化
      let year = date.getFullYear()
      let month= date.getMonth()+ 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let day=date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours=date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes=date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds=date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    },
    onSubmit() {
      let examDate = this.formatTime(this.form.examDate)
      this.form.examDate = examDate.toString();
      var DTO={
        ExamName:this.form.source,
        ExamDate:this.form.examDate,
        TimeLong:this.form.totalTime,
        Teacher:this.$cookies.get('cid'),
        ExamScore:this.form.totalScore
      };
      this.$axios({
        url: `https://localhost:49153/exam/add/grade=${this.form.grade}`,
        method: 'post',
        data: {
          ...DTO
        }
      }).then(res => {
        if(res.status == 200) {
          this.$message({
            message: '数据添加成功',
            type: 'success'
          })
          this.$router.push({path: '/selectExam'})
        }
      });
    },
    cancel() { //取消按钮
      this.form = {}
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

