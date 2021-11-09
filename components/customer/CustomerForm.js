import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Divider, Space, message, Spin, Popconfirm } from 'antd';
import axiosUtil from "../../utils/axiosUtil";
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
	const detailCustomer = useSelector(state => state.customerStore.detailCustomer);				//상세거래처정보
	const customers = useSelector(state => state.customerStore.customers);							//거래처목록
	const isDetailLoadingBar = useSelector(state => state.customerStore.isDetailLoadingBar);		//상세정보 로딩바


	const [form] = Form.useForm();
	
	const onFinish = (customer) => {
		// alert(JSON.stringify(customer));


		//로딩바
		dispatch(setDetailLoadingBar(true));

		if (!detailCustomer.id) {
			//거래처정보 생성
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/customer/api/customer`,
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
				alert('에러발생 : CustomerForm.js');
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));
				console.log(error);
			});
		} else {
			//거래처정보 수정
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/customer/api/customer/${detailCustomer.id}`,
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
	 * 삭제버튼 클릭 후 Confirm 시
	 */
	const handleConfirmDelete = () => {
		
		//거래처정보 삭제
		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/customer/api/customer/${detailCustomer.id}`,
			method : 'delete',
		})
		.then((response) => {
			console.log(response.data);
			
			//로딩바 감추기
			dispatch(setDetailLoadingBar(false));

			message.success('거래처정보가 삭제되었습니다.');

			//목록 갱신하기
			dispatch(setCustomers(
				customers.filter(customer => customer.id != detailCustomer.id)
			));

			//팝업창 닫기
			dispatch(setDetailModalVisible(false));

		})
		.catch((error) => {
			alert('에러발생 : CustomerForm.js');
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
			title="거래처정보"
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
							<Button onClick={handleConfirmCancel}>
								취소
							</Button>
						{
							//신규가 아닌 경우만 삭제버튼 노출
							detailCustomer.id &&
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