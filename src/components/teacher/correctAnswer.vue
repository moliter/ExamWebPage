<template>
    <div class="correct" style="margin: 50px;">
        <div  style="margin: 50px;">
            <el-tag type="warning" >学生账号:</el-tag>
            <el-input readonly="readonly" v-model="stuname" style="width:30%"></el-input>
            <el-tag type="warning">试卷名:</el-tag>
            <el-input readonly="readonly" v-model="examName" style="width:30%"></el-input>
        </div>
        <div class="title" style="margin: 50px 50px;">
            <el-tag type="warning">题目:</el-tag>
            <el-input :rows="7" readonly="readonly" type="textarea" v-model="question"></el-input>
          </div>
          <div class="fillAnswer" style="margin: 50px 50px;">
            <el-tag  type="warning">学生答案:</el-tag>
            <el-input type="textarea" readonly="readonly" v-model="studentAnswer" :rows="5" show-word-limit  style="height: 100%"></el-input>
          </div>
        <div style="margin: 50px 50px;display:flex;">
            <el-tag type="warning" style="marigin: auto">学生得分:</el-tag>
            <el-input-number v-model="num" :min="1" :max="maxcost" style="margin-left:10px"></el-input-number>
            <div style="margin:10px;color: #e6a23c;">最大分值：<span>{{maxcost}}</span></div>
            <el-button  type="warning" @click="postscore(num)" > 提交</el-button>
            <el-button type="warning" @click="toback()"> 返回</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data()  {
        return {
            num:1,
            stuname:'',
            examName:'',
            question:"",
            studentAnswer:"",
            stuid:"",
            questionid:"",
            examid:"",
            maxcost:0,
        }
    },
    created(){
        this.getInfo();
    },
    methods: {
      getInfo(){
          this.stuname = this.$route.query.stuAcc,
          this.examName = this.$route.query.examname,
          this.stuid = this.$route.query.stuId,
          this.questionid = this.$route.query.questionId,
          this.examid = this.$route.query.examId,
          this.$axios(`https://localhost:49153/questionanswer/${this.stuid}&${this.questionid}`).then(res => {
              this.question = res.data.question;
              this.studentAnswer = res.data.studentAnswer;
              this.maxcost = res.data.cost;
          })
      },
      postscore(num){
          this.$axios(`https://localhost:49153/studentscore/${this.num}&${this.examid}&${this.stuid}&${this.questionid}`).then(
              res => {
                  this.$router.go(-1);
              }
          )
      },
      toback(){
          this.$router.go(-1)
      }
    }
}
</script>