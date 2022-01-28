import AppLayout from "../components/AppLayout";
import {useCallback, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import axiosUtil from "../utils/axiosUtil";
import { Form, Input, Button, message } from 'antd';

const Index = () => {

    const router = useRouter();
    const [form] = Form.useForm();

    useEffect(() => {
    	try {
    		const loginAdmin = sessionStorage.getItem("loginAdmin");
    		if (loginAdmin) {
    			router.push('/customer');
    		}
    	} catch (error) {
    		//error 발생한 경우 정상로그인 아닌 것으로 간주
    		console.log(error);
    	}

    }, []);



    const onFinish = (loginForm) => {
      // alert(JSON.stringify(loginForm));

      //로그인
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
				method : 'post',
				data : {
          id: loginForm.id,
          password: loginForm.password
        }
			})
			.then((response) => {
				console.log(response.headers.authorization);
        console.log(response.headers.adminid);
        sessionStorage.setItem("loginAdmin", response.headers.authorization);

        //customer 페이지로 이동
			  router.push('/customer');
			})
			.catch((error) => {

        if (error.response?.data) {
          message.error(error.response.data);
        }
			
				console.log(error);
			});

    };
  
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return (
        
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
              }}>
                <Form
                  name="basic"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="ID"
                    name="id"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your ID!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    wrapperCol={{
                      offset: 8,
                      span: 16,
                    }}
                  >
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
            </div>
    )
};

export default Index;
