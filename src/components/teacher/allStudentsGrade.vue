// 所有学生
<template>
  <div class="all">
    <el-table :data="examScore" border>
      <el-table-column fixed="left" prop="stuName" label="姓名" width="200"></el-table-column>
      <el-table-column prop="stuClass" label="班级" width="200"></el-table-column>
      <el-table-column prop="stuExam" label="考试名称" width="400"></el-table-column>
      <el-table-column fixed="right" prop="stuScore" label="当前成绩" width="auto">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      examScore:[],
    };
  },
  created() {
    this.getAnswerInfo();
  },
  methods: {
    getAnswerInfo() {
      this.$axios(`https://localhost:49153/allexamscore`).then(res => {
        this.examScore = res.data;
      }).catch(error => {});
    }
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
