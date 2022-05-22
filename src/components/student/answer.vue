<!--考生答题界面-->
<template>
  <div id="answer">
    <!--顶部信息栏-->
     <div class="top" background-color=#002edd >
       <ul class="item">
         <li><i class="iconfont icon-menufold icon20" ref="toggle" @click="slider_flag = !slider_flag"></i></li>
         <li>{{this.examData.name}}</li>
         <li @click="flag = !flag">
           <i class="iconfont icon-user icon20"></i>
           <div class="msg"  v-if="flag" @click="flag = !flag">
             <p>姓名：{{userInfo.name}}</p>
             <p>账号:{{userInfo.id}}</p>
           </div>
         </li>
         <li><i class="iconfont icon-arrLeft icon20"></i></li>
       </ul>
     </div>
     <div class="flexarea">
       <transition name="slider-fade">
          <div class="left" v-if="slider_flag">
            <div class="l-bottom">
              <div class="item">
                <ul>
                  <li v-for="(list, index1) in allquestions" :key="index1">
                    <a href="javascript:;" 
                      @click="change(index1)"
                      :class="{'border': index == index1,'bg': bg_flag && allquestions[index1].isClick == true}">
                      <span :class="{'mark': allquestions[index1].isMark == true}"></span>
                      {{index1+1}}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="final" @click="commit()">结束考试</div>
            </div>
          </div>
        </transition>  
        <transition name="slider-fade">
        <div class="right">
          <div class="title">
            <p>{{title}}</p>
            <i class="iconfont icon-right auto-right"></i>
            <span>全卷共<b>{{questionnum}}</b>题  <i class="iconfont icon-time"></i>倒计时：<b>{{time}}</b>分钟</span>
          </div>
          <div class="content" >
            <p class="topic" ><span class="number">{{number}}</span>{{stem}}</p>
            <div v-if="currentType == 1">
              <el-radio-group v-model="radio" @change="getChangeLabel" >
                <el-radio :label="1">{{choiceA}}</el-radio>
                <el-radio :label="2">{{choiceB}}</el-radio>
                <el-radio :label="3">{{choiceC}}</el-radio>
                <el-radio :label="4">{{choiceD}}</el-radio>
              </el-radio-group>
            </div>
            <div class="fill" v-if="currentType == 2">
                <el-input placeholder="请填在此处"
                  type="textarea"
                  :rows="4"
                  v-model="tanswer"
                  clearable>
                </el-input>
            </div>
          </div>
          <div class="operation">
            <ul class="end">
              <li @click="previous()"><i class="iconfont icon-previous"></i><span>上一题</span></li>
              <li @click="next()"><span style="position: fixed;margin-top: 10px;">下一题</span><i class="iconfont icon-next" style="position: fixed;padding-left: 50px;margin-top: 12px;"></i></li>
            </ul>
          </div>
        </div>
        </transition>
     </div> 
  </div>
</template>

