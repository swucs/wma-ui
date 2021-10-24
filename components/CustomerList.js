import React from 'react';
import { Table, Tag, Space } from 'antd';

const CustomerList = () => {

    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          align: 'center',
          fixed: 'left',
          width: 70,
        },
        {
          title: '업체명',
          dataIndex: 'name',
          key: 'name',
          align: 'left',
          render: text => <a>{text}</a>,
          fixed: 'left',
          width: 200,
        },
        {
          title: '사업자번호',
          dataIndex: 'address',
          key: 'address',
          align: 'center',
        },
        {
            title: '대표자',
            dataIndex: 'address',
            key: 'address',
            align: 'center',
        },
        {
            title: '전화번호',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Fax',
            dataIndex: 'address',
            key: 'address',
        },
        {
          title: '업태',
          key: 'tags',
          dataIndex: 'tags',
          render: tags => (
            <>
              {tags.map(tag => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
            title: '종목',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '사용여부',
            dataIndex: 'address',
            key: 'address',
        },
        // {
        //   title: 'Action',
        //   key: 'action',
        //   render: (text, record) => (
        //     <Space size="middle">
        //       <a>Invite {record.name}</a>
        //       <a>Delete</a>
        //     </Space>
        //   ),
        // },
      ];
      
      const data = [
        {
          id: '1',
          name: 'New York No. 1 Lake Par',
          age: 32,
          address: '110-22-33455',
          tags: ['nice', 'developer'],
        },
        {
            id: '2',
          name: 'London No. 1 Lake Park',
          age: 42,
          address: '110-22-33455',
          tags: ['loser'],
        },
        {
            id: '3',
          name: 'Sidney No. 1 Lake Park',
          age: 32,
          address: '110-22-33455',
          tags: ['cool', 'teacher'],
        },
      ];

    return (
        <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} />
    );
};

export default CustomerList;