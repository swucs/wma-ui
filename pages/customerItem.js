import React, { useState } from 'react';
import {message, Space, Typography} from "antd";
import AppLayout from "../components/AppLayout";
import CustomerItemSearchBox from "../components/customerItem/CustomerItemSearchBox";
import CustomerItemList from "../components/customerItem/CustomerItemList";
import { useEffect } from 'react';
import axiosUtil from "../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import CustomerItemForm from '../components/customerItem/CustomerItemForm';
import { setCustomerItems, setListLoadingBar } from '../reducers/customerItemStore';
import withHOCCheckAuth from '../hoc/withHOCCheckAuth';
import {RightSquareOutlined} from "@ant-design/icons";

const customerItem = () => {

	const { Title } = Typography;

	const dispatch = useDispatch();

	//Redux State로 부터 검색어 모니터링
	const searchWord = useSelector(state => state.customerItemStore.searchWord);
	

	useEffect(() => {

		if (!searchWord.customerId) {
			return;
		}

		//로딩바 출력
		dispatch(setListLoadingBar(true));

        console.log('searchWord', searchWord);

		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/customerItems`,
			method : 'get',
			params : {
				// page : 0,
				// pageSize : 1000,
				customerId : searchWord.customerId
			}
		})
		.then((response) => {
			console.log('data' + JSON.stringify(response));
			
			if (response.data._embedded) {
				dispatch(setCustomerItems(response.data._embedded.customerItemDtoList));
			} else {
				dispatch(setCustomerItems([]));
			}

			//로딩바 감추기
			dispatch(setListLoadingBar(false));
		})
		.catch((error) => {
			message.error('에러발생');
			console.log(error);
		});

    }, [ searchWord ]);

    
      
    return (
        <AppLayout>
			<Title level={4}><RightSquareOutlined /> 거래처별 품목</Title>
			<Space direction="vertical" style={{width :'100%'}}>
                <CustomerItemSearchBox />
                <CustomerItemList />
				<CustomerItemForm />
            </Space>
			
        </AppLayout>
      );
}

export default withHOCCheckAuth(customerItem);