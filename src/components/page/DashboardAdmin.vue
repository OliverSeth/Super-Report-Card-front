<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <!--<el-row :gutter="20">-->
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
                <!--</el-row>-->
                <!--<el-row :gutter="20">-->
                    <!--<el-col :span="10">-->
                        <el-card shadow="hover" class="mgb20" style="height: 180px">
                            <div slot="header">
                                <span>学校信息</span>
                            </div>
                            <div>学校名：{{schoolInfo.school_NAME}}</div><br>
                            <div>学校地址：{{schoolInfo.school_COUNTRY+' '+schoolInfo.school_PROVINCE+' '+schoolInfo.school_CITY}}</div>
                        </el-card>
                    <!--</el-col>-->
                <!--</el-row>-->
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                </el-row>
                <el-card shadow="hover" style="height: 500px">
                    <div slot="header">
                        <span>部门信息</span>
                    </div>
                    <el-table :data="departmentTable" height="400" style="width: 100%;font-size:14px;">
                        <el-table-column label="部门号" width="300" prop="department_ID">
                        </el-table-column>
                        <el-table-column width="300" label="部门名" prop="department_NAME">
                        </el-table-column>
                        <el-table-column width="200" label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        name: "DashboardAdmin",
        data(){
            return{
                name: localStorage.getItem('userName'),
                role: '管理员',
                schoolInfo:{},
                departmentTable:[]
            }
        },
        mounted() {
            let api=this.$api.userApi.getSchoolInfo;
            api.data={
                USER_ID:localStorage.getItem('id')
            };
            this.axios(api).then(response=>{
                console.log(response);
                this.schoolInfo=response.data.data;
                localStorage.setItem('schoolid',this.schoolInfo.school_ID);
            });
            let api2 = this.$api.userApi.findDepartmentBySchool;
            let id = localStorage.getItem('schoolid');
            api2.data = {
                SCHOOL_ID: id
            };
//            console.log(id);

            this.axios(api2).then(response=>{
                // console.log(response);
                this.departmentTable=response.data.data;
//                console.log(this.departmentTable);
            })
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

