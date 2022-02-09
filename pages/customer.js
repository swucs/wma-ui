import React, { useState } from 'react';
import {message, Space, Typography} from "antd";
import AppLayout from "../components/AppLayout";
import CustomerSearchBox from "../components/customer/CustomerSearchBox";
import CustomerList from "../components/customer/CustomerList";
import { useEffect } from 'react';
import axiosUtil from "../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import CustomerForm from '../components/customer/CustomerForm';
import { setCustomers, setListLoadingBar } from '../reducers/customerStore';
import withHOCCheckAuth from '../hoc/withHOCCheckAuth';
import {RightSquareOutlined} from "@ant-design/icons";

const customer = () => {

	const { Title } = Typography;

	const dispatch = useDispatch();

	//Redux State로 부터 검색어 모니터링
	const searchWord = useSelector(state => state.customerStore.searchWord);
	

	useEffect(() => {
		//로딩바 출력
		dispatch(setListLoadingBar(true));

        console.log('searchWord', searchWord);

		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/customers`,
			method : 'get',
			params : {
				// page : 0,
				// pageSize : 1000,
				name : searchWord.name
			}
		})
		.then((response) => {
			console.log('data' + JSON.stringify(response));
			
			if (response.data._embedded) {
				dispatch(setCustomers(response.data._embedded.customerDtoList));				
			} else {
				dispatch(setCustomers([]));
			}

			//로딩바 감추기
			dispatch(setListLoadingBar(false));
		})
		.catch((error) => {
			message.error('에러발생 : customer.js');
			console.log(error);
		});

    }, [ searchWord ]);

    
      
    return (
        <AppLayout>
			<Title level={4}><RightSquareOutlined /> 거래처</Title>
            <Space direction="vertical" style={{width :'100%'}}>
				<CustomerSearchBox />
                <CustomerList />
				<CustomerForm />
            </Space>
			
        </AppLayout>
      );
}

export default withHOCCheckAuth(customer);