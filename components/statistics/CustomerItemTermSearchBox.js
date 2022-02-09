import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Button, Form, Input, Select, Space, DatePicker } from "antd";
import { queryCustomerItemTerms } from '../../reducers/customerItemTermStore';
import axiosUtil from "../../utils/axiosUtil";


const { Search } = Input;
const { Option } = Select;


const CustomerItemTermSearchBox = () => {

	const dispatch = useDispatch();

    const [form] = Form.useForm();

	//Redux State로 부터 검색어 모니터링
	const searchWord = useSelector(state => state.customerItemTermStore.searchWord);

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
				dispatch(queryCustomerItemTerms({
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

	//검색처리
	const handleSearch = (searchFormData) => {
		dispatch(queryCustomerItemTerms({
			baseDateFrom : searchFormData.baseDateFrom,
			baseDateTo : searchFormData.baseDateTo,
			customerId: searchFormData.customerId,
		}));
	}

    return (
        <Form
                form={form}
                name="advanced_search"				 
                className="ant-advanced-search-form"
                onFinish={handleSearch}
				fields={[
					{
						name: 'baseDateFrom',
						value: searchWord.baseDateFrom,
					},
					{
						name: 'baseDateTo',
						value: searchWord.baseDateTo,
					},
					{
						name: 'customerId',
						value: searchWord.customerId,
					},
				]}
            >
				<Space wrap>
					
					<Form.Item name="baseDateFrom" style={{margin: 0, display: 'inline-block'}}>
						<DatePicker size="normal" inputReadOnly={true} allowClear={false} style={{width:130}} />
					</Form.Item>
					<Form.Item name="baseDateTo" style={{margin: 0, display: 'inline-block'}}>
						<DatePicker size="normal" inputReadOnly={true} allowClear={false} style={{width:130}} />
					</Form.Item>

					<Form.Item name="customerId" style={{margin: 0, display: 'inline-block'}}>
						<Select defaultValue={searchWord.customerId} style={{ width: 200 }}>
							{customerCodes.map(code => (
								<Option key={code.id} value={code.id} >{code.name}</Option>
							))}
						</Select>
					</Form.Item>
					
					<Form.Item style={{margin: 0, display: 'inline-block'}}>
						<Button
							type="primary"
							htmlType="submit"
							size="normal"
							style={{margin: 0}}
						>
							Search
						</Button>
					</Form.Item>
				</Space>
        </Form>

    );

}

export default CustomerItemTermSearchBox;