import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Select, Button, Divider, Space, message, Spin, Popconfirm} from 'antd';
import axiosUtil from "../../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import {
	setCustomerItems,
	setCustomerItemItem,
	setDetailLoadingBar,
	setDetailModalVisible,
	queryCustomerItems
} from '../../reducers/customerItemStore';
import PopupItemSearchList from "../common/PopupItemSearchList";

const { Option } = Select;
const { Search } = Input;


const layout = {
	labelCol: {
	  span: 5,
	},
	wrapperCol: {
	  span: 18,
	},
};

  /* eslint-disable no-template-curly-in-string */
  
  const validateMessages = {
	required: '${label}을(를) 입력하세요.'
  };
  /* eslint-enable no-template-curly-in-string */

const CustomerItemForm = () => {


	const dispatch = useDispatch();
	const isDetailModalVisible = useSelector(state => state.customerItemStore.isDetailModalVisible);	//상세팝업출력여부
	const customerItemItem = useSelector(state => state.customerItemStore.customerItemItem);			//상세거래처별 품목정보
	const customerItems = useSelector(state => state.customerItemStore.customerItems);					//거래처별 품목목록
	const isDetailLoadingBar = useSelector(state => state.customerItemStore.isDetailLoadingBar);		//상세정보 로딩바

	const [ isPopupItemSearchListVisible, setPopupItemSearchListVisible ] = useState(false);	//품목검색창
	const [ selectedItem, setSelectedItem ] = useState({});		//선택된 품목정보

	const [form] = Form.useForm();

	//보관료코드
	const [storageCodes, setStorageCodes] = useState([]);

	/**
	 * 코드정보(Selectbox용)
	 */
	useEffect(() => {

		//보관료코드
		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/storageFee/allCodes`,
			method : 'get',
		})
			.then((response) => {
				if (response.data) {
					setStorageCodes(response.data);
				} else {
					setStorageCodes([]);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);


	/**
	 * 품목검색창에서 품목을 선택한 경우
	 */
	useEffect(() => {
		dispatch(setCustomerItemItem({
			...customerItemItem
			, itemId : selectedItem.itemId
			, itemName : selectedItem.itemName
		}));
	}, [selectedItem])


	//품목검색버튼
	const handleSearchItemName = () => {
		setPopupItemSearchListVisible(true);
	};

	//저장처리
	const onFinish = (formData) => {
		// alert(JSON.stringify(formData));
		// return;

		//사용자가 상세정보를 state에 저장
		dispatch(setCustomerItemItem({...formData}));

		//로딩바
		dispatch(setDetailLoadingBar(true));

		if (!customerItemItem.id) {

			//거래처별 품목정보 생성
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/customerItem`,
				method : 'post',
				data : { 
					...formData
				}
			})
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('거래처별 품목정보가 생성되었습니다.');

				//목록 갱신하기
				dispatch(queryCustomerItems({ customerId : customerItemItem.customerId }));

				//팝업창 닫기
				dispatch(setDetailModalVisible(false));

			})
			.catch((error) => {
				if (error.response.status == 409) {
					message.error(error.response.data)
				} else if (error.response?.data?.errors != null) {
					displayErrorMessage(error.response.data.errors);
				} else {
					message.error('에러발생 : CustomerItemForm.js');
				}
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));
				console.log(error);
			});
		} else {
			//거래처별 품목정보 수정
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/customerItem/${customerItemItem.id}`,
				method : 'put',
				data : { 
					...formData
				}
			})
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('거래처별 품목정보가 수정되었습니다.');

				//목록 갱신하기
				dispatch(queryCustomerItems({ customerId : customerItemItem.customerId }));

				//상세정보 갱신
				// dispatch(setCustomerItemItem({...response.data}));

			})
			.catch((error) => {
				if (error.response.status == 409) {
					message.error(error.response.data)
				} else if (error.response?.data?.errors != null) {
					displayErrorMessage(error.response.data.errors);
				} else {
					message.error('에러발생 : CustomerItemForm.js');
				}
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));
				console.log(error);
			});

		}

	};
	
	/**
	 * 저장처리 에러발생시 반환된 에러메시지 출력
	 * @param errors 
	 */
	const displayErrorMessage = (errors) => {
		for (const err of errors) {
			console.log(err.field + " : " + err.defaultMessage);
			form.setFields([{
				name : err.field
				, errors : [err.defaultMessage]
			}]);
		}
	}


	/**
	 * 삭제버튼 클릭 후 Confirm 시
	 */
	const handleConfirmDelete = () => {
		
		//거래처별 품목정보 삭제
		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/customerItem/${customerItemItem.id}`,
			method : 'delete',
		})
		.then((response) => {
			console.log(response.data);
			
			//로딩바 감추기
			dispatch(setDetailLoadingBar(false));

			message.success('거래처별 품목정보가 삭제되었습니다.');

			//목록 갱신하기
			dispatch(setCustomerItems(
				customerItems.filter(customerItem => customerItem.id != customerItemItem.id)
			));

			//팝업창 닫기
			dispatch(setDetailModalVisible(false));

		})
		.catch((error) => {
			if (error.response.status === 422) {
				message.error(error.response.data);
			} else {
				message.error('에러발생 : CustomerItemForm.js');
			}
			//로딩바 감추기
			dispatch(setDetailLoadingBar(false));
			console.log(error);
		});

	}


	/**
	 * 취소Alert창의 confirm 버튼
	 */
	const handleConfirmCancel = () => {
		dispatch(setDetailModalVisible(false));
	};


	return (
		<>
			<Modal
				style={{ top: 10 }}
				title="거래처별 품목"
				visible={isDetailModalVisible}
				footer={null}
				onCancel={handleConfirmCancel}
				destroyOnClose={true}	//이 옵션이 있어야 모달이 닫힐 때 객체들이 destory되는듯
			>
				<Spin tip="Loading..." spinning={isDetailLoadingBar}>
				<Form
					form={form}
					name="customerItem-form"
					onFinish={onFinish}
					{...layout}
					validateMessages={validateMessages}
					fields={[
						{
							name: 'id',
							value: customerItemItem.id,
						},
						{
							name: 'customerId',
							value: customerItemItem.customerId,
						},
						{
							name: 'customerName',
							value: customerItemItem.customerName,
						},
						{
							name: 'itemId',
							value: customerItemItem.itemId,
						},
						{
							name: 'itemName',
							value: customerItemItem.itemName,
						},
						{
							name: 'storageFeeId',
							value: customerItemItem.storageFeeId,
						},
					]}
				>

					<Form.Item
						name="id"
						label="ID"
						hidden={true}
					>
						<Input type="hidden" />
					</Form.Item>

					<Form.Item
						name="customerId"
						label="거래처ID"
						hidden={true}
					>
						<Input type="hidden" />
					</Form.Item>

					<Form.Item
						name="customerName"
						label="거래처"
						rules={[{
							required: true,
						}]}
					>
						<Input readOnly={true} bordered={false} />
					</Form.Item>

					<Form.Item
						name="itemId"
						label="품목ID"
						hidden={true}
					>
						<Input type="hidden" />
					</Form.Item>

					<Form.Item
						name="itemName"
						label="품목"
						rules={[{
							required: true,
						}]}
					>
						{
							!customerItemItem.id ?
								<Search
									enterButton="Search"
									readOnly={true}
									onSearch={handleSearchItemName}
								/>
							:
								<Input
									readOnly={true}
									bordered={false}
								/>
						}

					</Form.Item>

					<Form.Item
						name="storageFeeId"
						label="보관료"
						rules={[{
							required: true,
						}]}
					>
						<Select>
							{storageCodes.map(code => (
								<Option key={code.id} value={code.id} data={code}>{code.name}</Option>
							))}
						</Select>
					</Form.Item>

					<Divider />

					<div style={{textAlign : 'right'}}>
						<Space>
							<Button onClick={handleConfirmCancel}>
								취소
							</Button>

							{
								//신규가 아닌 경우만 삭제버튼 노출
								customerItemItem.id &&
								<Popconfirm
									title="삭제하시겠습니까?"
									onConfirm={handleConfirmDelete}
									okText="Yes"
									cancelText="No"
								>
									<Button type="primary">
										삭제
									</Button>
								</Popconfirm>
							}

							<Button type="primary" htmlType="submit">
								저장
							</Button>
						</Space>
					</div>

				</Form>
				</Spin>
			</Modal>

			<PopupItemSearchList
				isVisible={isPopupItemSearchListVisible}
				setVisible={setPopupItemSearchListVisible}
				setSelectedItem={setSelectedItem}
				height={400}
			/>
		</>

	);
}

export default CustomerItemForm;