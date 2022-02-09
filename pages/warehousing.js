import React, { useState } from 'react';
import { Space, message, Typography } from "antd";
import AppLayout from "../components/AppLayout";
import WarehousingSearchBox from "../components/warehousing/WarehousingSearchBox";
import WarehousingList from "../components/warehousing/WarehousingList";
import { useEffect } from 'react';
import axiosUtil from "../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import WarehousingForm from '../components/warehousing/WarehousingForm';
import { setWarehousings, setListLoadingBar } from '../reducers/warehousingStore';
import withHOCCheckAuth from '../hoc/withHOCCheckAuth';
import { DATE_FORMAT_YYYYMMDD } from  "../utils/formatUtil";
import { RightSquareOutlined } from "@ant-design/icons";

const warehousing = () => {

	const { Title } = Typography;

	const dispatch = useDispatch();

	//Redux State로 부터 검색어 모니터링
	const searchWord = useSelector(state => state.warehousingStore.searchWord);	

	useEffect(() => {
		//로딩바 출력
		dispatch(setListLoadingBar(true));
        console.log('searchWord', searchWord);
		

		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/warehousings`,
			method : 'get',
			params : {
				// page : 0,
				// pageSize : 1000,
				baseDateFrom : searchWord.baseDateFrom.format(DATE_FORMAT_YYYYMMDD),
				baseDateTo : searchWord.baseDateTo.format(DATE_FORMAT_YYYYMMDD),
				customerName: searchWord.customerName,
				itemName: searchWord.itemName,
				warehousingTypeValue: searchWord.warehousingTypeValue,
			}
		})
		.then((response) => {
			console.log('data' + JSON.stringify(response.data));
			
			if (response.data._embedded) {
				dispatch(setWarehousings(response.data._embedded.warehousingDtoList));
			} else {
				dispatch(setWarehousings([]));
			}

			//로딩바 감추기
			dispatch(setListLoadingBar(false));
		})
		.catch((error) => {
			message.error('에러발생 : warehousing.js');
			console.log(error);
		});

    }, [ searchWord ]);

    
      
    return (
        <AppLayout>
			<Title level={4}><RightSquareOutlined /> 입출고</Title>
			<Space direction="vertical" style={{width :'100%'}}>
                <WarehousingSearchBox />
                <WarehousingList />
				<WarehousingForm />
            </Space>
			
        </AppLayout>
      );
}

export default withHOCCheckAuth(warehousing);