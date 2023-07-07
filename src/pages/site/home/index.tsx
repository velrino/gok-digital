import React, { useRef, useState } from 'react';
import { Row, Col, Button } from 'antd';
import html2canvas from 'html2canvas';
import { UploadOutlined } from '@ant-design/icons';

export const SiteHomePage: React.FC = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrls = [...imageList];
                imageUrls[index] = e.target?.result as string;
                setImageList(imageUrls);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetImages = () => {
        setImageList([
            "/photos/grid/image_3.png",
            '/photos/grid/image_2.png',
            '/photos/grid/image_3.png',
            '/photos/grid/image_2.png',
        ])
    };

    const generateImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                const img = document.createElement('a');
                img.href = canvas.toDataURL();
                img.download = 'grid.png';
                img.click();
            });
        }
    };

    const [imageList, setImageList] = useState<string[]>([
        "/photos/grid/image_3.png",
        '/photos/grid/image_2.png',
        '/photos/grid/image_3.png',
        '/photos/grid/image_2.png',
    ]);

    return (
        <>
            <Row justify={'center'}>
                <Col>
                    <h1>
                        Faça upload da sua imagem
                    </h1>
                </Col>
            </Row>
            <Row className="container" justify={'center'}>
                <Col>
                    <div className="image-grid" ref={gridRef}>
                        {imageList.map((url, index) => (
                            <Col key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                                <div className="image-container">
                                    <img src={url} alt={`Imagem ${index + 1}`} />
                                    {hoveredIndex === index && (
                                        <label className="upload-button">
                                            <div onClick={() => fileInputRef.current?.click()} className="clickable">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    onChange={(e) => handleImageUpload(e, index)}
                                                    style={{ display: 'none' }}
                                                />
                                                <Button icon={<UploadOutlined />} />
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </Col>
                        ))}
                        <Col>
                            <div>
                                <img src={'/photos/grid/image_5.png'} alt={`Imagem 5`} />
                            </div>
                        </Col>
                    </div>
                </Col>
            </Row>
            <Row justify={'center'} gutter={16}>
                <Col>
                    <Button onClick={resetImages}>Resetar imagens</Button>
                </Col>
                <Col>
                    <Button onClick={generateImage}>Salvar como PNG</Button>
                </Col>
            </Row>
        </>
    );
};