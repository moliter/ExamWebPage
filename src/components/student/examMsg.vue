// 点击试卷后的缩略信息
<template>
  <div id="msg">
    <div class="title">
      <span>试卷列表</span>
      <span>/  {{examData.name}}</span>
    </div>
    <div class="wrapper">
      <ul class="top">
        <li class="example">{{examData.name}}</li>
        <li class="right">
          <div>
            <span class="count">总分</span>
            <span class="score">{{sumscore}}</span>
          </div>
        </li>
      </ul>
      <ul class="bottom">
        <li>创建于{{examData.date}}</li>
        <li class="right"><el-button @click="toAnswer(examData)">开始答题</el-button></li>
      </ul>
    </div>
    <div class="content">
      <el-collapse v-model="activeName" >
        <el-collapse-item class="header" name="0">
          <template slot="title" class="stitle" >
            <div class="title">
              <span>{{examData.name}}</span><i class="header-icon el-icon-info"></i>
              <span class="time">{{sumscore}}分 / {{examData.time}}分钟</span>
              <el-button type="danger" size="small">点击查看试题详情</el-button>
            </div>
          </template>
          <el-collapse class="inner">
            <el-collapse-item>
              <template slot="title" name="1">
                <div class="titlei">选择题 (共{{choicenum}}题 共计{{choicescore}}分)</div>
              </template>
              <div class="titlei">选择题部分为单选</div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title" name="2">
                <div class="titlei">解答题 (共{{txtnum}}题  共计{{txtscore}}分)</div>
              </template>
              <div class="titlei">解答题部分字数不限</div>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--考生须知对话框-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false, //对话框属性
      activeName: '0',  //默认打开序号
      score:null,
      examData: null,
      sumscore:null,
      choicescore:null,
      txtscore:null,
      choicenum:null,
      txtnum:null,
    }
  },
  created(){
    this.examData = this.$route.query.examitem
    this.init()
  },
  methods: {
    //初始化页面数据
    init() {
      this.examData = this.$route.query.examitem
      let examCode = this.$route.query.examitem.id //获取路由传递过来的试卷编号
      this.$axios(`https://localhost:49153/questionExamScore/Exam=${examCode}`).then(res => {  //通过examCode请求试卷详细信息
        this.score = res.data;
        this.choicescore = this.score.value.cscore.cost;
        this.choicescore = this.score.value.tscore.cost;
        this.choicenum = this.score.value.cscore.count;
        this.txtnum = this.score.value.tscore.count;
        this.questionNumber = this.score.value.cscore.count + this.score.value.tscore.count;
        this.sumscore = this.score.value.cscore.cost+this.score.value.tscore.cost;
      })
    },
    toAnswer(item) {
      this.$router.push({path:"/answer",query:{examitem: item}})
       this.$cookies.set("questionnum",this.questionNumber)
    },
  }
}
</script>

<style lang="scss" scoped>
.bottom {
  .right{
    .el-button{
      color: #409EFF;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }
}
.right {
  margin-left: auto;
}
.inner .contenti .question {
  margin-left: 40px;
  color: #9a9a9a;
  font-size: 14px;
}
.content .inner .titlei {
  margin-left: 20px;
  font-size: 16px;
  color: #88949b;
  font-weight: bold;
}
.content .title .time {
  font-size: 16px;
  margin-left: 420px;
  color: #999;
}
.content .stitle {
  background-color: #0195ff;
}
.content .title span {
  margin-right: 10px;
}
#msg .content .title {
  font-size: 20px;
  margin: 0px;
  display: flex;
  align-items: center;
}
.content {
  margin-top: 20px;
  background-color: #fff;
}
.content .header {
  padding: 10px 30px;
}
.wrapper .info {
  margin: 20px 0px 0px 20px;
  border-top: 1px solid #eee;
  padding: 20px 0px 10px 0px;
}
.wrapper .info a {
  color: #88949b;
  font-size: 14px;
}
.wrapper .info a:hover {
  color: #0195ff;
}
.wrapper .bottom .btn {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #88949b;
  border-radius: 4px;
} 
.wrapper .bottom {
  display: flex;
  margin-left: 20px;
  color: #999;
  font-size: 14px;
  align-items: center;
}
.wrapper .bottom li {
  margin-right: 14px;
}
#msg {
  background-color: #eee;
  width: 980px;
  margin: 0 auto;
}
#msg .title {
  margin: 20px;
}
#msg .wrapper {
  background-color: #fff;
  padding: 10px;
}
.wrapper .top {
  display: flex;
  margin: 20px;
  align-items: center;
}
.wrapper .top .right {
  margin-left: auto;
}
.wrapper .top .example {
  color: #333;
  font-size: 22px;
  font-weight: 700;
}
.wrapper .top li i {
  margin-left: 20px;
  color: #88949b;
}
.wrapper .right .count {
  margin-right: 60px;
  color: #fff;
  padding: 4px 10px;
  background-color: #88949b;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #88949b;
}
.wrapper .right .score {
  position: absolute;
  left: 53px;
  top: -5px;
  padding: 1px 12px;
  font-size: 20px;
  color: #88949b;
  border: 1px dashed #88949b;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  font-weight: bold;
}
.wrapper .right div {
  position: relative;
}
</style>
