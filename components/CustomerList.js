import React from 'react';
import { Table, Tag, Space } from 'antd';
import { useEffect, useState } from 'react';

const CustomerList = ({ data }) => {

	const [scrollY, setScrollY] = useState([]);

	const handleResize = () => {
		console.log("handleResize: " + window.innerHeight);
		setScrollY(window.innerHeight - 218);
	}

	useEffect(() => {
		//최초실행
		handleResize();
		//resize시 실행
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		}
	}, []);

    const columns = [
        {
          title: '업체명',
          dataIndex: 'name',
          key: 'name',
          align: 'left',
		  width: 210,
          render: text => <a>{text}</a>,
        },
		{
            title: '전화번호',
            dataIndex: 'phoneNumber',
            key: 'addphoneNumberess',
			align: 'center',
        },
        {
          title: '사업자번호',
          dataIndex: 'businessNumber',
          key: 'businessNumber',
          align: 'center',
        },
        {
            title: '대표자',
            dataIndex: 'representativeName',
            key: 'representativeName',
            align: 'center',
        },
        {
            title: 'Fax',
            dataIndex: 'faxNumber',
            key: 'faxNumber',
			align: 'center',
        },
        {
          title: '업태',
          key: 'businessConditions',
          dataIndex: 'businessConditions',
        //   render: tags => (
        //     <>
        //       {tags.map(tag => {
        //         let color = tag.length > 5 ? 'geekblue' : 'green';
        //         if (tag === 'loser') {
        //           color = 'volcano';
        //         }
        //         return (
        //           <Tag color={color} key={tag}>
        //             {tag.toUpperCase()}
        //           </Tag>
        //         );
        //       })}
        //     </>
        //   ),
        },
        {
            title: '종목',
            dataIndex: 'typeOfBusiness',
            key: 'typeOfBusiness',
        },
        {
            title: '사용여부',
            dataIndex: 'use',
            key: 'address',
			align: 'center',
			render: use => (
				<>
					{use ? "사용" : "미사용"}
				</>
			)
        },
    ];
      
    return (
        <Table 
			columns={columns}
			dataSource={data}
			scroll={{ x: 1300, y: scrollY}} 
			pagination={false /*{position: ['none', 'bottomCenter']}*/}
			
		/>
    );
};

export default CustomerList;