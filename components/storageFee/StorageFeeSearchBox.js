import React, { useState, useCallback } from 'react';
import { useDispatch } from "react-redux";
// import { searchScreener } from "../reducers";
import { Button, Col, Row, Form, Input, InputNumber, Space } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { queryStorageFees, setStorageFeeItem, setDetailModalVisible } from '../../reducers/storageFeeStore';
import moment from 'moment';
import { DATE_FORMAT_YYYYMMDD } from  "../../utils/formatUtil";

const { Search } = Input;


const StorageFeeSearchBox = () => {

	const dispatch = useDispatch();

    const [form] = Form.useForm();

	//신규버튼
	const handleClick = () => {
		//비어있는 상세정보 세팅
		dispatch(setStorageFeeItem({baseDate : moment(new Date()).format(DATE_FORMAT_YYYYMMDD)}));

		//상세팝업 띄우기
		dispatch(setDetailModalVisible(true));
	}

	//검색처리
	const handleSearch = (value) => {
		dispatch(queryStorageFees({name : value}));
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
						placeholder="보관료명"
						enterButton="Search"
						allowClear
						size="normal"
						//   suffix={suffix}
						  onSearch={handleSearch}
						/>
					
					<Button 
						icon={<PlusOutlined />}
						size="normal"
						// type="primary"
						onClick={handleClick} />
				</Space>
        </Form>

    );

}

export default StorageFeeSearchBox;