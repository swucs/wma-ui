import React from 'react';
import {Modal, Button, Form, Space, Table, Input, Divider} from 'antd';
import { useEffect, useState } from 'react';
import axiosUtil from "../../utils/axiosUtil";

const PopupItemSearchList = (props) => {

	const { Search } = Input;
	const [form] = Form.useForm();

	const [ selectedItemRows, setSelectedItemRows ] = useState([]);	//선택된 품목 Row정보
	const [ searchWord, setSearchWord ] = useState({});
	const [ searchList, setSearchList ] = useState([]);
	const [ isListLoadingBar, setListLoadingBar ] = useState(false);

	//Props
	const { height, isVisible, setVisible, setSelectedItem } = props;


	//취소버튼
	const handleConfirmCancel = () => {
		setVisible(false);
	};

	//검색처리
	const handleSearch = (value) => {
		setSearchWord({ name : value });
	};

	//확인버튼
	const handleSubmit = () => {
		if (selectedItemRows.length == 0) {
			alert("품목을 선택하세요.");
			return;
		}

		//props의 함수를 호출하여 부모창에게 전달
		setSelectedItem({
			itemId : selectedItemRows[0].id
			, itemName : selectedItemRows[0].name
		})

		//초기화
		setSelectedItemRows([]);

		//창닫기
		handleConfirmCancel();
	}

	// useEffect(() => {
	// 	console.log("isVisible : ", isVisible);
	// }, [ isVisible ])


	//검색 API
	useEffect(() => {
		//로딩바 출력
		setListLoadingBar(true);

		console.log('searchWord', searchWord);

		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/items`,
			method : 'get',
			params : {
				name : searchWord.name
			}
		})
			.then((response) => {
				console.log('data' + JSON.stringify(response));

				if (response.data._embedded) {
					setSearchList(response.data._embedded.itemDtoList);
				} else {
					setSearchList([]);
				}

				//로딩바 감추기
				setListLoadingBar(false);
			})
			.catch((error) => {
				alert('에러발생 : screener.js');
				console.log(error);
			});

	}, [ searchWord ]);


	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			align: 'center',
			width: 70,
		},
		{
			title: '품목명',
			dataIndex: 'name',
			key: 'name',
			align: 'left',
			//   width: 350,
		},
		{
			title: '단위무게',
			dataIndex: 'unitWeight',
			key: 'unitWeight',
			align: 'center',
			width: 90,
		},
		{
			title: '단위명',
			dataIndex: 'unitName',
			key: 'unitName',
			align: 'center',
			width: 100,
		},
		// {
		// 	title: '최초등록일자',
		// 	dataIndex: 'registeredDate',
		// 	key: 'registeredDate',
		// 	align: 'center',
		// 	width: 180,
		// },
		{
			title: '비고',
			dataIndex: 'remarks',
			key: 'remarks',
			width: 100,
		},
	];
      
    return (
		<Modal
			style={{ top: 70, height: height }}
			title="품목검색"
			visible={isVisible}
			footer={null}
			onCancel={handleConfirmCancel}
			destroyOnClose={true}	//이 옵션이 있어야 모달이 닫힐 때 객체들이 destory되는듯

		>
			<Form
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				onFinish={handleSubmit}
			>
				<Space>
					<Search
						type="text"
						placeholder="품목명"
						enterButton="Search"
						allowClear
						size="normal"
						//   suffix={suffix}
						onSearch={handleSearch}
					/>
				</Space>

				<div style={{height: height}}>
					<Table
						columns={columns}
						dataSource={
							searchList.map(e => {
								return {
									...e
									, key : e.id
								}
							})
						}
						size="small"
						rowSelection={{
							type: 'radio'
							, onChange: (selectedRowKeys, selectedRows) => {
								console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
								setSelectedItemRows(selectedRows);
							},
						}}
						loading={isListLoadingBar}
						scroll={{ y: height - 70}}
						pagination={false}
					/>
				</div>

				<div style={{textAlign : 'right'}}>
					<Space>
						<Button onClick={handleConfirmCancel}>
							취소
						</Button>
						<Button type="primary" htmlType="submit">
							확인
						</Button>
					</Space>
				</div>
			</Form>
		</Modal>
    );
};

export default PopupItemSearchList;