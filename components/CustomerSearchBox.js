import React, { useState, useCallback } from 'react';
import { useDispatch } from "react-redux";
// import { searchScreener } from "../reducers";
import { Button, Col, Row, Form, Input, InputNumber, Space } from "antd";
import { useRouter } from 'next/router';

const { Search } = Input;


const CustomerSearchBox = () => {

    const [form] = Form.useForm();

    return (
        <Form
                form={form}
                name="advanced_search"				 
                className="ant-advanced-search-form"
                // onFinish={handleSubmit}
            >

            <Space direction="vertical">
                <Search
                    type="text"
                    placeholder="업체명"
                    enterButton="Search"
                    allowClear
                    size="large"
                    //   suffix={suffix}
                    //   onSearch={onSearch}
                    />
            </Space>
        </Form>

    );

}

export default CustomerSearchBox;