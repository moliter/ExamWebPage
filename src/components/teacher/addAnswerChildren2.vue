// 添加题库
<template>
  <div class="add">
    <el-tabs v-model="activeName">
    <el-tab-pane name="first">
      <span slot="label"><i class="el-icon-circle-plus"></i>添加试题</span>
      <section class="append">
        <ul>
          <li>
            <span>题目类型:</span>
            <el-select v-model="optionValue" placeholder="请选择题型" class="w150">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li v-if="optionValue == '选择题'">
            <span>难度等级:</span>
            <el-select v-model="postChange.level" placeholder="选择难度等级" class="w150">
              <el-option
                v-for="item in levels"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li v-if="optionValue == '解答题'">
            <span>难度等级:</span>
            <el-select v-model="postFill.level" placeholder="选择难度等级" class="w150">
              <el-option
                v-for="item in levels"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li v-if="optionValue == '选择题'">
            <span>正确选项:</span>
            <el-select v-model="postChange.rightAnswer" placeholder="选择正确答案" class="w150">
              <el-option
                v-for="item in rights"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li v-if="optionValue == '解答题'">
            <span v-if="optionValue == '解答题'" >类别:</span>
            <el-input v-model="postFill.subject" placeholder="请输入类别" class="w150" ></el-input>
          </li>
          <li v-if="optionValue == '选择题'" >
            <span>类别:</span>
            <el-input v-model="postChange.subject" placeholder="请输入类别" class="w150" ></el-input>
          </li>
        </ul>
        <!-- 选择题部分 -->
        <div class="change" v-if="optionValue == '选择题'">
          <div class="title">
            <el-tag>题目:</el-tag>
            <el-input
              type="textarea"
              rows="4"
              v-model="postChange.question"
              placeholder="请输入题目内容"
              resize="none"
              class="answer">
            </el-input>
          </div>
          <div class="options">
            <ul>
              <li>
                <el-tag type="success">A</el-tag>
                <el-input
                  placeholder="请输入选项A的内容"
                  v-model="postChange.answerA"
                  clearable="">
                </el-input>
              </li>
              <li>
                <el-tag type="success">B</el-tag>
                <el-input
                  placeholder="请输入选项B的内容"
                  v-model="postChange.answerB"
                  clearable="">
                </el-input>
              </li>
              <li>
                <el-tag type="success">C</el-tag>
                <el-input
                  placeholder="请输入选项C的内容"
                  v-model="postChange.answerC"
                  clearable="">
                </el-input>
              </li>
              <li>
                <el-tag type="success">D</el-tag>
                <el-input
                  placeholder="请输入选项D的内容"
                  v-model="postChange.answerD"
                  clearable="">
                </el-input>
              </li>
            </ul>
          </div>
          <div class="title">
          </div>
          <div class="submit">
            <el-button type="warning" @click="changeSubmit()" style="margin auto">立即添加</el-button>
          </div>
        </div>
        <!-- 解答题部分 -->
        <div class="change fill" v-if="optionValue == '解答题'">
          <div class="title">
            <el-tag>题目:</el-tag>
            <el-input
              type="textarea"
              rows="4"
              v-model="postFill.question"
              placeholder="请输入题目内容"
              resize="none"
              class="answer">
            </el-input>
          </div>
          <div class="fillAnswer">
            <el-tag>正确答案:</el-tag>
            <el-input v-model="postFill.answer"></el-input>
          </div>
          <div class="submit">
            <el-button type="warning" @click="fillSubmit()" style="margin-top:5px">立即添加</el-button>
          </div>
        </div>
      </section>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',  //活动选项卡
      options: [ //题库类型
        {
          value: '选择题',
          label: '选择题'
        },
        {
          value: '解答题',
          label: '解答题'
        },
      ],
      difficulty: [ //试题难度
        {
          value: '简单',
          label: '简单'
        },
        {
          value: '一般',
          label: '一般'
        },
        {
          value: '困难',
          label: '困难'
        }
      ],
      difficultyValue: '简单',
      levels: [ //难度等级
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        },
        {
          value: '4',
          label: '4'
        },
        {
          value: '5',
          label: '5'
        },
      ],
      rights: [ //正确答案
        {
          value: 'A',
          label: 'A'
        },
        {
          value: 'B',
          label: 'B'
        },
        {
          value: 'C',
          label: 'C'
        },
        {
          value: 'D',
          label: 'D'
        },
      ],
      paperId: null,
      optionValue: '选择题', //题型选中值
      subject: '', //试卷名称用来接收路由参数
      postChange: { //选择题提交内容
        subject: '', //类别
        level: '', //难度等级选中值 
        rightAnswer: '', //正确答案选中值
        question: '', //题目
        answerA: '',//A
        answerB: '',//B
        answerC: '',//C
        answerD: '',//D
        istype:'',//种类
        cost:'0'////分值

      },
      postFill: { //解答题提交内容 
        istype:'',//种类
        level: '', //难度等级选中值 
        answer: '', //正确答案
        question: '', //题目
        subject:'',//类别
        cost:'0'//分值
      },
      input: null,
    };
  },
  created() {
  },
  methods: {
    search(input){
      var index = Math.floor(Math.random() * 10);
      if(input != '')
        this.$axios({
          url:`https://sou.mmifx.com/api.php?token=dfe96f1168241df8a60b36cd20d6e11e85183c75&question=${this.input}&limit=100`,
          method:'get',
        }).then(res => {
          var i = res.data[index];
          if(i.more == ''){
            this.optionValue = "解答题";
            this.answer = i.answer;
            this.question = i.question;
          }
        })
    },
    changeSubmit() { //选择题题库提交
      this.postChange.istype = "choice";
      this.postChange.cost = 0;
      this.postChange.cost  = this.postChange.cost.toString();
      this.$axios({ //提交数据到选择题题库表
        url: 'https://localhost:49153/cquestion/add',
        method: 'post',
        data: {
          ...this.postChange          
        }
      }).then(res => { //添加成功显示提示
        let status = res.status
        if(status == 200) {
          this.$message({
            message: '已添加到题库',
            type: 'success'
          })
          this.postChange = {}
        }
      })
    },
    fillSubmit() { //解答题提交
      this.postFill.istype='txt';
      this.postChange.cost = 0;
      this.postFill.cost=this.postFill.cost.toString();
      var rquestion = {
        cost:this.postFill.cost,
        subject:this.postFill.subject,
        question:this.postFill.question,
        answer:this.postFill.answer,
        level:this.postFill.level,
        istype:this.postFill.istype
      };
      this.$axios({
        url: 'https://localhost:49153/tquestion/add',
        method: 'post',
        data: {
          ...rquestion
        }
      }).then(res => {
        let status = res.status
        if(status == 200) {
          this.$message({
            message: '已添加到题库',
            type: 'success'
          })
          this.postFill = {}
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.add {
  margin: 0px 40px;
  .box {
    padding: 0px 20px;
    ul li {
      margin: 10px 0px;
      display: flex;
      align-items: center;
      .el-input {
        width: 6%;
      }
      .w150 {
        margin-left: 20px;
        width: 7%;
      }
    }
  }
  .el-icon-circle-plus {
    margin-right: 10px;
  }
  .icon-daoru-tianchong {
    margin-right: 10px;
  }
  .append {
    margin: 0px 20px;
    ul {
      display: flex;
      align-items: center;
      li {
        margin-right: 20px;
      }
    }
    .change {
      margin-top: 20px;
      padding: 20px 16px;
      background-color: #E7F6F6;
      border-radius: 4px;
      .title {
        padding-left: 6px;
        color: #2f4f4f;
        span:nth-child(1) {
          margin-right: 6px;
        }
        .answer {
          margin: 20px 0px 20px 8px;
        }
        .el-textarea {
          width: 98% !important;
        }
      }
      .options {
        ul {
          display: flex;
          flex-direction: column;
        }
        ul li {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 98%;
          margin: 10px 0px;
          span {
            margin-right: 20px;
          }
        }
      }
      .submit {
        display: flex;
        justify-content: center;
        align-items: center;
      }        
    }
    .fill {
      .fillAnswer {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          margin-right: 6px;
        }
        .el-input {
          width: 91% !important;
        }
      }
      .analysis {
        margin-top: 20px;
        margin-left: 5px;
      }
    }
    .w150 {
      width: 150px;
    }
    li:nth-child(2) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>