<script>
import store from '@/vuex/store'
import {mapState} from 'vuex'
export default {
  store,
  data() {
    return {
      startTime: null, //考试开始时间
      endTime: null, //考试结束时间
      time: null, //考试持续时间
      bg_flag: false,
      slider_flag: true,
      flag: false, //个人信息显示隐藏标识符
      currentType: 1, //当前题型类型  1--选择题  2--文本题 
      radio: '', 
      title: "请选择正确的选项",
      index:0,
      userInfo: { //用户信息
        name: null,
        id: null
      },
      score: [],  //每种类型分数的总数
      examData: null,
      topic: {  //试卷信息

      },
      cquestions:[],
      tquestions:[],
      showQuestion: [], //当前显示题目信息
      number: 1, //题号
      part: null, //填空题的空格数量
      fillAnswer: [], //做过问题的答案
      topic1Answer: [],  //学生选择题作答编号,
      rightAnswer: '',
      questionnum:null,
      tanswer:'',
      canswer:'0',
      allquestions:null,
      allquestionsanswer:[],
      forceexit:0,
      studentAnswer:{},
      stem:null,
      choiceA:null,
      choiceB:null,
      choiceC:null,
      choiceD:null,
    }
  },
  created() {
    this.getCookies()
    this.getExamData()
    this.showTime()
  },
  mounted() {
    window.addEventListener("visibilitychange", this.alertSrceen);
  },
  methods: {
    alertSrceen(){
      if(this.forceexit>=3 && (document.visibilityState === 'hidden')){
        this.$router.push({path:'/student'})
      }else if(this.forceexit<3 && (document.visibilityState === 'hidden')){
        this.forceexit++;
        window.alert("您已切屏，超过三次自动提交试卷");
      }
    },
    getTime(date) { //日期格式化
      let year = date.getFullYear()
      let month= date.getMonth()+ 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let day=date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours=date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes=date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds=date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    },
    getCookies() {  //获取cookie
      this.userInfo.name = this.$cookies.get("cname")
      this.userInfo.id = this.$cookies.get("cid")
      this.questionnum = this.$cookies.get("questionnum")
      this.examData = this.$route.query.examitem
    },
    getExamData() { //获取当前试卷所有信息
      let date = new Date()
      this.startTime = this.getTime(date)
      let examCode = this.$route.query.examitem.id //获取路由传递过来的试卷编号
      var self = this;
      var id;
      this.$axios({
        url:`https://localhost:49153/questions/${examCode}`,
        method:'get',
        async:false
      }).then(res => {  //通过examCode请求试卷详细信息
        self.question = res.data.value
        self.index = 0
        self.time = self.examData.time //获取分钟数
        self.allquestions = self.question.cquestions.concat(self.question.tquestions)
      }).then(res => {
          id = self.getquestionId(self.allquestions[0].id,examCode);
          self.stem = self.allquestions[self.index].stem;
          self.choiceA = self.allquestions[self.index].choiceA;
          self.choiceB = self.allquestions[self.index].choiceB;
          self.choiceC = self.allquestions[self.index].choiceC;
          self.choiceD = self.allquestions[self.index].choiceD;
      })

    },
    getChangeLabel(val) { //获取选择题作答选项
      this.canswer=val;
    },
    previous() { //上一题
      var questionanswer = {
        questionId:null,
        studentId:null,
        choiceAnswer:null,
        txtAnswer:null,
      };
      var self = this;
      this.$axios({
        url:`https://localhost:49153/questionId/Exam=${this.examData.id}&Question=${this.allquestions[self.index].id}`,
        method:'get',
        async:false
      }).then( (res) => {
        self.canswer = self.radio;
        questionanswer.questionId = res.data
        questionanswer.studentId = parseInt(self.userInfo.id);
        questionanswer.choiceAnswer = parseInt(self.canswer);
        questionanswer.txtAnswer = self.tanswer;
        self.radio='';
        this.$axios({
          url:'https://localhost:49153/studentAnswer/add',
          method:'post',
          data:
            {
              ...questionanswer
            }
        }).then(res => {
          self.number--;
          self.index--;
          if(self.allquestions[self.index].qclass == "choice")
          {
            self.currentType=1
          }
          if(this.allquestions[self.index].qclass == "txt")
          {
            self.currentType=2
          }
        })
        this.$axios({
          url:`https://localhost:49153/questionId/Exam=${self.examData.id}&Question=${self.allquestions[self.index-1].id}`,
          method:'get',
        }).then(res =>{
          self.getdbanswer(res.data,self.userInfo.id)
          self.stem = self.allquestions[self.index].stem;
          self.choiceA = self.allquestions[self.index].choiceA;
          self.choiceB = self.allquestions[self.index].choiceB;
          self.choiceC = self.allquestions[self.index].choiceC;
          self.choiceD = self.allquestions[self.index].choiceD;
        this.$forceUpdate();
      })
      })
    },
    next() { //下一题
      var questionanswer = {
        questionId:null,
        studentId:null,
        choiceAnswer:null,
        txtAnswer:null,
      };
      var self = this;
      this.$axios({
        url:`https://localhost:49153/questionId/Exam=${this.examData.id}&Question=${this.allquestions[this.index].id}`,
        method:'get',
        async:false
      }).then( (res) => {
        self.canswer = self.radio;
        questionanswer.questionId = res.data
        questionanswer.studentId = parseInt(self.userInfo.id);
        questionanswer.choiceAnswer = parseInt(self.canswer);
        questionanswer.txtAnswer = self.tanswer;
        self.allquestionsanswer.unshift(questionanswer);
        this.$axios({
          url:'https://localhost:49153/studentAnswer/add',
          method:'post',
          data:
            {
              ...questionanswer
            }
        }).then(res => {
          self.studentAnswer[self.index] = questionanswer;
          self.radio='';
          self.index++;
          self.number++;
          if(self.number > self.questionnum){
            self.index--;
            self.number--;
            if(confirm("是否 提交试卷?")){
            this.$axios({
                url:`https://localhost:49153/submitExam/${self.userInfo.id}/${self.examData.id}`,
                method:'get',
              }).then(res => {
                    window.removeEventListener("visibilitychange", this.alertSrceen);
                    this.$router.push({path:'/student'})
              })
            }
          }
          if(self.allquestions[self.index].qclass == "choice")
          {
            self.currentType=1
          }
          if(self.allquestions[self.index].qclass == "txt")
          {
            self.currentType=2
          }
          this.$axios({
            url:`https://localhost:49153/questionId/Exam=${this.examData.id}&Question=${this.allquestions[this.index].id}`,
            method:'get',
          }).then(res =>{
            this.getdbanswer(res.data,this.userInfo.id);
            self.stem = self.allquestions[self.index].stem;
            self.choiceA = self.allquestions[self.index].choiceA;
            self.choiceB = self.allquestions[self.index].choiceB;
            self.choiceC = self.allquestions[self.index].choiceC;
            self.choiceD = self.allquestions[self.index].choiceD;
          });
          
        })
        }
      )
    },
    change(index){
      var self = this;
      self.index = index;
      if(self.allquestions[index].qclass == "choice")
      {
        self.currentType=1
      }
      if(this.allquestions[index].qclass == "txt")
      {
        self.currentType=2
      }
      this.$axios({
            url:`https://localhost:49153/questionId/Exam=${this.examData.id}&Question=${this.allquestions[index].id}`,
            method:'get',
          }).then(res =>{
            this.getdbanswer(res.data,this.userInfo.id);
            self.stem = self.allquestions[self.index].stem;
            self.choiceA = self.allquestions[self.index].choiceA;
            self.choiceB = self.allquestions[self.index].choiceB;
            self.choiceC = self.allquestions[self.index].choiceC;
            self.choiceD = self.allquestions[self.index].choiceD;
          });
    },
    getdbanswer(questionId,studentId){
      var self=this;
      var answer = this.$axios({
        url:`https://localhost:49153/questionExamAnswer/questionId=${questionId}&stuId=${studentId}`,
        method:"get",
      }).then(res => {
        self.radio = res.data;
        self.tanswer = res.data;
      })
      return answer;
    },
    getquestionId(id,examid){
      var questionId;
      var self = this;
      this.$axios({
        url:`https://localhost:49153/questionId/Exam=${examid}&Question=${id}`,
        method:'get',
      }).then(res =>{
        questionId=res.data;
        self.getdbanswer(questionId,self.userInfo.id).data;
      })
    },
    showTime() { //倒计时
      setInterval(() => {
        this.time -= 1
        if(this.time == 10) {
          this.$message({
            showClose: true,
            type: 'error',
            message: '考生注意,考试时间还剩10分钟！！！'
          })
          if(this.time == 0) {
            console.log("考试时间已到,强制交卷。")
            this.$axios({
                url:`https://localhost:49153/submitExam/${self.userInfo.id}/${self.examData.id}`,
                method:'get',
              }).then(res => {
                    window.removeEventListener("visibilitychange", this.alertSrceen);
                    this.$router.push({path:'/student'})
              })
          }
        }
      },1000 * 60)
    }
  },
  computed:mapState(["isPractice"])
}
</script>

