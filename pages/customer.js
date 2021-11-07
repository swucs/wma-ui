import React, { useState } from 'react';
import { Space } from "antd";
import AppLayout from "../components/AppLayout";
import CustomerSearchBox from "../components/customer/CustomerSearchBox";
import CustomerList from "../components/customer/CustomerList";
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import CustomerForm from '../components/customer/CustomerForm';
import { setCustomers, setListLoadingBar } from '../reducers/customerStore';

const customer = () => {

	const dispatch = useDispatch();

	//Redux State로 부터 검색어 모니터링
	const searchWord = useSelector(state => state.customerStore.searchWord);
	

	useEffect(() => {
		//로딩바 출력
		dispatch(setListLoadingBar(true));

        console.log('searchWord', searchWord);

        axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;
        axios.defaults.headers.get['Content-Type'] = 'application/json;charset=utf-8';
        axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';

		axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customer/api/customers`, 
			{
				params : {
					page : 0,
					pageSize : 1000,
					name : searchWord.name
				}
			}
		)
		.then((response) => {
			console.log('response.data : ' + response.data);
			
			dispatch(setCustomers(response.data._embedded.searchCustomerResponseList));

			//로딩바 감추기
			dispatch(setListLoadingBar(false));
		})
		.catch((error) => {
			alert('에러발생 : screener.js');
			console.log(error);
		});
    }, [ searchWord ]);

    
      
    return (
        <AppLayout>
            <Space direction="vertical" style={{width :'100%'}}>
                <CustomerSearchBox />
                <CustomerList />
				<CustomerForm />
            </Space>
			
        </AppLayout>
      );
}

export default customer;