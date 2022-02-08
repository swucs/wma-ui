import React, { useState } from 'react';
import {message, Space} from "antd";
import AppLayout from "../components/AppLayout";
import CustomerItemTermSearchBox from "../components/statistics/CustomerItemTermSearchBox";
import CustomerItemTermList from "../components/statistics/CustomerItemTermList";
import { useEffect } from 'react';
import axiosUtil from "../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerItemTerms, setListLoadingBar } from '../reducers/customerItemTermStore';
import withHOCCheckAuth from '../hoc/withHOCCheckAuth';
import moment from 'moment';
import { DATE_FORMAT_YYYYMMDD } from  "../utils/formatUtil";

const customerItemTerm = () => {

	const dispatch = useDispatch();

	//Redux State로 부터 검색어 모니터링
	const searchWord = useSelector(state => state.customerItemTermStore.searchWord);
	

	useEffect(() => {

		if (!searchWord.customerId) {
			return;
		}

		//로딩바 출력
		dispatch(setListLoadingBar(true));

        console.log('searchWord', searchWord);

		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/customerItemTermStatistics`,
			method : 'get',
			params : {
				// page : 0,
				// pageSize : 1000,
				baseDateFrom : searchWord.baseDateFrom.format(DATE_FORMAT_YYYYMMDD),
				baseDateTo : searchWord.baseDateTo.format(DATE_FORMAT_YYYYMMDD),
				customerId : searchWord.customerId,
			}
		})
		.then((response) => {
			console.log('data' + JSON.stringify(response));
			
			if (response.data._embedded) {
				dispatch(setCustomerItemTerms(response.data._embedded.customerItemTermDtoList));				
			} else {
				dispatch(setCustomerItemTerms([]));
			}

			//로딩바 감추기
			dispatch(setListLoadingBar(false));
		})
		.catch((error) => {
			message.error('에러발생 : customerItemTerm.js');
			console.log(error);
		});

    }, [ searchWord ]);

    
      
    return (
        <AppLayout>
            <Space direction="vertical" style={{width :'100%'}}>
                <CustomerItemTermSearchBox />
                <CustomerItemTermList />
            </Space>
			
        </AppLayout>
      );
}

export default withHOCCheckAuth(customerItemTerm);