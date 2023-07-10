import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button } from 'antd';
import html2canvas from 'html2canvas';
import { UploadOutlined } from '@ant-design/icons';
import ReactCrop from 'react-image-crop'
import { ImageUploader } from '../../../components/image-uploader';
import { ImageUploaderInput } from '../../../components/image-uploader/input';
import { Emitter } from '../../../utils/emitter';

const defaultImagesList = [
    "/photos/grid/image_1.png",
    '/photos/grid/image_2.png',
    '/photos/grid/image_3.png',
    '/photos/grid/image_4.png',
]

export const SiteHomePage: React.FC = () => {
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

    const toggleUploadButton = (currentDisplay: 'none' | 'block') => {
        const uploadButtons = document.querySelectorAll('.upload-button');
        uploadButtons.forEach((button) => {
            (button as HTMLElement).style.display = currentDisplay;
        });
    }

    const generateImage = () => {
        const divToCapture = document.getElementById('gok-grid');

        if (divToCapture) {
            html2canvas(divToCapture).then((canvas) => {
                const bwCanvas = document.createElement('canvas');
                const bwContext = bwCanvas.getContext('2d');

                if (!bwContext) return;

                bwCanvas.width = canvas.width;
                bwCanvas.height = canvas.height;

                bwContext.drawImage(canvas, 0, 0);

                const img = document.createElement('a');
                img.href = bwCanvas.toDataURL('image/png');
                img.download = `gok-cover-linkedin-${new Date().getTime()}.png`;
                img.click();
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
                                <img src={'/photos/grid/image_5.png'} height={414} />
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
            <ImageUploader />
        </>
    );
};