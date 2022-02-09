import React from 'react';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStorageFeeItem, setDetailModalVisible } from '../../reducers/storageFeeStore';

const StorageFeeList = () => {

	const [newData, setNewData] = useState([]);
	const [scrollY, setScrollY] = useState([]);

	const dispatch = useDispatch();

	//Redux State로 부터 거래처목록 모니터링
	const storageFees = useSelector((state) => state.storageFeeStore.storageFees);
	const isListLoadingBar = useSelector((state) => state.storageFeeStore.isListLoadingBar);

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
	const handlerClickName = (storageFee) => {
		//상세정보 세팅
		dispatch(setStorageFeeItem(storageFee));
		//상세팝업창 띄우기
		dispatch(setDetailModalVisible(true));
	}

	useEffect(() => {
		if (!storageFees) {
			return;
		}

        setNewData(storageFees.map((v) => {
            return {
                ...v,
                key: v.id,
            };
        }));

        console.log('newData', newData);

    }, [storageFees]);

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
            width: 60,
			fixed: 'left',
        },
        {
			title: '보관료명',
			dataIndex: 'name',
			key: 'name',
			align: 'left',
			width: 140,
			fixed: 'left',
			render: (text, row) => <a onClick={() => { handlerClickName(row) }}>{text}</a>,
        },
		{
			title: '기준일자',
			dataIndex: 'baseDate',
			key: 'baseDate',
			align: 'center',
			width: 120,
		},
		{
            title: '보관료',
            dataIndex: 'storage',
            key: 'storage',
			align: 'right',
			width: 90,
        },
        {
          title: '상하차비',
          dataIndex: 'loading',
          key: 'loading',
          align: 'right',
		  width: 90,
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

export default StorageFeeList;