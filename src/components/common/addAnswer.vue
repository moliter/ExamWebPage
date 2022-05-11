//获取试卷并跳转到添加题库
<template>
  <div class="exam">
    <el-table :data="pagination.records" border>
      <el-table-column fixed="left" prop="examName" label="试卷名称" width="180"></el-table-column>
      <el-table-column prop="examDate" label="考试日期" width="160"></el-table-column>
      <el-table-column prop="timeLong" label="持续时间" width="120"></el-table-column>
      <el-table-column prop="examScore" label="总分" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="add(scope.row.paperId,scope.row.source)" type="primary" size="small">增加题库</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pagination.current"
      :page-sizes="[4, 8, 10, 20]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total" class="page">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}, //保存点击以后当前试卷的信息
      pagination: { //分页后的考试信息
        current: 1, //当前页
        total: null, //记录条数
        size: 4, //每页条数
        records:null
      },
    }
  },
  created() {
    this.getExamInfo()
  },
  methods: {
    getExamInfo() { //分页查询所有试卷信息
      this.$axios({url:`https://localhost:49153/exam/Id=null&ExamName=null&ExamData=null&TimeLong=null&Teacher=null&ExamScore=null`,
        method: 'get',
      }).then(res => {
        this.pagination.records =res.data.exams
      }).catch(error => {
      })
    },
    add(paperId,source) { //增加题库
      this.$router.push({path:'/addAnswerChildren',query: {paperId: paperId,subject:source}})
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
