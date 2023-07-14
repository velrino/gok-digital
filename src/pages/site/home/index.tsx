import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, TabsProps, Tabs, Card } from 'antd';
import { GenerateCoverComponent } from '../../../components/generate/cover';
import { GenerateSignatureComponent } from '../../../components/generate/signature';

export const SiteHomePage: React.FC = () => {

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Capa`,
            children: <GenerateCoverComponent />,
        },
        {
            key: '2',
            label: `Assinatura`,
            children: <GenerateSignatureComponent />,
        },
    ];

    return (
        <>
            <Row className="container" justify={'center'}>
                <Col lg={18}>
                    <Card>
                        <div className='text-center'>
                            <h1>
                                <img src='light-gok.png' height={25} />
                            </h1>
                        </div>
                        <Tabs defaultActiveKey="2" items={items} centered={true} />
                    </Card>
                </Col>
            </Row>
        </>
    );
};