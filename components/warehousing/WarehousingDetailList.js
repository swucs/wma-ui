import React from 'react';
import { Table, Button } from 'antd';
import { PlusOutlined, RightCircleTwoTone } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWarehousingDetails, setWarehousingDetailItem, setDetailItemModalVisible, setWarehousingItem } from '../../reducers/warehousingStore';
import WarehousingDetailForm from './WarehousingDetailForm';
import { formatNumber } from  "../../utils/formatUtil";

const WarehousingDetailList = (props) => {
	const dispatch = useDispatch();

	//Redux State 모니터링
	const warehousingItem = useSelector((state) => state.warehousingStore.warehousingItem);
	const warehousingDetails = useSelector((state) => state.warehousingStore.warehousingDetails);
	
	useEffect(() => {
		console.log(warehousingDetails)
	}, [warehousingDetails]);

	//목록 클릭
	const handlerClickName = (rowData) => {
		//입력된 입출고정보를 state에 갱신
		props.renewWarehousingItemByFormData();

		console.log('rowData', rowData);
		//입출고내역 세팅
		dispatch(setWarehousingDetailItem(rowData));
		//입출고내역팝업창 띄우기
		dispatch(setDetailItemModalVisible(true));
	};

	//Add 클릭
	const handleClickAdd = () => {
		//입력된 입출고정보를 state에 갱신
		props.renewWarehousingItemByFormData();

		//비어있는 입출고내역 세팅
		dispatch(setWarehousingDetailItem({itemUnitWeight: 0, totalWeight: 0, count: 0, remainingWeight: 0, calculationYn: 'Y'}));

		//입출고내역팝업 띄우기
		dispatch(setDetailItemModalVisible(true));
	};

	//입출고내역 삭제
	const handleRemoveDetail = (itemId) => {
		dispatch(setWarehousingDetails(
			warehousingDetails.filter(e => e.key !== itemId)
		));
	};

	const columns = [
		{
			title: '삭제',
			dataIndex: 'itemId',
			key: 'itemId',
			align: 'center',
			width: 70,
			render: (value, row, index) => (
				<Button key={`remove_{value}`} size="small" value={value} onClick={() => { handleRemoveDetail(value) }}>삭제</Button>
			),
        },
		{
            title: '품목',
            dataIndex: 'itemName',
            key: 'itemName',
			align: 'left',
            // width: 150,
			render: (text, row) => <a onClick={() => { handlerClickName(row) }}>{text}</a>,
        },
        {
			title: '단위중량',
			dataIndex: 'itemUnitWeight',
			key: 'itemUnitWeight',
			align: 'right',
			width: 90,
         },
		{
			title: '개수',
			dataIndex: 'count',
			key: 'count',
			align: 'right',
			width: 90,
			render: (text, row) => formatNumber(text)
        },
		{
			title: '잔량',
			dataIndex: 'remainingWeight',
			key: 'remainingWeight',
			align: 'right',
			width: 90,
			render: (text, row) => formatNumber(text)
        },
		{
            title: '총중량',
            dataIndex: 'totalWeight',
            key: 'totalWeight',
			align: 'right',
			width: 120,
			render: (text, row) => formatNumber(text)
        },
		{
            title: '비고',
            dataIndex: 'remarks',
            key: 'remarks',
			align: 'left',
			width: 150,
        },
        {
			title: '계산여부',
			dataIndex: 'calculationYn',
			key: 'calculationYn',
			align: 'center',
			width: 90,
        },
		
    ];
      
    return (
		<>
			<WarehousingDetailForm />
			<div style={{display: 'flex', paddingBottom: 5}}>
				<div style={{textAlign : 'left', width: '70%'}}>
					<RightCircleTwoTone twoToneColor="#dddddd" /> 입출고 내역
				</div>
				<div style={{textAlign : 'right', width: '30%'}}>
					<Button 
						icon={<PlusOutlined />}
						onClick={handleClickAdd}
					/>
				</div>
			</div>
			<Table 
				columns={columns}
				dataSource={warehousingDetails}
				// loading={isListLoadingBar}
				scroll={{x: 850, y: 170}} 
				pagination={false}
			/>
		</>

    );
};

export default WarehousingDetailList;