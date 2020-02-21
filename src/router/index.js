import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// enter切换输入框
Vue.directive('enterToNext',{
    inserted:function(el){
        console.log("enterToNext...")
        //let frm = el.querySelector('.el-form');
        let inputs = el.querySelectorAll('input');
        console.log(inputs);
        //绑定回写事件
        for( var i = 0 ;i < inputs.length ; i++ ){
            inputs[i].setAttribute("keyFocusIndex",i);
            inputs[i].addEventListener('keyup', (ev) => {
                if (ev.keyCode === 13) {
                    let targetTo = ev.srcElement.getAttribute('keyFocusTo');
                    if(targetTo){
                        this.$refs[targetTo].$el.focus();
                    }else{
                        var attrIndex = ev.srcElement.getAttribute('keyFocusIndex');
                        var ctlI = parseInt(attrIndex);
                        if(ctlI<inputs.length-1)
                            inputs[ctlI+1].focus();
                    }
                }
            });
        }

    },
});
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {title: '自述文件'},
            children: [
                {
                    path:'grade-table',
                    component:resolve=>require(['../components/page/GradeTable.vue'],resolve),
                    meta:{title:'考试成绩'}
                },
                {
                    path:'department-table',
                    component:resolve=>require(['../components/page/DepartmentTable.vue'],resolve),
                    meta:{title:'部门列表'}
                },
                {
                    path: '/exam-info',
                    component: resolve => require(['../components/page/ExamInfo.vue'], resolve),
                    meta:{title:'考试列表'}
                },
                {
                    path: '/student-exam',
                    component: resolve => require(['../components/page/StudentExam.vue'], resolve),
                    meta:{title:'考试列表'}
                },
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: {title: '系统首页'}
                },
                {
                    path: '/dashboard-s',
                    component: resolve => require(['../components/page/dashboardStu.vue'], resolve),
                    meta: {title: '系统首页'}
                },
                {
                    path: '/dashboard-a',
                    component: resolve => require(['../components/page/DashboardAdmin.vue'], resolve),
                    meta: {title: '系统首页'}
                },
                {
                    path: '/table-s',
                    component: resolve => require(['../components/page/StudentCourse.vue'], resolve),
                    meta: {title: '课程列表'}
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: {title: '自定义图标'}
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: {title: '基础表格'}
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: {title: 'tab选项卡'}
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: {title: '基本表单'}
                },
                {
                    path: '/class-info',
                    component: resolve => require(['../components/page/ClassTable.vue'], resolve),
                    meta: {title: '班级信息'}
                },
                {
                    path: '/class-table',
                    component: resolve => require(['../components/page/ClassInfo.vue'], resolve),
                    meta: {title: '班级管理'}
                },
                {
                    path: '/subject-table',
                    component: resolve => require(['../components/page/SubjectTable.vue'], resolve),
                    meta: {title: '学科管理'}
                },
                {
                    path: '/student-table',
                    component: resolve => require(['../components/page/StudentInfo.vue'], resolve),
                    meta: {title: '学生列表'}
                },
                {
                    path: '/teacher-info',
                    component: resolve => require(['../components/page/TeacherInfo.vue'], resolve),
                    meta: {title: '教师管理'}
                },
                {
                    path: '/course-table',
                    component: resolve => require(['../components/page/CourseTable.vue'], resolve),
                    meta: {title: '课程管理'}
                },
                {
                    path: '/user-table',
                    component: resolve => require(['../components/page/UserTable.vue'], resolve),
                    meta: {title: '用户管理'}
                },
                {
                    path:'/course-grade',
                    component:resolve => require(['../components/page/CourseGrade.vue'],resolve),
                    meta: {title: '成绩查询'}
                },
                {
                    path:'/student-grade',
                    component:resolve => require(['../components/page/StudentTable.vue'],resolve),
                    meta: {title: '学生成绩'}
                },
                {
                    path:'/article-list',
                    component:resolve => require(['../components/page/ArticleList.vue'],resolve),
                    meta: {title: '文章列表'}
                },
                {
                    path:'/article-page',
                    component:resolve => require(['../components/page/ArticlePage.vue'],resolve),
                    meta: {title: '文章页面'}
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: {title: '富文本编辑器'}
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: {title: 'markdown编辑器'}
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: {title: '文件上传'}
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: {title: 'schart图表'}
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: {title: '拖拽列表'}
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                    meta: {title: '拖拽弹框'}
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: {title: '权限测试', permission: true}
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: {title: '404'}
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: {title: '403'}
                },
                {
                    path:'/modify-pass',
                    component:resolve => require(['../components/page/ModifyPass.vue'],resolve)
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/register',
            component: resolve => require(['../components/page/Register.vue'], resolve)
        },
        {
            path:'/register-stu',
            component:resolve =>require(['../components/page/RegisterStu.vue'],resolve)
        },
        {
            path:'/register-tea',
            component:resolve =>require(['../components/page/RegisterTea.vue'],resolve)
        },
        {
            path:'/register-sch',
            component:resolve =>require(['../components/page/RegisterSch.vue'],resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
