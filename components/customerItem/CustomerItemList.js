import React from 'react';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerItemItem, setDetailModalVisible } from '../../reducers/customerItemStore';

const CustomerItemList = () => {

	const [newData, setNewData] = useState([]);
	const [scrollY, setScrollY] = useState([]);

	const dispatch = useDispatch();

	//Redux State로 부터 거래처목록 모니터링
	const searchWord = useSelector(state => state.customerItemStore.searchWord);
	const customerItems = useSelector((state) => state.customerItemStore.customerItems);
	const isListLoadingBar = useSelector((state) => state.customerItemStore.isListLoadingBar);

	/**
	 * 그리드의 높이를 지정
	 */
	const handleResize = () => {
		console.log("handleResize: " + window.innerHeight);
		setScrollY(window.innerHeight - 205);
	}

	/**
	 * 업체명 클릭
	 */
	const handlerClickName = (customerItem) => {
		//상세정보 세팅
		dispatch(setCustomerItemItem({
			...customerItem
		}));
		//상세팝업창 띄우기
		dispatch(setDetailModalVisible(true));
	}

	useEffect(() => {
		if (!customerItems) {
			return;
		}

        setNewData(customerItems.map((v) => {
            return {
                ...v,
                key: v.id,
            };
        }));

        console.log('newData', newData);

    }, [customerItems]);

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
            title: '픔목ID',
            dataIndex: 'itemId',
            key: 'itemId',
			align: 'center',
            width: 80,
			fixed: 'left',
        },
        {
			title: '품목명',
			dataIndex: 'itemName',
			key: 'itemName',
			align: 'left',
			fixed: 'left',
			width: 120,
			render: (text, row) => <a onClick={() => { handlerClickName(row) }}>{text}</a>,
        },
		{
            title: '단위무게',
            dataIndex: 'itemUnitWeight',
            key: 'itemUnitWeight',
			align: 'right',
			width: 90,
        },
        {
			title: '단위명',
			dataIndex: 'itemUnitName',
			key: 'itemUnitName',
			align: 'center',
			width: 90,
        },
		{
			title: '보관료ID',
			dataIndex: 'storageFeeId',
			key: 'storageFeeId',
			align: 'center',
			width: 80,
		},
		{
			title: '보관료명',
			dataIndex: 'storageFeeName',
			key: 'storageFeeName',
			align: 'center',
			width: 150,
		},
    ];
      
    return (
		<div style={{height: scrollY}}>
			<Table 
				columns={columns}
				dataSource={newData}
				loading={isListLoadingBar}
				scroll={{y: scrollY}}
				pagination={false}
				
			/>
		</div>
    );
};

export default CustomerItemList;