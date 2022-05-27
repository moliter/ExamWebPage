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
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
        <el-button type="danger" @click="seeFalseQues(scope.row.stuExamId)">查看错题</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display:none">{{this.scores}}</div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="1000px">
      <div>
        <el-table
          :data="falseQues"
          style="width: 1000px"
        >
          <el-table-column
            align = "center"
            prop = "stem"
            label="题干"
            width="400px">
          </el-table-column>
          <el-table-column
            align="center"
            prop="suggestAnswer"
            label="参考答案">
          </el-table-column>
          <el-table-column
            align="center"
            prop="stuAnswer"
            label="学生答案">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scores:null,
      stuid:null,
      dialogVisible:false,
      falseQues:null,
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
    seeFalseQues(stuExamId){
      this.$axios(`https://localhost:49153/studenExam/${stuExamId}`).then(res => {
        this.falseQues = res.data;
        this.dialogVisible = true;
      })
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
