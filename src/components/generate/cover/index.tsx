import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button } from 'antd';
import html2canvas from 'html2canvas';
import { ImageUploader } from '../../../components/image-uploader';
import { ImageUploaderInput } from '../../../components/image-uploader/input';
import { Emitter } from '../../../utils/emitter';

const defaultImagesList = [
    "/photos/grid/image_1.png",
    '/photos/grid/image_2.png',
    '/photos/grid/image_3.png',
    '/photos/grid/image_4.png',
]

export const GenerateCoverComponent: React.FC = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const resetImages = () => {
        setImageList([
            "/photos/grid/image_1.png",
            '/photos/grid/image_2.png',
            '/photos/grid/image_3.png',
            '/photos/grid/image_4.png',
        ])
    };

    const generateImage = () => {
        const divToCapture = document.getElementById('gok-grid');

        if (divToCapture) {

            const windowWidth = divToCapture.scrollWidth;
            // const windowHeight = 414;

            html2canvas(divToCapture, {
                // windowWidth: windowWidth,
                // windowHeight: windowHeight,
                scrollX: window.scrollX,
                scrollY: window.scrollY,
                width: windowWidth,
                // height: windowHeight,
                scale: 1.5,
            }).then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `gok-cover-linkedin-${new Date().getTime()}.png`;
                link.click();
            });
        }
    };


    const [imageList, setImageList] = useState<string[]>(defaultImagesList);

    useEffect(() => {
        Emitter.EventEmitter.addListener(Emitter.Event.Action.CompleteUploadImage, (params: any) => {
            let currentList = imageList;

            currentList[params.index] = URL.createObjectURL(params.value);

            setImageList([...currentList]);
        })
    }, []);

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
                <Col lg={24}>
                    <div style={{ overflowX: 'auto' }}>
                        <Row justify={'center'}>
                            <Col>
                                <div className="image-grid" ref={gridRef} id='gok-grid'>
                                    {imageList.map((url, index) => (
                                        <Col key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                                            <div className="image-container">
                                                <div className="image-container">
                                                    <img src={url} alt={`Imagem ${index + 1}`} className="image image-black-and-white" />
                                                    <div className={(index % 2 === 0) ? '' : 'image-overlay'}></div>
                                                </div>
                                                {
                                                    hoveredIndex === index && (
                                                        <label className="upload-button">
                                                            <ImageUploaderInput index={index} />
                                                        </label>)
                                                }
                                            </div>
                                        </Col>
                                    ))}
                                    <Col>
                                        <div>
                                            <img src={'/photos/grid/image_5.png'} />
                                        </div>
                                    </Col>
                                </div>
                            </Col>
                        </Row>
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
            <ImageUploader />
        </>
    );
};