<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';

    export default {
        data() {
            return {
                collapse: false,
                admin:[
                    {
                        icon:'el-icon-lx-cascades',
                        index: 'dashboard-a',
                        title: '学校信息'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'user-table',
                        title: '用户管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'department-table',
                        title: '部门管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'teacher-info',
                        title: '教师管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'class-table',
                        title: '班级管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'student-table',
                        title: '学生管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'subject-table',
                        title: '学科管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'course-table',
                        title: '课程管理'
                    },
                ],
                student: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard-s',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'table-s',
                        title: '课程列表'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'student-exam',
                        title: '考试列表'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'course-grade',
                        title: '成绩查询'
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: 'article-list',
                        title: '文章列表'
                    },
                ],
                teacher: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'table',
                        title: '课程列表'
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: 'form',
                        title: '发布考试'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'class-info',
                        title: '班级信息'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'student-grade',
                        title: '学生成绩'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'exam-info',
                        title: '考试列表'
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: 'markdown',
                        title: '发布文章',
                    },
                    {
                        icon: 'el-icon-lx-copy',
                        index: 'article-list',
                        title: '文章列表'
                    },
//                    {
//                        icon: 'el-icon-lx-cascades',
//                        index: 'grade-table',
//                        title: '成绩查询'
//                    },
                    // {
                    //     icon: 'el-icon-lx-copy',
                    //     index: 'tabs',
                    //     title: 'tab选项卡'
                    // },
//                    {
//                        icon: 'el-icon-lx-calendar',
//                        index: '3',
//                        title: '发布文章',
//                        subs: [
//                            {
//                                index: 'editor',
//                                title: '富文本编辑器'
//                            },
//                            {
//                                index: 'markdown',
//                                title: 'markdown编辑器'
//                            },
//                            {
//                                index: 'upload',
//                                title: '文件上传'
//                            }
//                        ]
//                    },
                ],
                items: [
                    // {
                    //     icon:'el-icon-tickets',
                    //     index:'grade-table',
                    //     title:'考试成绩'
                    // },
                    // {
                    //     icon: 'el-icon-lx-emoji',
                    //     index: 'icon',
                    //     title: '自定义图标'
                    // },
                    // {
                    //     icon: 'el-icon-lx-favor',
                    //     index: 'charts',
                    //     title: 'schart图表'
                    // },
                    // {
                    //     icon: 'el-icon-rank',
                    //     index: '6',
                    //     title: '拖拽组件',
                    //     subs: [
                    //         {
                    //             index: 'drag',
                    //             title: '拖拽列表',
                    //         },
                    //         {
                    //             index: 'dialog',
                    //             title: '拖拽弹框',
                    //         }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-lx-warn',
                    //     index: '7',
                    //     title: '错误处理',
                    //     subs: [
                    //         {
                    //             index: 'permission',
                    //             title: '权限测试'
                    //         },
                    //         {
                    //             index: '404',
                    //             title: '404页面'
                    //         }
                    //     ]
                    // }
                ]
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        mounted() {
            let role = localStorage.getItem('role');
            console.log(role);
            if (role === '2') {
                this.items = this.teacher;
            } else if (role === '3') {
                this.items = this.student;
            }else if(role==='1'){
                this.items=this.admin;
            }
            // else this.item=[];
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
