import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login', //登录界面
      component: () => import('@/components/common/login')
    },
    {
      path:'/sign',
      name:'sign',
      component:()=> import("@/components/common/sign")},
    {
      path: '/index', //教师主页
      component: () => import('@/components/teacher/index'),
      children: [
        {
          path: '/', //首页默认路由
          component: () => import('@/components/common/hello')
        },
        {
          path:'/selectExamAnswer',
          component: () => import('@/components/teacher/selectExamAnswer')
        },
        {
          path:'/correctAnswer',
          component: () => import('@/components/teacher/correctAnswer')
        },
        {
          path: '/allStudentsGrade', //所有学生成绩统计
          component: () => import('@/components/teacher/allStudentsGrade')
        },
        {
          path:'/addAnswerChildren2',
          component: () => import('@/components/teacher/addAnswerChildren2')
        },
        {
          path: '/selectExam', //查询所有考试
          component: () => import('@/components/teacher/selectExam')
        },
        {
          path: '/addExam', //添加考试
          component: () => import('@/components/teacher/addExam')
        },
        {
          path: '/addAnswer', //增加题库主界面
          component: () => import('@/components/teacher/addAnswer')
        },
        {
          path: '/addAnswerChildren', //点击试卷跳转到添加题库页面
          component: () => import('@/components/teacher/addAnswerChildren')
        },
        {
          path: '/studentManage', //学生管理界面
          component: () => import('@/components/teacher/studentManage')
        },
        {
          path: '/addStudent', //添加学生
          component: () => import('@/components/teacher/addStudent')
        },
      ]
    },
    {
      path: '/student',
      component: () => import('@/components/student/index'),
      children: [
        {path:"/",component: ()=> import('@/components/student/myExam')},
        {path: '/examMsg', component: () => import('@/components/student/examMsg')},
        {path: '/studentScore', component: () => import("@/components/student/answerScore")},
        {path: '/scoreTable', component: () => import("@/components/student/scoreTable")}
        
      ]
    },
    {path: '/answer',component: () => import('@/components/student/answer')}
  ]
})
