import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Row, Form, Input, InputNumber, Space, Select} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { queryCustomerItems, setCustomerItemItem, setDetailModalVisible } from '../../reducers/customerItemStore';
import axiosUtil from "../../utils/axiosUtil";

const { Search } = Input;
const { Option } = Select;


const CustomerItemSearchBox = () => {

	const dispatch = useDispatch();

    const [form] = Form.useForm();

	//Redux State로 부터 검색어 모니터링
	const searchWord = useSelector(state => state.customerItemStore.searchWord);

	//거래처목록
	const [customerCodes, setCustomerCodes] = useState([]);

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
					dispatch(queryCustomerItems({
						...searchWord
						, customerId : response.data[0].id,
					}));
				} else {
					setCustomerCodes([]);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	//신규버튼
	const handleClick = () => {
		const customerName = customerCodes.filter(code => code.id == searchWord.customerId)[0].name;

		//비어있는 상세정보 세팅
		dispatch(setCustomerItemItem({ customerId : searchWord.customerId, customerName : customerName }));

		//상세팝업 띄우기
		dispatch(setDetailModalVisible(true));
	}

	//검색처리
	const handleChangeCustomerId = (customerId) => {
		// alert(JSON.stringify(customerId));
		dispatch(queryCustomerItems({
			...searchWord
			, customerId : customerId
		}));
	}

    return (
        <Form
                form={form}
                name="advanced_search"				 
                className="ant-advanced-search-form"
                // onFinish={handleSearch}
				fields={[
					{
						name: 'customerId',
						value: searchWord.customerId,
					},
				]}
            >
				<Space>
					<Form.Item
						name="customerId"
						style={{margin: 0, display: 'inline-block'}}
					>
						<Select
							style={{ width: 200 }}
							size="normal"
							onChange={handleChangeCustomerId}
						>
							{customerCodes.map(code => (
								<Option key={code.id} value={code.id} >{code.name}</Option>
							))}
						</Select>
					</Form.Item>

					<Button
						icon={<PlusOutlined />}
						size="normal"
						// type="primary"
						onClick={handleClick} />
				</Space>
        </Form>

    );

}

export default CustomerItemSearchBox;