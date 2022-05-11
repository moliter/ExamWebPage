//显示学生成绩
<template>
  <div>
    <el-table
      :data="scores"
      style="width: 100%">
      <el-table-column
        align="center"
        prop="stuExam"
        label="考试名称"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="stuScore"
        label="分数">
      </el-table-column>
    </el-table>
    <div style="display:none">{{this.scores}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scores:null,
      stuid:null,
    }
  },
  created(){
    this.getstuscore();
  },
  methods: {
    getstuscore(){
      this.stuid = this.$cookies.get("cid")
      this.$axios(`https://localhost:49153/studentscore/${this.stuid}`).then(
        res => {
          this.scores = res.data;
        }
      )
    },
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  padding-top: 20px;
}
.table {
  width: 980px;
  margin: 0 auto;
  .title {
    margin: 20px;
  }
  .content-el {
    background-color: #fff;
    padding: 20px;
  }
}
</style>
