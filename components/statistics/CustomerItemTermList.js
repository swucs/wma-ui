import React from 'react';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerItemTermItem, setDetailModalVisible } from '../../reducers/customerItemTermStore';

const CustomerItemTermList = () => {

	const [newData, setNewData] = useState([]);
	const [scrollY, setScrollY] = useState([]);

	const dispatch = useDispatch();

	//Redux State로 부터 거래처품목별통계목록 모니터링
    const customerItemTerms = useSelector((state) => state.customerItemTermStore.customerItemTerms);
	const isListLoadingBar = useSelector((state) => state.customerItemTermStore.isListLoadingBar);

	/**
	 * 그리드의 높이를 지정
	 */
	const handleResize = () => {
		console.log("handleResize: " + window.innerHeight);
		setScrollY(window.innerHeight - 158);
	}

	useEffect(() => {
		if (!customerItemTerms) {
			return;
		}

        setNewData(customerItemTerms.map((v, index) => {
            return {
                ...v,
                key: index,
            };
        }));

        console.log('newData', newData);

    }, [customerItemTerms]);

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
            title: '품목명',
            dataIndex: 'itemName',
            key: 'itemName',
			align: 'left',
            fixed: 'left',
            width: 160
        },
        {
            title: '입고량',
            dataIndex: 'incomingQtyText',
            key: 'incomingQtyText',
            align: 'center',
            width: 140,
        },
		{
            title: '출고량',
            dataIndex: 'outgoingQtyText',
            key: 'outgoingQtyText',
			align: 'center',
            width: 140,
        },
        {
          title: '재고량',
          dataIndex: 'stockQtyText',
          key: 'stockQtyText',
          align: 'center',
          width: 170,
        },
        {
            title: '최근입출고일',
            dataIndex: 'recentBaseDate',
            key: 'recentBaseDate',
            align: 'center',
            width: 140,
        },
    ];
      
    return (
        <div style={{height: scrollY + 65}}>
            <Table
                columns={columns}
                dataSource={newData}
                loading={isListLoadingBar}
                scroll={{ y: scrollY }}
                pagination={false}
                
            />
        </div>
    );
};

export default CustomerItemTermList;