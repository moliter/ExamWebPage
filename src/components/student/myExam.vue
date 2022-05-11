// 我的试卷页面
<template>
  <div id="myExam">
    <div class="title">我的试卷</div>
    <div class="wrapper">
      <ul class="top">
        <li class="order">试卷列表</li>
        <li class="search-li"><div class="icon"><input type="text" placeholder="试卷名称" class="search" v-model="key"><i class="el-icon-search"></i></div></li>
        <li><el-button type="danger" @click="search()">搜索试卷</el-button></li>
      </ul>
      <ul class="paper" v-loading="loading">
        <li class="item" v-for="(item,index) in exams" :key="index">
          <h4 @click="toExamMsg(item)">{{item.name}}</h4>
          <p class="name">{{item.name}}</p>
          <div class="info">
            <i class="el-icon-loading"></i><span>{{item.date}}</span>
            <i class="iconfont icon-icon-time"></i><span v-if="item.time != null">限时{{item.time}}分钟</span>
            <i class="iconfont icon-fenshu"></i><span>满分{{item.score}}分</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  // name: 'myExam'
  data() {
    return {
      loading: false,
      key: null, //搜索关键字
      allExam: null, //所有考试信息
      exams:null,
      userId:'',
      examdate:'',
    }
  },
  created() {
    this.getExamInfo()
    this.loading = true
  },
  // watch: {
    
  // },
  methods: {
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
    //获取当前所有考试信息
    getExamInfo() {
      var userId = this.$cookies.get('cid');
      var self= this
      this.$axios(`https://localhost:49153/exam/exams/${userId}`).then(res => {
        res.data.forEach(e => {
          var date1 = new Date(e.date)
          e.date = self.getTime(date1)
        });
        this.exams = res.data;
        this.loading = false;
      }).catch(error => {
        console.log(error)
      })
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val
      this.getExamInfo()
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val
      this.getExamInfo()
    },
    //搜索试卷
    search() {
      var userId = this.$cookies.get('cid');
      var self = this;
      this.$axios(`https://localhost:49153/exam/exams/${userId}&${this.key}`).then(res => {
        if(res.status == 200) {
          res.data.forEach(e => {
          var date1 = new Date(e.date)
          e.date = self.getTime(date1)
        });
          this.exams = res.data;
        }
      })
    },
    //跳转到试卷详情页
    toExamMsg(item) {
      this.$router.push({path: '/examMsg', query: {examitem: item}})
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  padding: 20px 0px 30px 0px;
  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
.paper {
  h4 {
    cursor: pointer;
  }
}
.paper .item a {
  color: #000;
}
.wrapper .top .order {
  cursor: pointer;
}
.wrapper .top .order:hover {
  color: #0195ff;
  border-bottom: 2px solid #0195ff;
}
.wrapper .top .order:visited {
  color: #0195ff;
  border-bottom: 2px solid #0195ff;
}
.item .info i {
  margin-right: 5px;
  color: #0195ff;
}
.item .info span {
  margin-right: 14px;
}
.paper .item {
  width: 380px;
  border-radius: 4px;
  padding: 20px 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
  transition: all 0.6s ease;
}
.paper .item:hover {
  box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45);
  transform: scale(1.03);
}
.paper .item .info {
  font-size: 14px;
  color: #88949b;
}
.paper .item .name {
  font-size: 14px;
  color: #88949b;
}
.paper * {
  margin: 20px 0;
}
.wrapper .paper {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.top .el-icon-search {
  position: absolute;
  right: 10px;
  top: 10px;
}
.top .icon {
  position: relative;
}
.wrapper .top {
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
#myExam .search-li {
  margin-left: auto;
}
.top .search-li {
  margin-left: auto;
}
.top li {
  display: flex;
  align-items: center;
}
.top .search {
  margin-left: auto;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
.top .search:hover {
  color: #0195ff;
  border-color: #0195ff;
}
.wrapper .top {
  display: flex;
}
.wrapper .top li {
  margin: 20px;
}
#myExam {
  width: 980px;
  margin: 0 auto;
}
#myExam .title {
  margin: 20px;
}
#myExam .wrapper {
  background-color: #fff;
}
</style>
