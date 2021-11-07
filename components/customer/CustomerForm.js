import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Divider, Space, message, Spin } from 'antd';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomers, setDetailCustomer, setDetailLoadingBar, setDetailModalVisible } from '../../reducers/customerStore';

const { Option } = Select;


const layout = {
	labelCol: {
	  span: 8,
	},
	wrapperCol: {
	  span: 16,
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
	const detailCustomer = useSelector(state => state.customerStore.detailCustomer);				//상세고객정보
	const customers = useSelector(state => state.customerStore.customers);							//고객목록
	const isDetailLoadingBar = useSelector(state => state.customerStore.isDetailLoadingBar);		//상세정보 로딩바


	const [form] = Form.useForm();
	
	const onFinish = (customer) => {
		// alert(JSON.stringify(customer));

		axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;
        axios.defaults.headers.get['Content-Type'] = 'application/json;charset=utf-8';
        axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';

		//로딩바
		dispatch(setDetailLoadingBar(true));

		if (!detailCustomer.id) {
			//고객정보 생성
			axios.post(`${process.env.NEXT_PUBLIC_API_URL}/customer/api/customer`
				, customer)
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('고객정보가 생성되었습니다.');

				//목록에 추가하기
				dispatch(setCustomers([...customers, {...response.data}]));

				//팝업창 닫기
				dispatch(setDetailModalVisible(false));

			})
			.catch((error) => {
				alert('에러발생 : CustomerForm.js');
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));
				console.log(error);
			});
		} else {
			//고객정보 수정
			axios.put(`${process.env.NEXT_PUBLIC_API_URL}/customer/api/customer/${detailCustomer.id}`
				, customer)
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('고객정보가 수정되었습니다.');

				//목록 갱신하기
				dispatch(setCustomers(
					customers.map(customer => {
						return customer.id === detailCustomer.id ? {...response.data} : customer
					})
				));

				//상세정보 갱신
				dispatch(setDetailCustomer({...response.data}));

			})
			.catch((error) => {
				alert('에러발생 : CustomerForm.js');
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));
				console.log(error);
			});

		}

	};


	/**
	 * 취소Alert창의 confirm 버튼
	 */
	const handleConfirmCancel = () => {
		dispatch(setDetailModalVisible(false));
	};


	return (
		<Modal 
			form={form}
			title="고객정보"
			visible={isDetailModalVisible} 
			footer={null}
			onCancel={handleConfirmCancel}
			destroyOnClose={true}	//이 옵션이 있어야 모달이 닫힐 때 객체들이 destory되는듯
		>
			<Spin tip="Loading..." spinning={isDetailLoadingBar}>
			<Form 
				name="complex-form"
				onFinish={onFinish} 
				{...layout}
				validateMessages={validateMessages}
				fields={[
					{
						name: 'id',
						value: detailCustomer.id,
					},
					{
						name: 'name',
						value: detailCustomer.name,
				 	},
					{
						name: 'businessNumber',
						value: detailCustomer.businessNumber,
				 	},
					{
						name: 'representativeName',
						value: detailCustomer.representativeName,
				 	},
					{
						name: 'businessConditions',
						value: detailCustomer.businessConditions,
				 	},
					{
						name: 'typeOfBusiness',
						value: detailCustomer.typeOfBusiness,
				 	},
					{
						name: 'address',
						value: detailCustomer.address,
				 	},
					{
						name: 'phoneNumber',
						value: detailCustomer.phoneNumber,
				 	},
					{
						name: 'faxNumber',
						value: detailCustomer.faxNumber,
				 	},
					{
						name: 'useYn',
						value: detailCustomer.use ? 'Y' : (!detailCustomer.use ? 'N' : null),
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
					rules={[{
						required: true,
					}]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="typeOfBusiness"
					label="업종"
					rules={[{
						required: true,
					}]}
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
					rules={[{
						required: true,
					}]}
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
						{/* <Popconfirm
							title="등록을 취소하시겠습니까?"
							onConfirm={handleConfirmCancel}
							okText="Yes"
							cancelText="No"
						> */}
							<Button onClick={handleConfirmCancel}>
								Cancel
							</Button>
						{/* </Popconfirm> */}
						<Button type="primary" htmlType="submit">
							Submit
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