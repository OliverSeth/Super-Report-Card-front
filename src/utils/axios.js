import Axios from 'axios'
import Qs from 'qs'
import cookies from 'vue-cookies'
//
// // 配置Axios
let axiosInstance = Axios.create({
    // baseURL: 'http://localhost:8080',
    // 请求时携带Cookie
    withCredentials: true,
    transformRequest: [function (data) {
        data = Qs.stringify(data);
        return data
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
});
// // 全局请求拦截，自动为header添加token

// // axiosInstance.interceptors.request.use(
// //   config => {
// //     let token = cookies.get('token');
// //     // token存在，则添加至请求头
// //     if (token) {
// //       config.headers.token = token;
// //     }
// //     return config;
// //   }, err => {
// //     return Promise.reject(err);
// //   });
export default axiosInstance
