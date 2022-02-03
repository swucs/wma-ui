import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Divider, Space, message, Spin, Popconfirm, InputNumber } from 'antd';
import axiosUtil from "../../utils/axiosUtil";
import { useDispatch, useSelector } from 'react-redux';
import { setWarehousingDetailItem, setWarehousingDetails, setDetailItemModalVisible } from '../../reducers/warehousingStore';


const { Option } = Select;

const layout = {
	labelCol: {
	  span: 6,
	},
};

  
const validateMessages = {
	required: '${label}을(를) 입력하세요.'
};

const WarehousingDetailForm = () => {

	const [form] = Form.useForm();

	const dispatch = useDispatch();

	//Redux State로 부터 거래처목록 모니터링
	const warehousingItem = useSelector((state) => state.warehousingStore.warehousingItem);
	const warehousingDetails = useSelector((state) => state.warehousingStore.warehousingDetails);
	const warehousingDetailItem = useSelector((state) => state.warehousingStore.warehousingDetailItem);
	const isDetailItemModalVisible = useSelector(state => state.warehousingStore.isDetailItemModalVisible);	//입출고내역 팝업출력여부

	//상태정보
	const [itemCodes, setItemCodes] = useState([]);

	/**
	 * 코드정보(Selectbox용)
	 */
	 useEffect(() => {

		if (!warehousingItem.customerId) {
			return;
		}

		//품목목록
		axiosUtil({
			url : `${process.env.NEXT_PUBLIC_API_URL}/api/item/customer/${warehousingItem.customerId}/codes`,
			method : 'get',
		})
		.then((response) => {
			if (response.data) {
				setItemCodes(response.data);
			} else {
				setItemCodes([]);
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}, [warehousingItem.customerId]);

	
	/**
	 * 무게계산
	 */
	const calculateWeight = () => {
		const formValues = form.getFieldsValue();

		const selectedItem = itemCodes.filter(code => code.id == formValues.itemId)[0];
		// alert(JSON.stringify(selectedItem));

		const totalWeight = (selectedItem.unitWeight * formValues.count) + formValues.remainingWeight;
		// alert(totalWeight);

		dispatch(setWarehousingDetailItem({
			...warehousingDetailItem
			, itemId: formValues.itemId
			, itemName: selectedItem.name
			, itemUnitWeight: selectedItem.unitWeight
			, itemUnitName: selectedItem.unitName
			, totalWeight: totalWeight
			, count: formValues.count
			, remainingWeight: formValues.remainingWeight
			, remarks: formValues.remarks
			, calculationYn: formValues.calculationYn
		}));
	}

	//취소버튼
	const handleConfirmCancel = () => {
		dispatch(setDetailItemModalVisible(false));
	};

	/**
	 * 확인버튼
	 * @param {*} formValues
	 */
	const onFinish = (formValues) => {

		if (formValues.totalWeight === 0) {
			form.setFields([{
				name : 'totalWeight'
				, errors : ["0보다 큰 값이어야 합니다."]
			}]);
			return;
		}

		const inputData = {
			...warehousingDetailItem
			, itemId: formValues.itemId
			, totalWeight: formValues.totalWeight
			, count: formValues.count
			, remainingWeight: formValues.remainingWeight
			, remarks: formValues.remarks
			, calculationYn: formValues.calculationYn
		};

		// alert(JSON.stringify(inputData));

		dispatch(setWarehousingDetailItem(inputData));


		if (warehousingDetailItem.key == null) {
			// alert("new");
			//입출고내역 리스트에 추가
			const duplicatedItemLength = warehousingDetails.filter(e => e.itemId === inputData.itemId).length;
			if (duplicatedItemLength > 0) {
				message.error("이미 등록된 품목입니다.");
				return;
			}

			dispatch(setWarehousingDetails([
				...warehousingDetails
				, {...inputData, key: inputData.itemId}
			]));
		} else {
			// alert("update");
			//입출고내역 리스트에 반영
			dispatch(setWarehousingDetails(
				warehousingDetails.map((e, i) => {
					// alert(e.key + " : " + inputData.key);
					return e.key === inputData.key ? { ...inputData} : e
				})
			));
		}

		//팝업닫기
		dispatch(setDetailItemModalVisible(false));
	};

	return (
		<Modal 
			style={{ top: 10 }}
			title="입출고 내역"
			visible={isDetailItemModalVisible} 
			footer={null}
			onCancel={handleConfirmCancel}
			destroyOnClose={true}	//이 옵션이 있어야 모달이 닫힐 때 객체들이 destory되는듯
		>
			<Form 
				form={form}
				name="warehousing-detail-form"
				onFinish={onFinish} 
				onValuesChange={calculateWeight}
				{...layout}
				// layout="horizontal"
				validateMessages={validateMessages}
				fields={[ 
					{
						name: 'itemId',
						value: warehousingDetailItem.itemId,
					},
					{
						name: 'itemUnitWeight',
						value: warehousingDetailItem.itemUnitWeight,
				 	},
					{
						name: 'count',
						value: warehousingDetailItem.count,
				 	},
					{
						name: 'remainingWeight',
						value: warehousingDetailItem.remainingWeight,
				 	},
					{
						name: 'totalWeight',
						value: warehousingDetailItem.totalWeight,
				 	},
					{
						name: 'remarks',
						value: warehousingDetailItem.remarks,
				 	},
					{
						name: 'calculationYn',
						value: warehousingDetailItem.calculationYn,
				 	},
				]}
			>
				<Form.Item
					name="itemId"
					label="품목"
					rules={[{
						required: true,
					}]}
				>
					<Select
						showSearch
						// onChange={onChangeItemId}
						filterOption={(input, option) =>
							option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
						disabled={warehousingDetailItem.key != null}
					>
						{itemCodes.map(code => (
							<Option key={code.id} value={code.id} data={code}>{code.nameDescription}</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name="itemUnitWeight"
					label="단위중량"
				>
					<InputNumber
						style={{ width: '100%', border: 0}} 
						controls={false}
						precision={1}
						readOnly={true}
					/>
				</Form.Item>

				<Form.Item
					name="count"
					label="개수"
					rules={[{
						required: true,
					}]}
				>
					<InputNumber 
						style={{ width: '100%'}} 
						controls={false}
						// onChange={calculateWeight}
					/>
				</Form.Item>

				<Form.Item
					name="remainingWeight"
					label={`잔량${warehousingDetailItem.itemUnitName ? '(' + warehousingDetailItem.itemUnitName + ')' : ''}`}
				>
					<InputNumber
						style={{ width: '100%'}} 
						controls={false}
					/>
				</Form.Item>

				<Form.Item
					name="totalWeight"
					label="총중량(자동계산)"
				>
					<InputNumber
						style={{ width: '100%'}} 
						controls={false}
						readOnly={true}
					/>
				</Form.Item>

				<Form.Item
					name="remarks"
					label="비고"
				>
					<Input
					/>
				</Form.Item>

				<Form.Item
					name="calculationYn"
					label="계산여부"
					rules={[{
						required: true,
					}]}
				>
					<Select>
						<Option value="Y">계산</Option>
						<Option value="N">제외</Option>
					</Select>
				</Form.Item>

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
}

export default WarehousingDetailForm;