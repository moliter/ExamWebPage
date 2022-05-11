// 添加题库
<template>
  <div class="add">
    <el-tabs v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label"><i class="iconfont el-icon-zoom-in"></i>添加题目</span>
        <section class="append exam" >
          <el-input-number v-model="score" :disabled="true" class="w80" size="small"></el-input-number>
          <ul>
            <li>
              <el-input width='800px' v-model="searchKey" placeholder="关键词" size="large" class="w800"> </el-input>
              <el-button type="warning" @click="search(searchKey)" class="w150" > 搜索 </el-button>
            </li>
          </ul>
        </section>
        <div class="exam">
          <el-table :data="questions" border>
            <el-table-column fixed="left" prop="stem" label="题目信息" width="400"></el-table-column>
            <el-table-column prop="subject" label="类别" width="200"></el-table-column>
            <el-table-column prop="questionType" label="题目类型" width="100"></el-table-column>
            <el-table-column prop="cost" label="试题分数" width="100"></el-table-column>
            <el-table-column prop="difficultyLevel" label="难度等级" width="100"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button :disabled="scope.row.btnn == 1" @click="addToExam(scope.row)" type="warning" size="small">添加</el-button>
                <el-button :disabled="scope.row.btnn == 1" @click="delFromExam(scope.row)" type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"><i class="iconfont icon-daoru-tianchong"></i>智能组卷</span>
        <div class="box">
            <section class="add1">
              <el-form ref="form" :model="autodata" label-width="100px">
                <el-form-item label="试题难度" style="width: 180px;">
                  <el-select v-model="autodata.difficultyValue" placeholder="试题难度" class="w150" >
                    <el-option
                      v-for="item in difficulty"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择题数量：">
                  <el-input-number v-model="autodata.cnumber" class="w150" min="0" max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="选择题分数：">
                    <el-input-number v-model="autodata.ccost" class="w150" min="0" max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="解答题数量：">
                  <el-input-number v-model="autodata.tnumber" class="w150" min="0" max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="解答题分数：">
                  <el-input-number v-model="autodata.tcost" class="w150" min="0" max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="选择类别：" >
                  <el-col :span="11" style="display: flex; width: 200px;">
                    <el-input v-model="autodata.subject" type="datetime" placeholder="类别" class="w150" style="width: 100px;margin-left: 20px;" > </el-input>
                    <div style="margin-left:20px;">当前总分:<span id='sumScore'></span></div>
                  </el-col>
                </el-form-item>
                <el-form-item>
                  <el-button type="warning" @click="autocreate(autodata)">立即创建</el-button>
                </el-form-item>
              </el-form>
            </section>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      autodata:{
        cnumber: null, //选择题出题数量
        tnumber: null, //解答题出题数量
        ccost:null,
        tcost:null,
        subject:null,//随机组卷类别
        difficultyValue: '简单',
      },
      activeName: 'first',  //活动选项卡
      searchKey:null,
      questions:null,
      paperId:null,
      examquestion:{
        exam:null,
        question:null
      },
      show:1,
      score:0,
    };
  },
  created() {
    this.getParams()
  },
  methods: {
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // },
    autocreate(autodata){
      autodata.exam=this.paperId;
      this.$axios(
        {
          url:`https://localhost:49153/api/question/autoquestion`,
          method:'post',
          data:{
            ...this.autodata
          }
        }
      ).then(
         res => {
          this.$message({ //成功修改提示
            message: '生成成功',
            type: 'success'
          });
        }
      ).catch(error => console.log(error))
    },
    getParams() {
      this.paperId = this.$route.query.id
    },
    search(searchKey){
      this.$axios(`https://localhost:49153/api/question/questionbase/${this.searchKey}`).then(res => {
        this.questions = res.data;
        questions.forEach(el=> {
          el.btnn=0;
        });
      }).catch
      (error => console.error(error)
      )
    },
    addToExam(row){
      var id=row.id;
      console.log(row)
      this.examquestion.exam=this.paperId;
      this.examquestion.question=id;
      this.$axios({
        url:'https://localhost:49153/questionExam/add',
        method:'post',
        data:{
          ...this.examquestion
        }
      }).then(row.btnn=1)
      .then(
        res => {
          this.score += Number(row.cost);
          this.$message({ //成功修改提示
            message: '添加成功',
            type: 'success'
          });
        }
      )
      .catch(error => console.log(error));
      
    },
    delFromExam(row){
      console.log(row)
      var id=row.id;
      var exam=this.paperId;
      var question=id;
      this.$axios({
        url:`https://localhost:49153/quesitionExam/Exam=${exam}&Question=${question}`,
        method:'delete',
      }).then(row.btnn=1)
      .then(
        res => {
          this.score -= Number(row.cost);
          this.$message({ //成功修改提示
            message: '删除成功',
            type: 'success'
          });
          
        }
      )
      .catch(error => console.log(error))
    }
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
    .w150 {
      width: 150px;
    }

    .w800{
      width: 800px;
    }
    li:nth-child(2) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.autoinput{
  margin-left: 1em;
  width: 100px;
}
.exam {
  padding: 0px 40px;
  margin-top: 20px;
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
    background-color: #DD5862 !important;
  }
}
  .el-table .warning-row {
    background: #000 !important;
    
  }

  .el-table .success-row {
    background: #DD5862;
  }
  .add1 {
  padding: 0px 40px;
  width: 400px;
}
.w80{
  margin: 10px;
}

</style>


