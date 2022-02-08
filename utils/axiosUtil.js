import axios from 'axios';


const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    timeout: 3000,
});


instance.interceptors.request.use(
    function (config) {
        // 요청 바로 직전
        // axios 설정값에 대해 작성합니다.

        const loginAdminToken = sessionStorage.getItem("loginAdmin");

        config.headers['Content-Type'] = 'application/json;charset=utf-8';
        // config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers.common["Authorization"] = `Bearer ${loginAdminToken}`;        

        return config;
    }, 
    function (error) {
        // 요청 에러 처리를 작성합니다.
        return Promise.reject(error);
    }
);

/*
    2. 응답 인터셉터를 작성합니다.
    2개의 콜백 함수를 받습니다.

    1) 응답 정성 - 인자값: http response
    2) 응답 에러 - 인자값: http error
*/
instance.interceptors.response.use(
    function (response) {
    /*
        http status가 200인 경우
        응답 바로 직전에 대해 작성합니다. 
        .then() 으로 이어집니다.
    */
        return response;
    },

    function (error) {
    /*
        http status가 200이 아닌 경우
        응답 에러 처리를 작성합니다.
        .catch() 으로 이어집니다.    
    */
        if (error.response.status === 401) {
            window.location = '/';
        }
        return Promise.reject(error);

    }
);


export default instance;
