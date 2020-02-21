const BASE_URL = 'http://114.115.153.14:8080/SRC';
const POST = 'post';

export default {
    login: {
        url: BASE_URL + '/user/login',
        method: 'post'
    },
    register: {
        url: BASE_URL + '/user/register',
        method: 'post'
    },
    changePassword: {
        url: BASE_URL + '/user/changePwd',
        method: POST
    },
    getGrade: {
        url: BASE_URL + '/grade/gradeData',
        method: 'post'
    },
    addExam: {
        url: BASE_URL + '/exam/addExam',
        method: 'post'
    },
    delExam:{
        url: BASE_URL + '/exam/deleteExam',
        method: POST
    },
    getExams: {
        url: BASE_URL + '/exam/courseExam',
        method: POST
    },
    getCourse: {
        url: BASE_URL + '/course/findCourseByTeacher',
        method: POST
    },
    findExam: {
        url: BASE_URL + '/exam/findExamByTeacher',
        method: POST
    },
    getGradeTable: {
        url: BASE_URL + '/grade/getGradeByExam',
        method: POST
    },
    postGrade: {
        url: BASE_URL + '/grade/updateGrade',
        method: POST
    },
    getGradeByExam: {
        url: BASE_URL + '/grade/findGradeByExam',
        method: POST
    },
    gradeSegmantation: {
        url: BASE_URL + '/grade/gradeSegmentation',
        method: POST
    },
    getExamInfo: {
        url: BASE_URL + '/exam/infoExam',
        method: POST
    },
    updateExam: {
        url: BASE_URL + '/exam/updateExam',
        method: POST
    },
    findExamByStudent: {
        url: BASE_URL + '/exam/findExamByStudent',
        method: POST
    },
    getCourseByStudent:{
        url:BASE_URL+'/course/findCourseByStudent',
        method:POST
    },
    setTarget:{
        url:BASE_URL+'/grade/updateTarget',
        method:POST
    },
    addStudent:{
        url:BASE_URL+'/student/addStudent',
        method:POST
    },
    addSchool:{
        url:BASE_URL+'/school/addSchool',
        method:POST
    },
    addTeacher:{
        url:BASE_URL+'/teacher/addTeacher',
        method:POST
    },
    listClass:{
        url:BASE_URL+'/class/listClass',
        method:POST
    },
    getStulist:{
        url:BASE_URL+'/student/findStudentByClass',
        method:POST
    },
    classinfo:{
        url:BASE_URL+'/class/findClassById',
        method:POST
    },
    listDepartment:{
        url:BASE_URL+'/department/listDepartment',
        method:POST
    },
    teacherclass:{
        url:BASE_URL + '/class/findClassByTeacher',
        method:POST
    },
    getGradeDetail:{
        url:BASE_URL + '/grade/findGradeById',
        method:POST
    },
    stuComment:{
        url:BASE_URL + '/grade/studentComment',
        method:POST
    },
    teaComment:{
        url:BASE_URL + '/grade/teacherComment',
        method:POST
    },
    getStuCourse:{
        url:BASE_URL + '/course/findCourseByStudent',
        method:POST
    },
    getStuGrade:{
        url:BASE_URL + '/grade/findGradeByStudentAndCourse',
        method:POST
    },
    examCount:{
        url:BASE_URL + '/exam/checkCount',
        method:POST
    },
    getCourseStu:{
        url:BASE_URL + '/student/findStudentByCourse',
        method:POST
    },
    addArticle:{
        url:BASE_URL + '/article/addArticle',
        method:POST
    },
    updateArticle:{
        url:BASE_URL + '/article/updateArticle',
        method:POST
    },
    delArticle:{
        url:BASE_URL + '/article/deleteArticle',
        method:POST
    },
    listArticle:{
        url:BASE_URL + '/article/listArticle',
        method:POST
    },
    getArticle:{
        url:BASE_URL + '/article/findArticleById',
        method:POST
    },
    getSchoolInfo:{
        url:BASE_URL+'/school/infoSchool',
        method:POST
    },
    teacherDepartment:{
        url:BASE_URL + '/teacher/findTeacherByDepartment',
        method:POST
    },
    listSchool:{
        url:BASE_URL + '/school/listSchool',
        method:POST
    },
    findClassBySchool:{
        url:BASE_URL + '/class/findClassBySchool',
        method:POST
    },
    getClassBySchool:{
        url:BASE_URL + '/class/getClassBySchool',
        method:POST
    },
    findDepartmentBySchool:{
        url:BASE_URL + '/department/findDepartmentBySchool',
        method:POST
    },
    addDepartment:{
        url:BASE_URL + '/department/addDepartment',
        method:POST
    },
    deleteDepartment:{
        url:BASE_URL + '/department/deleteDepartment',
        method:POST
    },
    deleteTeacher:{
        url:BASE_URL + '/teacher/deleteTeacher',
        method:POST
    },
    updateTeacherByDepartment:{
        url:BASE_URL + '/teacher/updateTeacherByDepartment',
        method:POST
    },
    addClass:{
        url:BASE_URL + '/class/addClass',
        method:POST
    },
    deleteClass:{
        url:BASE_URL + '/class/deleteClass',
        method:POST
    },
    updateClass:{
        url:BASE_URL + '/class/updateClassByTeacher',
        method:POST
    },
    deleteStudent:{
        url:BASE_URL + '/student/deleteStudent',
        method:POST
    },
    getComment:{
        url:BASE_URL + '/comment/findCommentByArticle',
        method:POST
    },
    addComment:{
        url:BASE_URL + '/comment/addComment',
        method:POST
    },
    editComment:{
        url:BASE_URL + '/comment/updateComment',
        method:POST
    },
    deleteComment:{
        url:BASE_URL + '/comment/deleteComment',
        method:POST
    },
    findCommentById:{
        url:BASE_URL + '/comment/findCommentById',
        method:POST
    },
    getSeat:{
        url:BASE_URL + '/grade/getSeatByExam',
        method:POST
    },
    inOrder:{
        url:BASE_URL + '/exam/seatInOrder',
        method:POST
    },
    reverseOrder:{
        url:BASE_URL + '/exam/seatInReverseOrder',
        method:POST
    },
    randomOrder:{
        url:BASE_URL + '/exam/seatInRandomOrder',
        method:POST
    },
    listSubject:{
        url:BASE_URL + '/subject/listSubject',
        method:POST
    },
    addSubject:{
        url:BASE_URL + '/subject/addSubject',
        method:POST
    },
    editSubject:{
        url:BASE_URL + '/subject/updateSubject',
        method:POST
    },
    delSubject:{
        url:BASE_URL + '/subject/deleteSubject',
        method:POST
    },
    getCourseBySubject:{
        url:BASE_URL + '/course/getCourseBySubject',
        method:POST
    },
    editCourse:{
        url:BASE_URL + '/course/updateCourse',
        method:POST
    },
    deleteCourse:{
        url:BASE_URL + '/course/deleteCourse',
        method:POST
    },
    addCourse:{
        url:BASE_URL + '/course/addCourse',
        method:POST
    }



}
