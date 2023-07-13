import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, Input, Radio, RadioChangeEvent } from 'antd';
import { ImageUploader } from '../../../components/image-uploader';
import { Emitter } from '../../../utils/emitter';
import { GownerTemplate, SignatureTemplate } from './template';
import TextArea from 'antd/es/input/TextArea';

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

        const gowner = (formData.gowner === 'yes') ? GownerTemplate : '';
        const phoneInformed = (formData.phone.length) ? `<div>Tel. ${formData.phone}</div>` : '';
        const telephoneInformed = (formData.telephone.length) ? `<div>Tel. ${formData.telephone}</div>` : '';

        const source = replaceCumulative(SignatureTemplate,
            ["NOME", 'CARGO', 'EMAIL', `PHONE`, 'CELULAR', 'GOWNER'],
            [formData.name, formData.job, formData.email, phoneInformed, telephoneInformed, gowner]
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
        phone: '11 20000 0000',
        telephone: '11 9 0000 0000',
        gowner: 'yes',
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

    const textareaRef: any = useRef(null);
    const copyCode = () => {
        if (textareaRef.current) {
            textareaRef.current.select();
            navigator.clipboard.writeText(textareaRef.current.value)
                .then(() => {
                    textareaRef.current.blur();
                    console.log('Texto copiado para a área de transferência!');
                })
                .catch((error) => {
                    console.error('Falha ao copiar o texto:', error);
                });
        }
    };

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
                        <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col xs={24} lg={5} className='gok-input'>
                        <label>Celular:</label>
                        <Input
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleInputChange}
                        />
                    </Col>
                    <Col xs={24} lg={5} className='gok-input'>
                        <label className='d-block'>Gowner:</label>
                        <Radio.Group options={['yes', 'no']} buttonStyle="solid" optionType="button" value={formData.gowner} onChange={gownerInput} />
                    </Col>
                </Row>
            </div>
            <Row className="container" justify={'center'}>
                <Col lg={24}>
                    <div>
                        <iframe
                            width="100%"
                            id="renderHtml"
                            name="renderHtml"
                        ></iframe>
                    </div>
                </Col>
            </Row>
            <Row justify={'center'} gutter={16}>
                {/* <Col>
                    <Button onClick={copyCode}>Copiar</Button>
                </Col> */}
                <Col span={24}>
                    <Input.TextArea
                        ref={textareaRef}
                        value={currentCode}
                        autoSize={{ minRows: 2, maxRows: 10 }}
                        readOnly
                    />
                </Col>
            </Row>

        </>
    );
};
