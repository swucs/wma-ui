import React, { useState } from 'react';
import {message, Space} from "antd";
import AppLayout from "../components/AppLayout";
import ItemSearchBox from "../components/item/ItemSearchBox";
import ItemList from "../components/item/ItemList";
import { useEffect } from 'react';
import axiosUtil from "../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import ItemForm from '../components/item/ItemForm';
import { setItems, setListLoadingBar } from '../reducers/itemStore';
import withHOCCheckAuth from '../hoc/withHOCCheckAuth';

const item = () => {

	const dispatch = useDispatch();

	//Redux State로 부터 검색어 모니터링
	const searchWord = useSelector(state => state.itemStore.searchWord);
	

	useEffect(() => {
		//로딩바 출력
		dispatch(setListLoadingBar(true));

        console.log('searchWord', searchWord);

		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/items`,
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
				dispatch(setItems(response.data._embedded.itemDtoList));
			} else {
				dispatch(setItems([]));
			}

			//로딩바 감추기
			dispatch(setListLoadingBar(false));
		})
		.catch((error) => {
			message.error('에러발생 : item.js');
			console.log(error);
		});

    }, [ searchWord ]);

    
      
    return (
        <AppLayout>
            <Space direction="vertical" style={{width :'100%'}}>
                <ItemSearchBox />
                <ItemList />
				<ItemForm />
            </Space>
			
        </AppLayout>
      );
}

export default withHOCCheckAuth(item);