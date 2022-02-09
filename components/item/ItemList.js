import React from 'react';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setItem, setDetailModalVisible } from '../../reducers/itemStore';

const ItemList = () => {

	const [newData, setNewData] = useState([]);
	const [scrollY, setScrollY] = useState([]);

	const dispatch = useDispatch();

	//Redux State로 부터 거래처목록 모니터링
	const items = useSelector((state) => state.itemStore.items);
	const isListLoadingBar = useSelector((state) => state.itemStore.isListLoadingBar);

	/**
	 * 그리드의 높이를 지정
	 */
	const handleResize = () => {
		console.log("handleResize: " + window.innerHeight);
		setScrollY(window.innerHeight - 190);
	}

	/**
	 * 업체명 클릭
	 */
	const handlerClickName = (item) => {
		//상세정보 세팅
		dispatch(setItem(item));
		//상세팝업창 띄우기
		dispatch(setDetailModalVisible(true));
	}

	useEffect(() => {
		if (!items) {
			return;
		}

        setNewData(items.map((v) => {
            return {
                ...v,
                key: v.id,
            };
        }));

        console.log('newData', newData);

    }, [items]);

	useEffect(() => {
		//최초실행
		handleResize();
		//resize시 실행
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		}
		
	}, []);

    const columns = [
		{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
			align: 'center',
            width: 70,
			fixed: 'left',
        },
        {
			title: '품목명',
			dataIndex: 'name',
			key: 'name',
			align: 'left',
			width: 160,
			fixed: 'left',
			render: (text, row) => <a onClick={() => { handlerClickName(row) }}>{text}</a>,
        },
		{
            title: '단위무게',
            dataIndex: 'unitWeight',
            key: 'unitWeight',
			align: 'right',
			width: 100,
        },
        {
			title: '단위명',
			dataIndex: 'unitName',
			key: 'unitName',
			align: 'center',
			width: 100,
        },
        {
            title: '최초등록일자',
            dataIndex: 'registeredDate',
            key: 'registeredDate',
            align: 'center',
			width: 180,
        },
        {
            title: '비고',
            dataIndex: 'remarks',
            key: 'remarks',
			width: 200,
        },
    ];
      
    return (
		<div style={{height: scrollY}}>
			<Table 
				columns={columns}
				dataSource={newData}
				loading={isListLoadingBar}
				scroll={{ y: scrollY}}
				pagination={false /*{position: ['none', 'bottomCenter']}*/}
				
			/>
		</div>
    );
};

export default ItemList;