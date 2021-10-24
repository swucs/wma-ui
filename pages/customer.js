import React, { useState } from 'react';
import { Space } from "antd";
import AppLayout from "../components/AppLayout";
import CustomerSearchBox from "../components/CustomerSearchBox";
import CustomerList from "../components/CustomerList";
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const customer = () => {

	const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

	//Redux State로 부터 검색어 모니터링
	const searchWord = useSelector(state => state.searchWord);

	useEffect(() => {
		//로딩바 출력
		// setLoading(true);

        // console.log('searchWord', searchWord);

        axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;
        axios.defaults.headers.get['Content-Type'] = 'application/json;charset=utf-8';
        axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';

		axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customer/api/customers?page=0&pageSize=100`)
		.then((response) => {
			console.log(response.data.content);
			
			setData(response.data.content);

			//로딩바 감추기
			// setLoading(false);
		})
		.catch((error) => {
			alert('에러발생 : screener.js');
			console.log(error);
		});
    }, [ searchWord ]);

    
      
    return (
        <AppLayout>
            <Space direction="vertical" style={{width :'100%'}}>
                <CustomerSearchBox></CustomerSearchBox>
                <CustomerList data={data}></CustomerList>
            </Space>
        </AppLayout>
      );
}

export default customer;