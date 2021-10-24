import React, { useState } from 'react';
import { Space } from "antd";
import AppLayout from "../components/AppLayout";
import CustomerSearchBox from "../components/CustomerSearchBox";
import CustomerList from "../components/CustomerList";

const customer = () => {

    
      
    return (
        <AppLayout>
            <Space direction="vertical" style={{width :'100%'}}>
                <CustomerSearchBox></CustomerSearchBox>
                <CustomerList></CustomerList>
            </Space>
        </AppLayout>
      );
}

export default customer;