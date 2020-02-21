<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>学生成绩</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="select_course" placeholder="选择课程" class="handle-select mr10">
                    <el-option v-for="item in courseTable" :key="item.COURSE_ID" :label="item.CLASS_NAME+' - '+item.SUBJECT_NAME" :value="item.COURSE_ID">
                    </el-option>
                </el-select>
                <el-select v-model="select_student" placeholder="选择学生" class="handle-select mr10">
                    <el-option v-for="item in studentTable" :key="item.user_ID" :label="item.student_NAME" :value="item.user_ID">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="searchGrade">查询</el-button>
            </div>



            <el-table :data="gradeTable" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="semester" label="学期" sortable width="150">
                </el-table-column>
                <el-table-column prop="exam_DATE" label="考试日期" sortable width="150">
                </el-table-column>
                <el-table-column prop="exam_NAME" label="考试名称" width="300">
                </el-table-column>
                <el-table-column prop="grade" label="成绩" width="150">
                </el-table-column>
                <el-table-column prop="target" label="目标分" width="150">
                </el-table-column>

                <!--<el-table-column label="操作" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--&lt;!&ndash;<el-button type="text" icon="el-icon-edit" @click="edit(scope.row)">设置目标分</el-button>&ndash;&gt;-->
                        <!--<el-button type="text" icon="el-icon-tickets" @click="studentEdit(scope.row)">学生自评</el-button>-->
                        <!--<el-button type="text" icon="el-icon-tickets" @click="teacherComment(scope.row)">教师评价</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>



            <!--<div class="pagination">-->
            <!--<el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">-->
            <!--</el-pagination>-->
            <!--</div>-->
            <!--<el-button type="primary" style="margin-top: 20px" @click="">添加考勤信息</el-button>-->

            <div id="hint" style="font-size: 13px; margin-top: 20px; margin-left: 20px; color: gray; display: none;">
                图表右上角有更多功能，可以转换为柱形图查看。
            </div>

            <div id="chart1" style="height: 400%; width: 50%; margin-top: 40px;"></div>

            <el-button type="primary" style="margin-top: 20px" @click="goBack">返回</el-button>
        </div>

        <!--<el-dialog title="发布成绩" :visible.sync="postVisible" width="20%">-->
        <!--<el-form :model="postForm" label-width="100px">-->
        <!--<el-form-item label="姓名">-->
        <!--<span style="text-align: center;margin-left: 30px">成绩</span>-->
        <!--</el-form-item>-->
        <!--<el-form-item v-for="item in students"  :label="item.student_NAME">-->
        <!--<el-input v-model="item.grade" style="width: 100px"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-button type="primary" @click="post">发布</el-button>-->
        <!--<el-button type="info" @click="postVisible=false">取消</el-button>-->
        <!--</el-form-item>-->
        <!--</el-form>-->
        <!--</el-dialog>-->



        <!-- 编辑弹出框 -->
        <!--<el-dialog title="编辑" :visible.sync="editVisible" width="30%">-->
        <!--<el-form ref="form" :model="form" label-width="50px">-->
        <!--<el-form-item label="日期">-->
        <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="姓名">-->
        <!--<el-input v-model="form.name"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="地址">-->
        <!--<el-input v-model="form.address"></el-input>-->
        <!--</el-form-item>-->

        <!--</el-form>-->
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="editVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="saveEdit">确 定</el-button>-->
        <!--</span>-->
        <!--</el-dialog>-->

        <!-- 删除提示框 -->
        <!--<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>-->
        <!--<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>-->
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="delVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="deleteRow">确 定</el-button>-->
        <!--</span>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
    export default {
        name: 'ClassTable',
        data() {
            return {

                postForm:{
                    grade:''
                },
                students:[],
                dis:false,
//                classname:'',
                select_course:'',
                select_student:'',
                gradeTable:[],
                courseTable:[],
                studentTable:[],
                studentCount:0
            }
        },
        created() {
            // this.getData();
        },
        mounted(){
            let api=this.$api.userApi.getCourse;
            let id=localStorage.getItem('id');
            api.data={
                TEACHER_ID:id
            };
            this.axios(api).then(response=>{
                console.log(response);
                this.courseTable=response.data.data;
            });
        },
        watch:{
            select_course(val){
                this.select_student = '';
                let api2 = this.$api.userApi.getCourseStu;
                api2.data={
                    COURSE_ID: this.select_course
                };
                this.axios(api2).then(response=>{
                    console.log(response);
                    this.studentTable=response.data.data;
                });
            }
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                            d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            goBack(){
                this.$router.push('table');
            },
            post(){
                let gradeArr=[];
                let gradeIdArr=[];
                for(let i=0;i<this.students.length;i++){
                    gradeArr.push(this.students[i].grade);
                    gradeIdArr.push(this.students[i].grade_ID);
                }
                let grade=gradeArr.join(',');
                let gradeId=gradeIdArr.join(',');
                // console.log(grade);
                // console.log(gradeId);
                let api=this.$api.userApi.postGrade;
                api.data={
                    GRADE:grade,
                    GRADE_ID:gradeId
                };
                this.axios(api).then(response=>{
                    // console.log(response);
                    if(response.data.code===0){
                        this.$notify({
                            title: '成功',
                            message: '成绩发布成功',
                            type: 'success'
                        });
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '成绩发布失败'
                        });
                    }
                });
                this.postVisible=false;
            },
            searchGrade(){
                let api = this.$api.userApi.getStuGrade;
                api.data = {
                    COURSE_ID: this.select_course,
                    USER_ID: this.select_student
                }
                this.axios(api).then(response=>{
                    this.gradeTable=response.data.data;

                    for(let i=0;i<this.gradeTable.length;i++){
                        if(this.gradeTable[i].grade === 0)
                            this.gradeTable[i].grade = '未发布';
                        if(this.gradeTable[i].target === 0)
                            this.gradeTable[i].target = '未设置';
                    }


                    document.getElementById("hint").style.display="";
                    let myCharts = this.$echarts.init(document.getElementById('chart1'));
                    let option = {
                        title : {
                            text: '考试情况分析',
                            subtext: ''
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['实际成绩','目标分数']
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                magicType : {show: true, type: ['line', 'bar']},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : []
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                axisLabel : {
                                    formatter: '{value} 分'
                                }
                            }
                        ],
                        series : [
                            {
                                name:'实际成绩',
                                type:'line',
                                data:[],
                                markPoint : {
                                    data : [
                                        {type : 'max', name: '最大值'},
                                        {type : 'min', name: '最小值'}
                                    ]
                                },
                                markLine : {
                                    data : [
                                        {type : 'average', name: '平均值'}
                                    ]
                                }
                            },
                            {
                                name:'目标分数',
                                type:'line',
                                data:[],
                                markPoint : {
                                    data : [
//                                    {name : '最低', value : -2, xAxis: 1, yAxis: -1.5}
                                    ]
                                },
                                markLine : {
                                    data : [
                                        {type : 'average', name : '平均值'}
                                    ]
                                }
                            }
                        ]
                    };

                    console.log(this.gradeTable);

                    for(let i = 0; i < this.gradeTable.length; ++i){
                        option.xAxis[0].data.push(this.gradeTable[i].exam_DATE);
                        option.series[0].data.push(this.gradeTable[i].grade);
                        option.series[1].data.push(this.gradeTable[i].target);
                    }
                    myCharts.setOption(option);
                    window.addEventListener('resize',function() {myCharts.resize()});

                });
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                // this.getData();
            },
            // 获取 easy-mock 的模拟数据
            // getData() {
            //     // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
            //     if (process.env.NODE_ENV === 'development') {
            //         this.url = '/ms/table/list';
            //     };
            //     this.$axios.post(this.url, {
            //         page: this.cur_page
            //     }).then((res) => {
            //         this.tableData = res.data.list;
            //     })
            // },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            edit(row) {
                // this.idx = index;
                // const item = this.tableData[index];
                // this.form = {
                //     name: item.name,
                //     date: item.date,
                //     address: item.address
                // };
                // this.editVisible = true;
                for(let i=0;i<this.examList.length;i++){
                    if(this.examList[i].exam_ID===row.exam_ID){
                        if(this.examList[i].days_LEFT==='已考试'){
                            this.$notify.error({
                                title: '失败',
                                message: '考试时间已过，无法修改'
                            });
                        }else{
                            this.$router.push('/form?exam_id='+row.exam_ID);
                        }
                    }
                }
            },
            delete(row) {
                // this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
        }
    }

</script>

<style scoped>
    .classname {
        font-size: 16px;
        margin-bottom: 20px;
    }

    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 180px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
