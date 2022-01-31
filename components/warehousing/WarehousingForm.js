import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Divider, Space, message, Spin, Popconfirm, InputNumber } from 'antd';
import axiosUtil from "../../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import { setWarehousings, setDetailWarehousing, setDetailLoadingBar, setDetailModalVisible } from '../../reducers/warehousingStore';

const { Option } = Select;


const layout = {
	labelCol: {
	  span: 6,
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

const WarehousingForm = () => {


	const dispatch = useDispatch();
	const isDetailModalVisible = useSelector(state => state.warehousingStore.isDetailModalVisible);	//상세팝업출력여부
	const detailWarehousing = useSelector(state => state.warehousingStore.detailWarehousing);				//상세입출고정보
	const warehousings = useSelector(state => state.warehousingStore.warehousings);							//입출고목록
	const isDetailLoadingBar = useSelector(state => state.warehousingStore.isDetailLoadingBar);		//상세정보 로딩바

	const [form] = Form.useForm();
	
	const onFinish = (warehousing) => {

		// alert(JSON.stringify(warehousing));
		//사용자가 상세정보를 state에 저장
		dispatch(setDetailWarehousing({...warehousing}));

		//로딩바
		dispatch(setDetailLoadingBar(true));

		if (!detailWarehousing.id) {

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
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/warehousing/${detailWarehousing.id}`,
				method : 'put',
				data : warehousing
			})
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('입출고정보가 수정되었습니다.');

				//목록 갱신하기
				dispatch(setWarehousings(
					warehousings.map(warehousing => {
						return warehousing.id === detailWarehousing.id ? {...response.data} : warehousing
					})
				));

				//상세정보 갱신
				dispatch(setDetailWarehousing({...response.data}));

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
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/warehousing/${detailWarehousing.id}`,
			method : 'delete',
		})
		.then((response) => {
			console.log(response.data);
			
			//로딩바 감추기
			dispatch(setDetailLoadingBar(false));

			message.success('입출고정보가 삭제되었습니다.');

			//목록 갱신하기
			dispatch(setWarehousings(
				warehousings.filter(warehousing => warehousing.id != detailWarehousing.id)
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
			title="입출고정보"
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
						value: detailWarehousing.id,
					},
					{
						name: 'name',
						value: detailWarehousing.name,
				 	},
					{
						name: 'unitWeight',
						value: detailWarehousing.unitWeight,
				 	},
					{
						name: 'unitName',
						value: detailWarehousing.unitName,
				 	},
					{
						name: 'remarks',
						value: detailWarehousing.remarks,
				 	},
					 {
						name: 'registeredDate',
						value: detailWarehousing.registeredDate,
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
					label="입출고명"
					rules={[{
							required: true,
					}]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="unitWeight"
					label="단위무게"
					rules={[{
							required: true,
					}]}
				>
					<InputNumber 
						style={{ width: '100%'}} 
						controls={false}
						precision={1}
					/>
				</Form.Item>
				<Form.Item
					name="unitName"
					label="단위명"
					rules={[{
						required: true,
					}]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="remarks"
					label="비고"
				>
					<Input />
				</Form.Item>
				{
					//신규가 아닌 경우만 삭제버튼 노출
					detailWarehousing.id &&
					<Form.Item
						name="registeredDate"
						label="등록일시"
					>
						{/* <Input style={{color: 'black'}} disabled={true} bordered={false} /> */}
						{detailWarehousing.registeredDate}
					</Form.Item>
				}

				<Divider />
				{/* <Form.Item style={{textAlign : 'right'}} > */}
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
				{/* </Form.Item> */}
				
			</Form>
			</Spin>
		</Modal>
		

	);
}

export default WarehousingForm;