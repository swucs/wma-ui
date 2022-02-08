import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Divider, Space, message, Spin, Popconfirm, InputNumber } from 'antd';
import axiosUtil from "../../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import { setItems, setItem, setDetailLoadingBar, setDetailModalVisible } from '../../reducers/itemStore';

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

const ItemForm = () => {


	const dispatch = useDispatch();
	const isDetailModalVisible = useSelector(state => state.itemStore.isDetailModalVisible);	//상세팝업출력여부
	const detailItem = useSelector(state => state.itemStore.detailItem);				//상세품목정보
	const items = useSelector(state => state.itemStore.items);							//품목목록
	const isDetailLoadingBar = useSelector(state => state.itemStore.isDetailLoadingBar);		//상세정보 로딩바

	const [form] = Form.useForm();
	
	const onFinish = (item) => {

		// alert(JSON.stringify(item));
		//사용자가 상세정보를 state에 저장
		dispatch(setItem({...item}));

		//로딩바
		dispatch(setDetailLoadingBar(true));

		if (!detailItem.id) {

			//품목정보 생성
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/item`,
				method : 'post',
				data : item
			})
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('품목정보가 생성되었습니다.');

				//목록에 추가하기
				dispatch(setItems([...items, {...response.data}]));

				//팝업창 닫기
				dispatch(setDetailModalVisible(false));

			})
			.catch((error) => {
				if (error.response?.data?.errors != null) {
					displayErrorMessage(error.response.data.errors);
				} else {
					message.error('에러발생 : ItemForm.js');
				}
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));
				console.log(error);
			});
		} else {
			//품목정보 수정
			axiosUtil({
				url : `${process.env.NEXT_PUBLIC_API_URL}/api/item/${detailItem.id}`,
				method : 'put',
				data : item
			})
			.then((response) => {
				console.log(response.data);
				
				//로딩바 감추기
				dispatch(setDetailLoadingBar(false));

				message.success('품목정보가 수정되었습니다.');

				//목록 갱신하기
				dispatch(setItems(
					items.map(item => {
						return item.id === detailItem.id ? {...response.data, key: detailItem.id} : item
					})
				));

				//상세정보 갱신
				// dispatch(setItem({...response.data}));

			})
			.catch((error) => {
				if (error.response?.data?.errors != null) {
					displayErrorMessage(error.response.data.errors);
				} else {
					message.error('에러발생 : ItemForm.js');
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
	 * 취소Alert창의 confirm 버튼
	 */
	const handleConfirmCancel = () => {
		dispatch(setDetailModalVisible(false));
	};

	return (
		<Modal 
			style={{ top: 10 }}
			title="품목"
			visible={isDetailModalVisible} 
			footer={null}
			onCancel={handleConfirmCancel}
			destroyOnClose={true}	//이 옵션이 있어야 모달이 닫힐 때 객체들이 destory되는듯
		>
			<Spin tip="Loading..." spinning={isDetailLoadingBar}>
			<Form 
				form={form}
				name="item-form"
				onFinish={onFinish} 
				{...layout}
				validateMessages={validateMessages}
				fields={[
					{
						name: 'id',
						value: detailItem.id,
					},
					{
						name: 'name',
						value: detailItem.name,
				 	},
					{
						name: 'unitWeight',
						value: detailItem.unitWeight,
				 	},
					{
						name: 'unitName',
						value: detailItem.unitName,
				 	},
					{
						name: 'remarks',
						value: detailItem.remarks,
				 	},
					 {
						name: 'registeredDate',
						value: detailItem.registeredDate,
				 	},
				]}
			>
				<Form.Item
					name="id"
					label="ID"
					noStyle
				>
					<Input type="hidden" />
				</Form.Item>
				<Form.Item
					name="name"
					label="품목명"
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
					detailItem.id &&
					<Form.Item
						name="registeredDate"
						label="등록일시"
					>
						{/* <Input style={{color: 'black'}} disabled={true} bordered={false} /> */}
						{detailItem.registeredDate}
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

export default ItemForm;