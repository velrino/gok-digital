import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, Input, Radio, RadioChangeEvent, TabsProps, Tabs, Typography } from 'antd';
import { Emitter } from '../../../utils/emitter';
import { GownerTemplate, SignatureTemplate } from './template';
import TextArea from 'antd/es/input/TextArea';
import { NotificationTypeEnum } from '../../notification';
import { InputPhoneComponent } from '../../inputs/phone';

export const GenerateSignatureComponent: React.FC = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const replaceCumulative = (str: any, find: any, replace: any) => {
        for (var i = 0; i < find.length; i++)
            str = str.replace(new RegExp(find[i], "g"), replace[i]);
        return str;
    }

    const getGeneratedPageURL = () => {
        const getBlobURL = (code: any, type: any) => {
            const blob = new Blob([code], { type: "text/html" });
            const url = URL.createObjectURL(blob);

            setPreviewUrl(url);
            return url;
        };

        const gowner = (formData.gowner === 'GOWNER') ? GownerTemplate : '';
        const phoneInformed = (formData.phone.length) ? `<div>Tel. ${formData.phone}</div>` : '';
        const telephoneInformed = (formData.telephone.length) ? `<div>Cel. ${formData.telephone}</div>` : '';
        const telephone2Informed = (formData.telephone2.length) ? `<div>Cel. ${formData.telephone2}</div>` : '';

        const source = replaceCumulative(SignatureTemplate,
            ["NOME", 'CARGO', 'EMAIL', `PHONE`, 'CELULAR', 'TELEFONE', 'GOWNER'],
            [formData.name, formData.job, formData.email, phoneInformed, telephoneInformed, telephone2Informed, gowner]
        );

        setCurrentCode(source)

        return getBlobURL(source, "text/html");
    };

    useEffect(() => {
        if (previewUrl) {
            const iframe = document.getElementById("renderHtml") as HTMLIFrameElement;
            if (iframe) {
                iframe.src = previewUrl;
            }
        }
    }, [previewUrl]);

    const [currentCode, setCurrentCode] = useState<string>();

    const [formData, setFormData] = useState<any>({
        name: 'Lorem Ipsum',
        job: 'Cargo',
        email: 'goker@gok.digital',
        phone: '(11) 2000-0000',
        telephone: '(11) 90000-0000',
        telephone2: '(11) 91234-5678',
        gowner: 'GOWNER',
    });

    useEffect(() => { getGeneratedPageURL() }, [formData])

    const gownerInput = ({ target: { value } }: RadioChangeEvent) => {
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            gowner: value,
        }));
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleInputPhoneChange = (e: any) => {
        const { name, value } = e.target;
        const newValue = value.replace("_", "");
        const containsNumber = /\d/.test(newValue);

        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [name]: (containsNumber) ? newValue : '',
        }));
    };

    const textareaRef: any = useRef(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const copyCode = () => {
        if (iframeRef.current?.contentWindow) {
            const iframeDocument = iframeRef.current.contentWindow.document;
            const iframeContent = iframeDocument.documentElement.outerHTML;

            navigator.clipboard.writeText(iframeContent)
                .then(() => {
                    Emitter.EventEmitter.emit(Emitter.Event.Action.Notification, {
                        type: NotificationTypeEnum.success,
                        title: "HTML copiado com sucesso!"
                    })
                })
                .catch((error) => {
                    Emitter.EventEmitter.emit(Emitter.Event.Action.Notification, {
                        type: NotificationTypeEnum.error,
                        title: "Falha ao copiar!"
                    })
                });
        }
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Visualização`,
            children: <>
                <Row className="container" justify={'center'}>
                    <Col lg={24} className='text-center margin-bottom-md'>
                        <Typography.Title level={4} className='margin-0'> Basta apenas selecionar tudo, copiar e colar no seu e-mail</Typography.Title>
                    </Col>
                    <Col lg={24}>
                        <div>
                            <iframe
                                ref={iframeRef}
                                width="100%"
                                id="renderHtml"
                                name="renderHtml"
                            ></iframe>
                        </div>
                    </Col>
                </Row>

            </>,
        },
        {
            key: '2',
            label: `Código HTML`,
            children: <>
                <Row justify={'center'} gutter={16}>
                    <Col className='margin-bottom-md'>
                        <Button onClick={copyCode} type='primary'>Copiar</Button>
                    </Col>
                    <Col span={24}>
                        <Input.TextArea
                            ref={textareaRef}
                            value={currentCode}
                            autoSize={{ minRows: 2, maxRows: 10 }}
                            readOnly
                        />
                    </Col>
                </Row>
            </>,
        },
    ];

    return (
        <>
            <div className='text-center'>
                <Row gutter={16} justify={'center'} align={'middle'}>
                    <Col xs={24} lg={5} className='gok-input'>
                        <label>Nome:</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col xs={24} lg={5} className='gok-input'>
                        <label>Cargo:</label>
                        <Input
                            name="job"
                            value={formData.job}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col xs={24} lg={5} className='gok-input'>
                        <label>E-mail:</label>
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </Col>
                </Row>
                <Row gutter={16} justify={'center'} align={'middle'}>
                    <Col xs={24} lg={5} className='gok-input'>
                        <label>Telefone:</label>
                        <InputPhoneComponent name="phone" value={formData.phone} onChange={handleInputPhoneChange} />
                    </Col>
                    <Col xs={24} lg={5} className='gok-input'>
                        <label>Celular:</label>
                        <InputPhoneComponent name="telephone" value={formData.telephone} onChange={handleInputPhoneChange} />
                    </Col>
                    <Col xs={24} lg={5} className='gok-input'>
                        <label>Celular 2:</label>
                        <InputPhoneComponent name="telephone2" value={formData.telephone2} onChange={handleInputPhoneChange} />
                    </Col>
                </Row>
                <Row gutter={16} justify={'center'} align={'middle'}>
                    <Col xs={24} lg={5} className='gok-input'>
                        <label className='d-block'>Você é:</label>
                        <Radio.Group options={['GOWNER', 'GOKER']} buttonStyle="solid" optionType="button" value={formData.gowner} onChange={gownerInput} />
                    </Col>
                </Row>
            </div>
            <Tabs defaultActiveKey="1" items={items} centered={true} />
        </>
    );
};
