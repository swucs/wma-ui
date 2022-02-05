import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Divider, Space, message, Spin, DatePicker, InputNumber } from 'antd';
import axiosUtil from "../../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import { setStorageFees, setStorageFeeItem, setDetailLoadingBar, setDetailModalVisible } from '../../reducers/storageFeeStore';
import { DATE_FORMAT_YYYYMMDD } from  "../../utils/formatUtil";
import moment from 'moment';

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

const StorageFeeForm = () => {


	const dispatch = useDispatch();
	const isDetailModalVisible = useSelector(state => state.storageFeeStore.isDetailModalVisible);	//상세팝업출력여부
	const storageFeeItem = useSelector(state => state.storageFeeStore.storageFeeItem);				//상세보관료정보
	const storageFees = useSelector(state => state.storageFeeStore.storageFees);							//보관료목록
	const isDetailLoadingBar = useSelector(state => state.storageFeeStore.isDetailLoadingBar);		//상세정보 로딩바

	const [form] = Form.useForm();
	
	const onFinish = (formData) => {
		// alert(JSON.stringify(storageFee));
		//사용자가 상세정보를 state에 저장
		dispatch(setStorageFeeItem({...formData}));

		//로딩바
		dispatch(setDetailLoadingBar(true));

		if (!storageFeeItem.id) {

			//보관료정보 생성
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/storageFee`,
				method : 'post',
				data : { 
					...formData
					, baseDate: formData.baseDate.format(DATE_FORMAT_YYYYMMDD)
				}
			})
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('보관료정보가 생성되었습니다.');

				//목록에 추가하기
				dispatch(setStorageFees([...storageFees, {...response.data}]));

				//팝업창 닫기
				dispatch(setDetailModalVisible(false));

			})
			.catch((error) => {
				if (error.response?.data?.errors != null) {
					displayErrorMessage(error.response.data.errors);
				} else {
					alert('에러발생 : StorageFeeForm.js');
				}
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));
				console.log(error);
			});
		} else {
			//보관료정보 수정
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/storageFee/${storageFeeItem.id}`,
				method : 'put',
				data : { 
					...formData
					, baseDate: formData.baseDate.format(DATE_FORMAT_YYYYMMDD)
				}
			})
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('보관료정보가 수정되었습니다.');

				//목록 갱신하기
				dispatch(setStorageFees(
					storageFees.map(storageFee => {
						return storageFee.id === storageFeeItem.id ? {...response.data, key: storageFeeItem.id} : storageFee
					})
				));

				//상세정보 갱신
				// dispatch(setStorageFeeItem({...response.data}));

			})
			.catch((error) => {
				if (error.response?.data?.errors != null) {
					displayErrorMessage(error.response.data.errors);
				} else {
					alert('에러발생 : StorageFeeForm.js');
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
		
		//보관료정보 삭제
		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/storageFee/${storageFeeItem.id}`,
			method : 'delete',
		})
		.then((response) => {
			console.log(response.data);
			
			//로딩바 감추기
			dispatch(setDetailLoadingBar(false));

			message.success('보관료정보가 삭제되었습니다.');

			//목록 갱신하기
			dispatch(setStorageFees(
				storageFees.filter(storageFee => storageFee.id != storageFeeItem.id)
			));

			//팝업창 닫기
			dispatch(setDetailModalVisible(false));

		})
		.catch((error) => {
			alert('에러발생 : StorageFeeForm.js');
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
			title="보관료"
			visible={isDetailModalVisible} 
			footer={null}
			onCancel={handleConfirmCancel}
			destroyOnClose={true}	//이 옵션이 있어야 모달이 닫힐 때 객체들이 destory되는듯
		>
			<Spin tip="Loading..." spinning={isDetailLoadingBar}>
			<Form 
				form={form}
				name="storageFee-form"
				onFinish={onFinish} 
				{...layout}
				validateMessages={validateMessages}
				fields={[
					{
						name: 'id',
						value: storageFeeItem.id,
					},
					{
						name: 'baseDate',
						value: moment(storageFeeItem.baseDate, DATE_FORMAT_YYYYMMDD),
				 	},
					{
						name: 'name',
						value: storageFeeItem.name,
				 	},
					{
						name: 'storage',
						value: storageFeeItem.storage,
				 	},
					{
						name: 'loading',
						value: storageFeeItem.loading,
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
					<DatePicker />
				</Form.Item>

				<Form.Item
					name="name"
					label="보관료명"
					rules={[{
						required: true,
					}]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					name="storage"
					label="보관료"
					rules={[{
						required: true,
					}]}
				>
					<InputNumber
						style={{ width: '100%'}}
						controls={false}
						precision={2}
					/>
				</Form.Item>

				<Form.Item
					name="loading"
					label="상하차비"
					rules={[{
						required: true,
					}]}
				>
					<InputNumber
						style={{ width: '100%'}} 
						controls={false}
						// precision={2}
					/>
				</Form.Item>

				<Divider />

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

export default StorageFeeForm;