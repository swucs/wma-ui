import React from 'react';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerItem, setDetailModalVisible } from '../../reducers/customerStore';

const CustomerList = () => {

	const [newData, setNewData] = useState([]);
	const [scrollY, setScrollY] = useState([]);

	const dispatch = useDispatch();

	//Redux State로 부터 거래처목록 모니터링
	const customers = useSelector((state) => state.customerStore.customers);
	const isListLoadingBar = useSelector((state) => state.customerStore.isListLoadingBar);

	/**
	 * 그리드의 높이를 지정
	 */
	const handleResize = () => {
		console.log("handleResize: " + window.innerHeight);
		setScrollY(window.innerHeight - 158);
	}

	/**
	 * 업체명 클릭
	 */
	const handlerClickName = (customer) => {
		//상세정보 세팅
		dispatch(setCustomerItem(customer));
		//상세팝업창 띄우기
		dispatch(setDetailModalVisible(true));
	}

	useEffect(() => {
		if (!customers) {
			return;
		}

        setNewData(customers.map((v) => {
            return {
                ...v,
                key: v.id,
            };
        }));

        console.log('newData', newData);

    }, [customers]);

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
            title: '업체명',
            dataIndex: 'name',
            key: 'name',
            align: 'left',
            width: 170,
            render: (text, row) => <a onClick={() => { handlerClickName(row) }}>{text}</a>,
            fixed: 'left',
        },
		{
            title: '전화번호',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
			align: 'center',
            width: 150,
        },
        {
            title: '사업자번호',
            dataIndex: 'businessNumber',
            key: 'businessNumber',
            align: 'center',
            width: 140,
        },
        {
            title: '대표자명',
            dataIndex: 'representativeName',
            key: 'representativeName',
            align: 'center',
            width: 90,
        },
        {
            title: 'Fax',
            dataIndex: 'faxNumber',
            key: 'faxNumber',
			align: 'center',
            width: 150,
        },
        {
            title: '업태',
            key: 'businessConditions',
            dataIndex: 'businessConditions',
            width: 140,
        },
        {
            title: '업종',
            dataIndex: 'typeOfBusiness',
            key: 'typeOfBusiness',
            width: 250,
        },
        {
            title: '사용여부',
            dataIndex: 'useYn',
            key: 'useYn',
			align: 'center',
            width: 100,
			render: useYn => (
				<>
					{useYn == 'Y' ? "사용" : "미사용"}
				</>
			)
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

export default CustomerList;