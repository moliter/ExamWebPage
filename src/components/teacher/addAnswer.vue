//获取试卷并跳转到添加题库
<template>
  <div class="exam">
    <el-table :data="exams" border>
      <el-table-column fixed="left" prop="examName" label="试卷名称" width="230"></el-table-column>
      <el-table-column prop="examDate" label="考试日期" width="230"></el-table-column>
      <el-table-column prop="timeLong" label="持续时间" width="230"></el-table-column>
      <el-table-column prop="examScore" label="总分" width="230"></el-table-column>
      <el-table-column fixed="right" label="操作" width="230">
        <template slot-scope="scope">
          <el-button @click="add(scope.row.id)" type="danger" size="small">管理试题</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}, //保存点击以后当前试卷的信息
      exams:null,
    }
  },
  created() {
    this.getExamInfo()
  },
  methods: {
    getExamInfo() { //查询当前人员的试卷信息
      this.$axios(`https://localhost:49153/api/exam/examsteacher/${this.$cookies.get("caccount")}`).then(res => {
        this.exams = res.data;
      }).catch(error => {
      })
    },
    add(id) { //增加题库
      this.$router.push({path:'/addAnswerChildren',query:{id: id}})
    }
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
