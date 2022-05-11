<template>
    <div>
        <div>
            <el-input class="search" v-model="key" placeholder="请输入内容" size="large"></el-input>
            <el-button class="search-but"  @click="getAnswerInfo(key)" type="danger" >搜索</el-button>
        </div>
        <el-table :data="answerinfo">
            <el-table-column prop="examName" label="考试名称"></el-table-column>
            <el-table-column prop="examClass" label="考试班级"></el-table-column>
            <el-table-column prop="examStu" label="考生姓名"></el-table-column>
            <el-table-column prop="questionId" label="题号"></el-table-column>
            <el-table-column fixed="right" label="操作" >
                <template slot-scope="scope">
                    <el-button @click="toexamdetails(scope.row)" type="danger">批改</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return {
            answerinfo:[],
            key:"",

        }
    },
    created(){
        this.getAnswerInfo("")
    },
    methods:{
        getAnswerInfo(key){
            if(key===undefined)
                key=""
            this.$axios(`https://localhost:49153/questionAnswerInfo/${key}`).then(
                res => {
                    this.answerinfo = res.data
                }
            )
        },
        toexamdetails(row){
            this.$router.push({ path: "/correctAnswer", query: { stuId: row.stuId,examId:row.examId,questionId:row.questionId,stuAcc:row.stuacc,examname: row.examName } });
        }
    }
}
</script>

<style>
.search {
    display: inline-block;
    width: 600px;
    margin: auto;
    padding-left: 1em;
   
}
.search-but {
    display: inline-block;
    width: 80px;
    margin: auto;
    padding: auto;
     top: 20px;
}
</style>