<style lang="scss">
.iconfont.icon-time {
  color: #f1d532;
  margin: 0px 6px 0px 20px;
}
.analysis {
  margin-top: 20px;
  .right {
    color: #e2e611;
    font-size: 18px;
    border: 1px solid #ebc908;
    padding: 0px 6px;
    border-radius: 4px;
    margin-left: 20px;
  }
  ul li:nth-child(2) {
    margin: 20px 0px;
  }
  ul li:nth-child(3) {
    padding: 10px;
    background-color: #d3c6c9;
    border-radius: 4px;
  }
}
.analysis span:nth-child(1) {
  font-size: 18px;
}
.mark {
  position: absolute;
  width: 4px;
  height: 4px;
  content: "";
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 22px;
}
.border {
  position: relative;
  border: 1px solid #FF90AA !important;
}
.bg {
  background-color: #f97400 !important;
}
.fill .el-input {
  display: inline-flex;
  width: 150px;
  margin-left: 20px;
  .el-input__inner {
    border: 1px solid transparent;
    border-bottom: 1px solid #eee;
    padding-left: 20px;
  }
}
.slider-fade-enter-active {
  transition: all .3s ease;
}
.slider-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slider-fade-enter, .slider-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

.operation .end li:nth-child(2) {
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  background-color: rgb(255, 115, 0);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: rgb(255, 255, 255);
}
.operation .end li {
  cursor: pointer;
  margin: 0 100px;
}
.operation {
  background-color: rgb(255, 115, 0);
  border-radius: 4px;
  padding: 10px 0px;
  margin-right: 10px;
}
.operation .end {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(255, 255, 255);
}
.content .number {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: rgb(247, 243, 17);
  border-radius: 4px;
  margin-right: 4px;
}
.content {
  padding: 0px 20px;
}
.content .topic {
  padding: 20px 0px;
  padding-top: 30px; 
}
.right .content {
  background-color: #fff;
  margin: 10px;
  margin-left: 0px;
  height: 470px;
}
.content .el-radio-group label {
  color: #000;
  margin: 5px 0px;
}
.content .el-radio-group {
  display: flex;
  flex-direction:column;
}
.right .title p {
  margin-left: 20px;
}
.flexarea {
  display: flex;
}
.flexarea .right {
  flex: 1;
}
.auto-right {
  margin-left: auto;
  color: #e6c615;
  margin-right: 10px;
}
.right .title {
  margin-right: 10px;
  padding-right: 30px;
  display: flex;
  margin-top: 10px;
  background-color: #fff;
  height: 50px;
  line-height: 50px;
}
.clearfix {
  clear: both;
}
.l-bottom .final {
  cursor: pointer;
  display: inline-block;
  text-align: center;
 background-color: rgb(247, 138, 6);
  width: 240px;
  margin: 20px 0px 20px 10px;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  margin-top: 22px;
}
#answer .left .item {
  padding-top: 10px;
  font-size: 16px;
}
.l-bottom {
  border-radius: 4px;
  background-color: #fff;
}
.l-bottom .item p {
  margin-bottom: 15px;
  margin-top: 10px;
  color: #000;
  margin-left: 10px;
  letter-spacing: 2px;
}
.l-bottom .item li {
  width: 15%;
  margin-left: 5px;
  margin-bottom: 10px;
}
.l-bottom .item {
  display: flex;
  flex-direction: column;
}
.l-bottom .item ul {
  width: 100%;
  margin-bottom: -8px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.l-bottom .item ul li a { 
  position: relative;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #eee;
  text-align: center;
  color: #000;
  font-size: 16px;
}
.left .l-top {
  display: flex;
  justify-content: space-around;
  padding: 16px 0px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
}
.left {
  width: 260px;
  height: 100%;
  margin: 10px 10px 0px 10px;
}
.left .l-top li:nth-child(2) a {
  border: 1px solid #eee;
}
.left .l-top li:nth-child(3) a {
  background-color: #ffbb00;
  border: none;
}
.left .l-top li:nth-child(4) a {
  position: relative;
  border: 1px solid #eee;
}
.left .l-top li:nth-child(4) a::before {
  width: 4px;
  height: 4px;
  content: " ";
  position: absolute;
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 16px;
}
.left .l-top li {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.left .l-top li a {
  display: inline-block;
  padding: 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #FF90AA;
}
#answer .top {
  background-color: rgb(255, 166, 0);
}
#answer .item {
  color: #fff;
  display: flex;
  padding: 20px;
  font-size: 20px;
}
#answer .top .item li:nth-child(1) {
  margin-right: 10px;
}
#answer .top .item li:nth-child(3) {
  position: relative;
  margin-left: auto;
}
#answer {
  padding-bottom: 30px;
}
.icon20 {
  font-size: 20px;
  font-weight: bold;
}
.item .msg {
  padding: 10px 15px;
  border-radius: 4px;
  top: 47px;
  right: -30px;
  color: #6c757d;
  position: absolute;
  border: 1px solid rgba(0,0,0,.15);
  background-color: #fff;
}
.item .msg p {
  font-size: 16px;
  width: 200px;
  text-align: left;
}
</style>
