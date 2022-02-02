import React from 'react';
import { Table, Button } from 'antd';
import { PlusOutlined, RightCircleTwoTone } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWarehousingDetailItem, setDetailItemModalVisible } from '../../reducers/warehousingStore';
import WarehousingDetailForm from './WarehousingDetailForm';
import { formatNumber } from  "../../utils/formatUtil";

const WarehousingDetailList = () => {
	const dispatch = useDispatch();

	//Redux State로 부터 거래처목록 모니터링
	const warehousingDetails = useSelector((state) => state.warehousingStore.warehousingDetails);

	//목록 클릭
	const handlerClickName = (warehousingDetailItem) => {
		console.log('warehousingDetailItem', warehousingDetailItem);
		//입출고내역 세팅
		dispatch(setWarehousingDetailItem(warehousingDetailItem));
		//입출고내역팝업창 띄우기
		dispatch(setDetailItemModalVisible(true));
	};

	//Add 클릭
	const handleClickAdd = () => {
		//비어있는 입출고내역 세팅
		dispatch(setWarehousingDetailItem({itemUnitWeight: 0, totalWeight: 0, count: 0, remainingWeight: 0}));

		//입출고내역팝업 띄우기
		dispatch(setDetailItemModalVisible(true));
	};

	const columns = [
		{
            title: '품목',
            dataIndex: 'itemName',
            key: 'itemName',
			align: 'center',
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
			width: 200,
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
			<div style={{display: 'flex'}}>
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
				dataSource={
					warehousingDetails.map((v) => {
						return {
							...v,
							key: v.id,
						};
					})
				}
				// loading={isListLoadingBar}
				scroll={{x: 850, y: 170}} 
				pagination={false}
			/>
		</>

    );
};

export default WarehousingDetailList;