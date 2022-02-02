import React from 'react';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWarehousingItem, setDetailModalVisible } from '../../reducers/warehousingStore';

const WarehousingList = () => {

	const [newData, setNewData] = useState([]);
	const [scrollY, setScrollY] = useState([]);

	const dispatch = useDispatch();

	//Redux State로 부터 거래처목록 모니터링
	const warehousings = useSelector((state) => state.warehousingStore.warehousings);
	const isListLoadingBar = useSelector((state) => state.warehousingStore.isListLoadingBar);

	/**
	 * 그리드의 높이를 지정
	 */
	const handleResize = () => {
		console.log("handleResize: " + window.innerHeight);
		setScrollY(window.innerHeight - 158);
		// ant-space-item
	}

	/**
	 * 업체명 클릭
	 */
	const handlerClickName = (warehousing) => {
		console.log('warehousing', warehousing);
		//상세정보 세팅
		dispatch(setWarehousingItem(warehousing));
		//상세팝업창 띄우기
		dispatch(setDetailModalVisible(true));
	}

	useEffect(() => {
		if (!warehousings) {
			return;
		}

        setNewData(warehousings.map((v) => {
            return {
                ...v,
                key: v.id,
            };
        }));

        console.log('newData', newData);

    }, [warehousings]);

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
            title: '기준일자',
            dataIndex: 'baseDate',
            key: 'baseDate',
			align: 'center',
            width: 150,
        },
        {
			title: '거래처명',
			dataIndex: 'customerName',
			key: 'customerName',
			align: 'left',
			render: (text, row) => <a onClick={() => { handlerClickName(row) }}>{text}</a>,
        },
		{
            title: '입고인',
            dataIndex: 'name',
            key: 'name',
			align: 'center',
			width: 150,
        },
        {
			title: '입출고구분',
			dataIndex: 'warehousingTypeName',
			key: 'warehousingTypeName',
			align: 'center',
			width: 120,
        },
        {
            title: '동결입고',
            dataIndex: 'quickFrozenYn',
            key: 'quickFrozenYn',
            align: 'center',
			width: 120,
        },
    ];
      
    return (
		<div style={{height: scrollY + 65,}}>
			<Table 
				columns={columns}
				dataSource={newData}
				loading={isListLoadingBar}
				scroll={{ x: 740, y: scrollY}} 
				pagination={false /*{position: ['none', 'bottomCenter']}*/}
			/>
		</div>
    );
};

export default WarehousingList;