<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 发布考试</el-breadcrumb-item>
                <!--<el-breadcrumb-item>基本表单</el-breadcrumb-item>-->
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="考试名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="选择课程">
                        <el-select v-model="select_subject" :disabled="dis" placeholder="请选择">
                            <el-option v-for="item in courseTable" :key="item.COURSE_ID" :label="item.CLASS_NAME+' - '+item.SUBJECT_NAME" :value="item.COURSE_ID">
                            </el-option>
                            <!--<el-option key="bbk" label="步步高" value="bbk"></el-option>-->
                            <!--<el-option key="xtc" label="小天才" value="xtc"></el-option>-->
                            <!--<el-option key="imoo" label="imoo" value="imoo"></el-option>-->
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <!--<el-col class="line" :span="2">-</el-col>-->
                        <!--<el-col :span="11">-->
                            <!--<el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>-->
                        <!--</el-col>-->
                    </el-form-item>
                    <!--<el-form-item label="城市">-->
                        <!--<el-input v-model="form.city"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="选择开关">-->
                        <!--<el-switch v-model="form.delivery"></el-switch>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="多选框">-->
                        <!--<el-checkbox-group v-model="form.type">-->
                            <!--<el-checkbox label="步步高" name="type"></el-checkbox>-->
                            <!--<el-checkbox label="小天才" name="type"></el-checkbox>-->
                            <!--<el-checkbox label="imoo" name="type"></el-checkbox>-->
                        <!--</el-checkbox-group>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="单选框">-->
                        <!--<el-radio-group v-model="form.resource">-->
                            <!--<el-radio label="步步高"></el-radio>-->
                            <!--<el-radio label="小天才"></el-radio>-->
                            <!--<el-radio label="imoo"></el-radio>-->
                        <!--</el-radio-group>-->
                    <!--</el-form-item>-->
                    <el-form-item label="备注">
                        <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="judge">{{msg}}</el-button>
                        <el-button @click="goBack">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'baseform',
        mounted(){
            let url=window.location.href;
            let wid=url.split('?');
            let arr=[];
            if(wid.length>1){
                arr=wid[1].split('=');
            }
            // console.log(arr[1]);
            // this.select_subject=arr[1];
                let api=this.$api.userApi.getCourse;
                let id=localStorage.getItem('id');
                // console.log(id);
                api.data={
                    TEACHER_ID:id
                };
                this.axios(api).then(response=>{
                    // console.log(response);
                    this.courseTable=response.data.data;
                    // console.log(this.courseTable);
                    // console.log(this.courseTable.length);
                }).then(()=>{
                    if(arr[0]==='course_id'){
                        for(let i=0;i<this.courseTable.length;i++){
                            if(this.courseTable[i].COURSE_ID===parseInt(arr[1])){
                                this.dis=true;
                                this.select_subject=this.courseTable[i].CLASS_NAME+' - '+this.courseTable[i].SUBJECT_NAME;
                                break;
                            }
                        }
                    }else if(arr[0]==='exam_id'){
                        this.msg='修改考试信息';
                        let api=this.$api.userApi.getExamInfo;
                        api.data={
                            EXAM_ID:arr[1]
                        };
                        this.axios(api).then(response=>{
                            console.log(response);
                            this.form.date1=response.data.data.exam_DATE;
                            this.form.name=response.data.data.exam_NAME;
                            for(let i=0;i<this.courseTable.length;i++){
                                if(this.courseTable[i].COURSE_ID===response.data.data.course_ID){
                                    this.dis=true;
                                    this.select_subject=this.courseTable[i].CLASS_NAME+' - '+this.courseTable[i].SUBJECT_NAME;
                                    break;
                                }
                            }
                        })
                    }
                })
        },
        data: function(){
            return {
                msg:'发布考试',
                dis:false,
                select_subject:'',
                courseTable:[],
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    // date2: '',
                    // delivery: true,
                    // type: ['步步高'],
                    // resource: '小天才',
                    desc: '',
                    city:'',
                    // options: []
                }
            }
        },
        methods: {
            goBack(){
                this.$router.push('table');
            },
            judge(){
                let url=window.location.href;
                let wid=url.split('?');
                let arr=[];
                if(wid.length>1){
                    arr=wid[1].split('=');
                }else{
                    this.addExam();
                    return;
                }
                if(arr[0]==='exam_id'){
                    this.updateExam();
                }else{
                    this.addExam();
                }
            },
            updateExam(){
                let url=window.location.href;
                let wid=url.split('?');
                let arr=[];
                if(wid.length>1){
                    arr=wid[1].split('=');
                }
                let api=this.$api.userApi.updateExam;
                api.data={
                    EXAM_ID: arr[1],
                    EXAM_DATE: this.form.date1,
                    EXAM_NAME: this.form.name
                };
                this.axios(api).then(response=>{
                    // console.log(response);
                    if(response.data.code===0){
                        this.$notify({
                            title: '成功',
                            message: '修改考试信息成功',
                            type: 'success'
                        });
                        this.$router.push('/exam-info');
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '修改考试信息失败'
                        });
                    }
                })
            },
            addExam(){
                let api=this.$api.userApi.addExam;
                let url=window.location.href;
                let arr=url.split('=');
                if(arr.length>1){
                    this.select_subject=arr[1];
                }
                api.data={
                    EXAM_NAME:this.form.name,
                    EXAM_DATE:this.form.date1,
                    COURSE_ID:this.select_subject
                };
                this.axios(api).then(response=>{
                    // console.log(response);
                    if(response.data.code===0){
                        this.$notify({
                            title: '成功',
                            message: '发布考试成功',
                            type: 'success'
                        });
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '发布考试失败'
                        });
                    }
                })
            },
            onSubmit() {
                this.$message.success('提交成功！');
            }
        }
    }
</script>
