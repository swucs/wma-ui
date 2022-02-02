import React, { useState, useCallback } from 'react';
import { useDispatch } from "react-redux";
// import { searchScreener } from "../reducers";
import { Button, Col, Row, Form, Input, InputNumber, Space } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { queryCustomers, setCustomerItem, setDetailModalVisible } from '../../reducers/customerStore';


const { Search } = Input;


const CustomerSearchBox = () => {

	const dispatch = useDispatch();

    const [form] = Form.useForm();

	//신규버튼
	const handleClick = () => {
		//비어있는 상세정보 세팅
		dispatch(setCustomerItem({use : true}));

		//상세팝업 띄우기
		dispatch(setDetailModalVisible(true));
	}

	//검색처리
	const handleSearch = (value) => {
		dispatch(queryCustomers({name : value}));
	}

    return (
        <Form
                form={form}
                name="advanced_search"				 
                className="ant-advanced-search-form"
                // onFinish={handleSubmit}
            >
				<Space>
					<Search
						type="text"
						placeholder="업체명"
						enterButton="Search"
						allowClear
						size="large"
						//   suffix={suffix}
						  onSearch={handleSearch}
						/>
					
					<Button 
						icon={<PlusOutlined />}
						size="large"
						// type="primary"
						onClick={handleClick} />
				</Space>
        </Form>

    );

}

export default CustomerSearchBox;