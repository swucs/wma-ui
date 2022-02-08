import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Divider, Space, message, Spin, Popconfirm } from 'antd';
import axiosUtil from "../../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import { setCustomers, setCustomerItem, setDetailLoadingBar, setDetailModalVisible } from '../../reducers/customerStore';

const { Option } = Select;


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

const CustomerForm = () => {


	const dispatch = useDispatch();
	const isDetailModalVisible = useSelector(state => state.customerStore.isDetailModalVisible);	//상세팝업출력여부
	const customerItem = useSelector(state => state.customerStore.customerItem);				//상세거래처정보
	const customers = useSelector(state => state.customerStore.customers);							//거래처목록
	const isDetailLoadingBar = useSelector(state => state.customerStore.isDetailLoadingBar);		//상세정보 로딩바

	const [form] = Form.useForm();
	
	const onFinish = (customer) => {
		// alert(JSON.stringify(customer));
		//사용자가 상세정보를 state에 저장
		dispatch(setCustomerItem({...customer}));

		//로딩바
		dispatch(setDetailLoadingBar(true));

		if (!customerItem.id) {

			//거래처정보 생성
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/customer`,
				method : 'post',
				data : customer
			})
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('거래처정보가 생성되었습니다.');

				//목록에 추가하기
				dispatch(setCustomers([...customers, {...response.data}]));

				//팝업창 닫기
				dispatch(setDetailModalVisible(false));

			})
			.catch((error) => {
				if (error.response?.data?.errors != null) {
					displayErrorMessage(error.response.data.errors);
				} else {
					console.log('에러발생 : CustomerForm.js');
				}
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));
				console.log(error);
			});
		} else {
			//거래처정보 수정
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/customer/${customerItem.id}`,
				method : 'put',
				data : customer
			})
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('거래처정보가 수정되었습니다.');

				//목록 갱신하기
				dispatch(setCustomers(
					customers.map(customer => {
						return customer.id === customerItem.id ? {...response.data, key: customerItem.id} : customer
					})
				));

				//상세정보 갱신
				// dispatch(setCustomerItem({...response.data}));

			})
			.catch((error) => {
				if (error.response?.data?.errors != null) {
					displayErrorMessage(error.response.data.errors);
				} else {
					message.error('에러발생 : CustomerForm.js');
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
		
		//거래처정보 삭제
		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/customer/${customerItem.id}`,
			method : 'delete',
		})
		.then((response) => {
			console.log(response.data);
			
			//로딩바 감추기
			dispatch(setDetailLoadingBar(false));

			message.success('거래처정보가 삭제되었습니다.');

			//목록 갱신하기
			dispatch(setCustomers(
				customers.filter(customer => customer.id != customerItem.id)
			));

			//팝업창 닫기
			dispatch(setDetailModalVisible(false));

		})
		.catch((error) => {
			message.error('에러발생 : CustomerForm.js');
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
		<Modal 
			style={{ top: 10 }}
			title="거래처"
			visible={isDetailModalVisible} 
			footer={null}
			onCancel={handleConfirmCancel}
			destroyOnClose={true}	//이 옵션이 있어야 모달이 닫힐 때 객체들이 destory되는듯
		>
			<Spin tip="Loading..." spinning={isDetailLoadingBar}>
			<Form 
				form={form}
				name="customer-form"
				onFinish={onFinish} 
				{...layout}
				validateMessages={validateMessages}
				fields={[
					{
						name: 'id',
						value: customerItem.id,
					},
					{
						name: 'name',
						value: customerItem.name,
				 	},
					{
						name: 'businessNumber',
						value: customerItem.businessNumber,
				 	},
					{
						name: 'representativeName',
						value: customerItem.representativeName,
				 	},
					{
						name: 'businessConditions',
						value: customerItem.businessConditions,
				 	},
					{
						name: 'typeOfBusiness',
						value: customerItem.typeOfBusiness,
				 	},
					{
						name: 'address',
						value: customerItem.address,
				 	},
					{
						name: 'phoneNumber',
						value: customerItem.phoneNumber,
				 	},
					{
						name: 'faxNumber',
						value: customerItem.faxNumber,
				 	},
					{
						name: 'useYn',
						value: customerItem.useYn,
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
					name="name"
					label="업체명"
					rules={[{
							required: true,
					}]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="businessNumber"
					label="사업자등록번호"
					rules={[{
						required: true,
					}]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="representativeName"
					label="대표자명"
					rules={[{
						required: true,
					}]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="businessConditions"
					label="업태"
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="typeOfBusiness"
					label="업종"
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="address"
					label="주소"
					rules={[{
						required: true,
					}]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="phoneNumber"
					label="전화번호"
					rules={[{
						required: true,
					}]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="faxNumber"
					label="Fax번호"
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="useYn"
					label="사용여부"
					rules={[{
						required: true,
					}]}
				>
					<Select>
						<Option value="Y">사용</Option>
						<Option value="N">미사용</Option>
					</Select>
				</Form.Item>

				<Divider />
				{/* <Form.Item style={{textAlign : 'right'}} > */}
				<div style={{textAlign : 'right'}}>
					<Space>
						<Button onClick={handleConfirmCancel}>
							취소
						</Button>
						{
							//신규가 아닌 경우만 삭제버튼 노출
							customerItem.id &&
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
				{/* </Form.Item> */}
				
			</Form>
			</Spin>
		</Modal>
		

	);
}

export default CustomerForm;