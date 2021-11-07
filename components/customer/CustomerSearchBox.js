import React, { useState, useCallback } from 'react';
import { useDispatch } from "react-redux";
// import { searchScreener } from "../reducers";
import { Button, Col, Row, Form, Input, InputNumber, Space } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { setDetailCustomer, setDetailModalVisible } from '../../reducers/customerStore';


const { Search } = Input;


const CustomerSearchBox = () => {

	const dispatch = useDispatch();

    const [form] = Form.useForm();

	const handleClick = () => {
		//비어있는 상세정보 세팅
		dispatch(setDetailCustomer({use : true}));

		//상세팝업 띄우기
		dispatch(setDetailModalVisible(true));
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
						//   onSearch={onSearch}
						/>
					
					<Button 
						icon={<PlusOutlined />}
						size="large"
						type="primary"
						onClick={handleClick} />
				</Space>
        </Form>

    );

}

export default CustomerSearchBox;