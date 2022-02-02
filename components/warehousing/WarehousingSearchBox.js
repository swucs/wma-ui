import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Select, Space, DatePicker } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { queryWarehousings, setWarehousingItem, setDetailModalVisible } from '../../reducers/warehousingStore';
import moment from 'moment';
import { DATE_FORMAT_YYYYMMDD } from  "../../utils/formatUtil";


const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;


const WarehousingSearchBox = () => {

	const dispatch = useDispatch();

    const [form] = Form.useForm();

	//Redux State로 부터 검색어 모니터링
	const searchWord = useSelector(state => state.warehousingStore.searchWord);


	//신규버튼
	const handleClick = () => {
		//비어있는 상세정보 세팅
		dispatch(setWarehousingItem({baseDate : moment(new Date()).format(DATE_FORMAT_YYYYMMDD)}));

		//상세팝업 띄우기
		dispatch(setDetailModalVisible(true));
	}

	//검색처리
	const handleSearch = (searchFormData) => {
		// alert(JSON.stringify(searchFormData));

		dispatch(queryWarehousings({
			baseDateFrom : searchFormData.baseDateFrom,
			baseDateTo : searchFormData.baseDateTo,
			warehousingTypeValue: searchFormData.warehousingTypeValue,
			customerName: searchFormData.customerName,
			itemName: searchFormData.itemName,
		}));
	}

	const handleChange = (value) => {
		console.log(`selected ${value}`);
	  }

    return (
        <Form
			form={form}
			name="advanced_search"				 
			className="ant-advanced-search-form"
			onFinish={handleSearch}
			layout='inline'
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
					name: 'warehousingTypeValue',
					value: searchWord.warehousingTypeValue,
				},
				{
					name: 'customerName',
					value: searchWord.customerName,
				},
				{
					name: 'itemName',
					value: searchWord.itemName,
				},
			]}
		>
			<Space wrap>
				
				<Form.Item name="baseDateFrom" style={{margin: 0, display: 'inline-block'}}>
					<DatePicker size="large" style={{width:135}} />
				</Form.Item>
				<Form.Item name="baseDateTo" style={{margin: 0, display: 'inline-block'}}>
					<DatePicker size="large" style={{width:135}} />
				</Form.Item>

				<Form.Item name="warehousingTypeValue" style={{margin: 0, display: 'inline-block'}}>
					<Select 
						onChange={handleChange}
						style={{width:80}}
						size="large"
					>
						<Option value="">전체</Option>
						<Option value="INCOMING">입고</Option>
						<Option value="OUTGOING">출고</Option>
					</Select>
				</Form.Item>

				<Form.Item name="customerName" style={{margin: 0, display: 'inline-block'}}>
					<Input
						placeholder="고객명"
						style={{width: 120}}
						size="large"
					/>
				</Form.Item>

				<Form.Item name="itemName" style={{margin: 0, display: 'inline-block'}}>
					<Input
						placeholder="품목명"
						style={{width: 120}}
						size="large"
					/>
				</Form.Item>

				<Form.Item style={{margin: 0, display: 'inline-block'}}>
					<Button
						type="primary"
						htmlType="submit"
						size="large"
						style={{margin: 0}}
					>
						Search
					</Button>
				</Form.Item>

				<Form.Item style={{margin: 0, display: 'inline-block'}}>
					<Button 
						icon={<PlusOutlined />}
						size="large"
						onClick={handleClick} />
				</Form.Item>

			</Space>
        </Form>

    );

}

export default WarehousingSearchBox;