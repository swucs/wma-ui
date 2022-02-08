import React, { useState } from 'react';
import {message, Space} from "antd";
import AppLayout from "../components/AppLayout";
import StorageFeeSearchBox from "../components/storageFee/StorageFeeSearchBox";
import StorageFeeList from "../components/storageFee/StorageFeeList";
import { useEffect } from 'react';
import axiosUtil from "../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import StorageFeeForm from '../components/storageFee/StorageFeeForm';
import { setStorageFees, setListLoadingBar } from '../reducers/storageFeeStore';
import withHOCCheckAuth from '../hoc/withHOCCheckAuth';

const storageFee = () => {

	const dispatch = useDispatch();

	//Redux State로 부터 검색어 모니터링
	const searchWord = useSelector(state => state.storageFeeStore.searchWord);
	

	useEffect(() => {
		//로딩바 출력
		dispatch(setListLoadingBar(true));

        console.log('searchWord', searchWord);

		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/storageFees`,
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
				dispatch(setStorageFees(response.data._embedded.storageFeeDtoList));
			} else {
				dispatch(setStorageFees([]));
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
            <Space direction="vertical" style={{width :'100%'}}>
                <StorageFeeSearchBox />
                <StorageFeeList />
				<StorageFeeForm />
            </Space>
			
        </AppLayout>
      );
}

export default withHOCCheckAuth(storageFee);