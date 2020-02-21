<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 考试成绩</el-breadcrumb-item>
            </el-breadcrumb>

        </div>
        <div class="container">
            <!--<div class="handle-box">-->
                <!--<el-select v-model="select_subject" placeholder="选择考试" class="handle-select mr10">-->
                    <!--<el-option v-for="item0 in courseTable" :key="item0.COURSE_ID" :label="item0.CLASS_NAME+' - '+item0.SUBJECT_NAME" :value="item0.COURSE_ID">-->
                    <!--</el-option>-->

                <!--</el-select>-->
            <!--</div>-->

            <div id="examName" style="font-size: 13px; margin: 16px; color: gray;">
                考试名称：{{exam_name}}
            </div>

            <el-table :data="gradeTable" border class="table" style="width: 50%;float: left">

                <el-table-column prop="RANK" sortable label="排名"  width="90">
                </el-table-column>
                <el-table-column prop="STUDENT_NAME" label="学生姓名" width="130">
                </el-table-column>
                <el-table-column prop="GRADE" label="成绩" sortable width="90">
                </el-table-column>
                <!--<el-table-column prop="TARGET" sortable label="目标" width="150%">-->
                <!--</el-table-column>-->
                <el-table-column label="操作" align="center" width="250">
                    <template slot-scope="scope">
                        <!--<el-button type="text" icon="el-icon-edit" @click="edit(scope.row)">设置目标分</el-button>-->
                        <el-button type="text" icon="el-icon-tickets" @click="studentComment(scope.row)">学生自评</el-button>
                        <el-button type="text" icon="el-icon-tickets" @click="teacherEdit(scope.row)">教师评价</el-button>
                    </template>
                </el-table-column>

                <!--<el-table-column label="操作" width="250" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button type="text" icon="el-icon-edit" @click="edit(scope.row)">修改成绩</el-button>-->
                        <!--&lt;!&ndash;<el-button type="text" icon="el-icon-tickets" @click="addExam(scope.row)">发布考试</el-button>&ndash;&gt;-->
                        <!--&lt;!&ndash;<el-button type="text" icon="el-icon-delete" class="red" @click="delete( scope.row)">删除</el-button>&ndash;&gt;-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <div id="chart1" style="height: 400%;width: 40%;float: left;margin-left: 5%; margin-right: 5%"></div>
            <!--<div id="contain" style="min-width:400px;height:400px"></div>-->
            <div class="clear" style="clear: both"></div>
            <el-button type="primary" style="margin-top: 20px" @click="modifyGrade">修改成绩</el-button>
            <el-button type="primary" style="margin-top: 20px" @click="goBack">返回</el-button>

        </div>

        <el-dialog title="修改成绩" :visible.sync="postVisible" width="20%">
            <el-form label-width="100px">
                <el-form-item label="姓名">
                    <span style="text-align: center;margin-left: 30px">成绩</span>
                </el-form-item>
                <el-form-item v-for="item in students"  :label="item.student_NAME">
                    <el-input v-model="item.grade" style="width: 100px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="modify">修改</el-button>
                    <el-button type="info" @click="postVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 学生自评 -->
        <el-dialog :title="tit" :visible.sync="dialogFormVisibleS" width="30%">
            <div class="block" style="text-align: center; margin-bottom: 30px;">
                <span class="demonstration" style="font-size: 15px;">本次考试中学生自评</span>
                <el-rate
                        v-model= "stu_value"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                </el-rate>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 15px; margin-bottom: 10px;">学生自评</div>
            </div>
            <div style="text-align: center;">
                <el-form>
                    <el-input type="textarea" v-model="stu_text" :disabled="true" :autosize="{ minRows: 3, maxRows: 6}" autocomplete="off" style="width: 70%;"></el-input>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <!--<el-button type="primary" @click="studentComment">确 定</el-button>-->
                <el-button @click="dialogFormVisibleS = false">关 闭</el-button>
            </div>
        </el-dialog>

        <!-- 教师评价 -->
        <el-dialog :title="tit" :visible.sync="dialogFormVisibleT" width="30%">
            <div class="block" style="text-align: center; margin-bottom: 30px;">
                <span class="demonstration" style="font-size: 15px;">给本次考试的表现评分</span>
                <el-rate
                        v-model= "tea_value"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                </el-rate>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 15px; margin-bottom: 10px;">个人总结</div>
            </div>
            <div style="text-align: center;">
                <el-form>
                    <el-input type="textarea" v-model="tea_text" :autosize="{ minRows: 3, maxRows: 6}" autocomplete="off" style="width: 70%;"></el-input>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="teacherComment">确 定</el-button>
                <el-button @click="dialogFormVisibleT = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        name: "GradeTable",
        data(){
            return{
                gradeTable:[],
                gradeSegment:[],
                grade:[],
                examId:0,
                exam_name:'',
                stu_value:0,
                tea_value:0,
                stu_text:'',
                tea_text:'',
                tit:'',
                postVisible:false,
                dialogFormVisibleS: false,
                dialogFormVisibleT: false,
                students:[],
                postForm:[],
                avg:''
            }
        },
        mounted(){
            let url=window.location.href;
            let arr=url.split('=');
            this.examId=arr[1];
            let api=this.$api.userApi.getGradeByExam;
            api.data={
                EXAM_ID:arr[1]
            };
            this.axios(api).then(response=>{
                // console.log(response);
                this.gradeTable=response.data.data;
            });

            let api4 = this.$api.userApi.getExamInfo;
            api4.data = {
                EXAM_ID: arr[1]
            };
            this.axios(api4).then(response=>{
                 console.log(response);
                this.exam_name = response.data.data.exam_NAME;
            });


            let api3=this.$api.userApi.getGrade;
            api3.data={
                EXAM_ID:arr[1]
            };
            this.axios(api3).then(response=>{
                // console.log(response);
                this.avg=response.data.data.AVG;
            }).then(()=>{
                let api2=this.$api.userApi.gradeSegmantation;
                api2.data={
                    EXAM_ID:arr[1]
                };
                this.axios(api2).then(response=>{
                    // console.log(response);
                    // console.log(response.data.data[0]);
                    this.gradeSegment=response.data.data.key;
                    this.grade=response.data.data.value;
                }).then(()=>{
                    let myCharts=this.$echarts.init(document.getElementById('chart1'));
                    let option = {
                        title : {
                            text: '成绩段分布',
                            subtext:'平均分：'+this.avg,
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
//                            data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                        },
                        series :
                            {
                                name: '成绩段',
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],

                                data:[],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                    };
                    for(let i=0;i<this.gradeSegment.length;i++){
                        if(this.gradeSegment[i]==="COUNT") continue;
                        if(this.grade[i]==='0') continue;
                        let obj={};
                        obj.value=this.grade[i];
                        obj.name=this.gradeSegment[i];
                        // console.log(obj);
                        option.series.data.push(obj);
                        // console.log(option.series.data);
                    }

                    myCharts.setOption(option);

                    //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
                    window.addEventListener('resize',function() {myCharts.resize()});
                })
            })


        },
        methods:{
            goBack(){
                this.$router.push('exam-info');
            },
            modifyGrade(){
                let api=this.$api.userApi.getGradeTable;
                api.data={
                    EXAM_ID:this.examId
                };
                this.axios(api).then(response=>{
                    console.log(response);
                    this.students=response.data.data;
                });
                this.postVisible=true;
            },
            modify(){
                let gradeArr=[];
                let gradeIdArr=[];
                for(let i=0;i<this.students.length;i++){
                    if(this.students[i].grade>150||this.students[i].grade<0){
                        this.$notify.error({
                            title: '失败',
                            message: '分数应在0-150之间'
                        });
                        return ;
                    }else {
                        gradeArr.push(this.students[i].grade);
                        gradeIdArr.push(this.students[i].grade_ID);
                    }
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
                            message: '成绩修改成功',
                            type: 'success'
                        });
                        location.reload();
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '成绩修改失败'
                        });
                    }
                });
                this.postVisible=false;
            },
            studentComment(row){

                console.log(this.gradeTable);
                this.targetRow = row;
                let api = this.$api.userApi.getGradeDetail;
                api.data = {
                    GRADE_ID: this.targetRow.GRADE_ID
                }
                this.axios(api).then(response=>{
                    this.stu_text = response.data.data.s_COMMENT;
                    this.stu_value = response.data.data.s_SCORE;
//                        console.log(response.data);
                })
//                    console.log(this.stu_value);
//                    if(this.tea_value === 0){
//                        this.$notify.error({
//                            title: '失败',
//                            message: '教师尚未评价'
//                        });
//                    }
//                    else{
                this.dialogFormVisibleS = true;
                this.tit = this.exam_name + ' 的 学生评价';
            },
            teacherEdit(row){
                if(row.days_LEFT >= 0){
                    this.$notify.error({
                        title: '失败',
                        message: '考试还未进行'
                    });
                }
                else{
                    this.targetRow = row;
                    let api = this.$api.userApi.getGradeDetail;
                    api.data = {
                        GRADE_ID: this.targetRow.GRADE_ID
                    }
                    this.axios(api).then(response=>{
//                        console.log(response.data);
//                        console.log(this.stu_value);
//                        console.log(this.stu_text);
//                        console.log(response.data.data.s_COMMENT);
//                        console.log(response.data.data.s_SCORE);
                        this.tea_text = response.data.data.t_COMMENT;
                        this.tea_value = response.data.data.t_SCORE;
                    })
                    this.dialogFormVisibleT = true;
                    this.tit = this.exam_name + ' 的 教师评价';

                }
            },
            teacherComment(){
                let api = this.$api.userApi.teaComment;
//                console.log(this.targetRow);
                api.data = {
                    GRADE_ID: this.targetRow.GRADE_ID,
                    T_COMMENT: this.tea_text,
                    T_SCORE: this.tea_value
                };
                this.axios(api).then(response=>{
                    if(response.data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '教师评价成功',
                            type: 'success'
                        });
//                        location.reload();
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '上传失败'
                        });
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
</style>
