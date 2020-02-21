<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">上次登录时间：<span>2018-01-01</span></div>
                    <div class="user-info-list">上次登录地点：<span>东莞</span></div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix" style="text-align: center">
                        <span>本学期的课程</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">添加</el-button>-->
                    </div>
                    <el-table :data="courseList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        <!--<el-table-column width="40">-->
                        <!--<template slot-scope="scope">-->
                        <!--<el-checkbox v-model="scope.row.status"></el-checkbox>-->
                        <!--</template>-->
                        <!--</el-table-column>-->
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <!--<el-table-column width="60">-->
                        <!--<template slot-scope="scope">-->
                        <!--<i class="el-icon-edit"></i>-->
                        <!--<i class="el-icon-delete"></i>-->
                        <!--</template>-->
                        <!--</el-table-column>-->
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                </el-row>
                <el-card shadow="hover" style="height:500px;">
                    <div slot="header" class="clearfix">
                        <span>未进行的考试</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">添加</el-button>-->
                    </div>
                    <el-table :data="examList" :show-header="false" height="400" style="width: 100%;font-size:14px;">
                        <!--<el-table-column width="40">-->
                        <!--<template slot-scope="scope">-->
                        <!--<el-checkbox v-model="scope.row.status"></el-checkbox>-->
                        <!--</template>-->
                        <!--</el-table-column>-->
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template slot-scope="scope">
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <!--<el-row :gutter="20">-->
        <!--<el-col :span="12">-->
        <!--<el-card shadow="hover">-->
        <!--<schart ref="bar" class="schart" canvasId="bar" :data="data" type="bar" :options="options"></schart>-->
        <!--</el-card>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
        <!--<el-card shadow="hover">-->
        <!--<schart ref="line" class="schart" canvasId="line" :data="data" type="line" :options="options2"></schart>-->
        <!--</el-card>-->
        <!--</el-col>-->
        <!--</el-row>-->
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    export default {
        name: 'dashboardS',
        data() {
            return {
                courseList:[],
                examList:[],
                name: localStorage.getItem('userName'),
                role: '学生',
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created(){
            this.handleListener();
            this.changeDate();
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        mounted(){
            // console.log(localStorage.getItem('role'));
            let space='\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0';
            let id=localStorage.getItem('id');
            // switch (localStorage.getItem('role')) {
            //     case '3': this.role= '学生';
            //         // console.log(this.role);
            //         break;
            //     case '2': this.role='教师';
            //         break;
            //     case '1': this.role='管理员';
            //         break;
            //     case '0': this.role='超级管理员';
            //         break;
            //     default:this.role='不存在'
            // }
            let api=this.$api.userApi.findExamByStudent;
            api.data={
                STUDENT_ID:id
            };
            this.axios(api).then(response=>{
                console.log(response);
                let data=response.data.data;
                for(let i=0;i<data.length;i++){
                    if(data[i].days_LEFT>=0){
                        let obj={};
                        obj.title=data[i].exam_DATE+space+data[i].class_NAME+data[i].exam_NAME+space+'还剩 '+data[i].days_LEFT+' 天\xa0\xa0\xa0\xa0目标：'+data[i].target+' 分';
                        this.examList.push(obj);
                    }
                }
            });
            let api2=this.$api.userApi.getCourseByStudent;
            api2.data={
                STUDENT_ID:id
            };
            this.axios(api2).then(response=>{
                console.log(response);
                let data=response.data.data;
                for(let i=0;i<data.length;i++){
                    let obj={};
                    obj.title=space+data[i].CLASS_NAME+'\xa0\xa0\xa0\xa0\xa0'+data[i].SUBJECT_NAME;
                    this.courseList.push(obj);
                }
            })
        },
        methods: {
            changeDate(){
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
                })
            },
            handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
