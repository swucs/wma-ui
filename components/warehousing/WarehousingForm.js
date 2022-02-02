import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Divider, Space, message, Spin, Popconfirm, InputNumber } from 'antd';
import axiosUtil from "../../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import { setWarehousings, setWarehousingItem, setWarehousingDetails, setDetailLoadingBar, setDetailModalVisible } from '../../reducers/warehousingStore';
import WarehousingDetailList from "./WarehousingDetailList";
import moment from 'moment';
import { DATE_FORMAT_YYYYMMDD } from  "../../utils/formatUtil";


const { Option } = Select;


const layout = {
	labelCol: {
	  span: 4,
	},
};

  /* eslint-disable no-template-curly-in-string */
  
const validateMessages = {
	required: '${label}을(를) 입력하세요.'
};
  /* eslint-enable no-template-curly-in-string */

const WarehousingForm = () => {


	const dispatch = useDispatch();
	const isDetailModalVisible = useSelector(state => state.warehousingStore.isDetailModalVisible);	//상세팝업출력여부
	const warehousings = useSelector(state => state.warehousingStore.warehousings);							//입출고목록
	const warehousingItem = useSelector(state => state.warehousingStore.warehousingItem);				//상세입출고정보
	const warehousingDetails = useSelector(state => state.warehousingStore.warehousingDetails);				//입출고내역목록
	const isDetailLoadingBar = useSelector(state => state.warehousingStore.isDetailLoadingBar);		//상세정보 로딩바

	//기준일자, 거래처 등 편집가능여부
	const isEditable = warehousingItem.id ? false : true;

	//거래처목록
	const [customerCodes, setCustomerCodes] = useState([]);

	const [form] = Form.useForm();

	/**
	 * 코드정보(Selectbox용)
	 */
	useEffect(() => {

		//거래처목록
		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/customer/validCodes`,
			method : 'get',
		})
		.then((response) => {
			if (response.data) {
				setCustomerCodes(response.data);
			} else {
				setCustomerCodes([]);
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}, []);

	/**
	 * 입출고 상세내역 목록
	 */
	useEffect(() => {
		if (warehousingItem.id) {
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/warehousing/${warehousingItem.id}/details`,
				method : 'get',
			})
			.then((response) => {
				console.log('data' + JSON.stringify(response.data));
				if (response.data._embedded) {
					dispatch(setWarehousingDetails(response.data._embedded.warehousingDetailDtoList));
				} else {
					dispatch(setWarehousingDetails([]));
				}
			})
			.catch((error) => {
				console.log(error);
			});
		} else {
			dispatch(setWarehousingDetails([]));
		}
	}, [warehousingItem]);
	
	/**
	 * 저장
	 * @param {*} warehousing 
	 */
	const onFinish = (warehousing) => {
		//사용자가 상세정보를 state에 저장
		dispatch(setWarehousingItem({...warehousing}));

		// //로딩바
		dispatch(setDetailLoadingBar(true));

		if (!warehousingItem.id) {

			//입출고정보 생성
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/warehousing`,
				method : 'post',
				data : warehousing
			})
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('입출고정보가 생성되었습니다.');

				//목록에 추가하기
				dispatch(setWarehousings([...warehousings, {...response.data}]));

				//팝업창 닫기
				dispatch(setDetailModalVisible(false));

			})
			.catch((error) => {
				if (error.response?.data?.errors != null) {
					displayErrorMessage(error.response.data.errors);
				} else {
					alert('에러발생 : WarehousingForm.js');
				}
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));
				console.log(error);
			});
		} else {
			//입출고정보 수정
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/warehousing/${warehousingItem.id}`,
				method : 'put',
				data : { 
					...warehousing
					, baseDate: warehousing.baseDate.format(DATE_FORMAT_YYYYMMDD)
					, warehousingDetails : [
						...warehousingDetails
					]
				}
			})
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('입출고정보가 수정되었습니다.');

				//목록 갱신하기
				dispatch(setWarehousings(
					warehousings.map(warehousing => {
						return warehousing.id === warehousingItem.id ? {...response.data, key: warehousingItem.id} : warehousing
					})
				));

				//상세정보 갱신
				// dispatch(setWarehousingItem({...response.data}));

			})
			.catch((error) => {
				if (error.response?.data?.errors != null) {
					displayErrorMessage(error.response.data.errors);
				} else {
					alert('에러발생 : WarehousingForm.js');
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
		
		//입출고정보 삭제
		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/warehousing/${warehousingItem.id}`,
			method : 'delete',
		})
		.then((response) => {
			console.log(response.data);
			
			//로딩바 감추기
			dispatch(setDetailLoadingBar(false));

			message.success('입출고정보가 삭제되었습니다.');

			//목록 갱신하기
			dispatch(setWarehousings(
				warehousings.filter(warehousing => warehousing.id != warehousingItem.id)
			));

			//팝업창 닫기
			dispatch(setDetailModalVisible(false));

		})
		.catch((error) => {
			alert('에러발생 : WarehousingForm.js');
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
			title="입출고"
			visible={isDetailModalVisible} 
			footer={null}
			onCancel={handleConfirmCancel}
			destroyOnClose={true}	//이 옵션이 있어야 모달이 닫힐 때 객체들이 destory되는듯
		>
			<Spin tip="Loading..." spinning={isDetailLoadingBar}>
			<Form 
				form={form}
				name="warehousing-form"
				onFinish={onFinish} 
				{...layout}
				validateMessages={validateMessages}
				fields={[
					{
						name: 'id',
						value: warehousingItem.id,
					},
					{
						name: 'baseDate',
						value: moment(warehousingItem.baseDate, DATE_FORMAT_YYYYMMDD),
				 	},
					{
						name: 'customerId',
						value: warehousingItem.customerId,
				 	},
					{
						name: 'militarySupplyYn',
						value: warehousingItem.militarySupplyYn,
				 	},
					{
						name: 'name',
						value: warehousingItem.name,
				 	},
					{
						name: 'warehousingTypeValue',
						value: warehousingItem.warehousingTypeValue,
				 	},
					{
						name: 'quickFrozenYn',
						value: warehousingItem.quickFrozenYn,
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
					name="baseDate"
					label="기준일자"
					rules={[{
						required: true,
					}]}
				>
					<DatePicker disabled={true}
					/>
				</Form.Item>

				<Form.Item
					name="customerId"
					label="거래처"
					rules={[{
						required: true,
					}]}
				>
					<Select disabled={true}>
						{customerCodes.map(code => (
							<Option key={code.id} value={code.id}>{code.name}</Option>
						))}
					</Select>
				</Form.Item>

				{
				//신규인 경우만 삭제버튼 노출
				!warehousingItem.id &&
				<Form.Item
					name="militarySupplyYn"
					label="군납여부"
					rules={[{
						required: true,
					}]}
				>
					<Select>
						<Option value="N">N</Option>
						<Option value="Y">Y</Option>
					</Select>
				</Form.Item>
				}

				<Form.Item
					name="name"
					label="입고인"
					rules={[{
						required: true,
					}]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					name="warehousingTypeValue"
					label="입출고"
					rules={[{
						required: true,
					}]}
				>
					<Select>
						<Option value="INCOMING">입고</Option>
						<Option value="OUTGOING">출고</Option>
					</Select>
				</Form.Item>

				<Form.Item
					name="quickFrozenYn"
					label="동결입고"
					rules={[{
						required: true,
					}]}
				>
					<Select>
						<Option value="N">비동결</Option>
						<Option value="Y">동결</Option>
					</Select>
				</Form.Item>				
			

				{/* 입출고 내역 */}
				<WarehousingDetailList />
				{/* 입출고 내역 */}

				<div style={{textAlign : 'right'}}>
					<Space>
						<Button onClick={handleConfirmCancel}>
							취소
						</Button>
						<Button type="primary" htmlType="submit">
							저장
						</Button>
					</Space>
				</div>

				</Form>
			</Spin>
		</Modal>
		

	);
}

export default WarehousingForm;