import React, { useState, useRef, DependencyList, useEffect } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import ReactCrop, { Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { UploadOutlined } from '@ant-design/icons';
import { Emitter } from '../../utils/emitter';

const TO_RADIANS = Math.PI / 180

export function useDebounceEffect(
    fn: () => void,
    waitTime: number,
    deps?: any,
) {
    useEffect(() => {
        const t = setTimeout(() => {
            fn.apply(undefined, deps)
        }, waitTime)

        return () => {
            clearTimeout(t)
        }
    }, deps)
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export const ImageUploader = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [crop, setCrop] = useState<Crop>({
        height: 395,
        unit: 'px',
        width: 195,
        x: 25,
        y: 25,
    })

    const [croppedImage, setCroppedImage] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const imgRef = useRef<HTMLImageElement>(null)
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [index, setIndex] = useState(0)
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        Emitter.EventEmitter.addListener(Emitter.Event.Action.AfterClickUploadImage, (params: any) => {
            setModalVisible(true);
            setSelectedImage(params.data);
            setIndex(params.index);
        })
    }, []);

    function canvasPreview(
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
        crop: PixelCrop,
        scale = 1,
        rotate = 0,
    ) {
        const ctx = canvas.getContext('2d')

        if (!ctx) return;

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        const pixelRatio = window.devicePixelRatio

        canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

        ctx.scale(pixelRatio, pixelRatio)
        ctx.imageSmoothingQuality = 'high'

        const cropX = crop.x * scaleX
        const cropY = crop.y * scaleY

        const rotateRads = rotate * TO_RADIANS
        const centerX = image.naturalWidth / 2
        const centerY = image.naturalHeight / 2

        ctx.save()

        ctx.translate(-cropX, -cropY)

        ctx.translate(centerX, centerY)

        ctx.rotate(rotateRads)

        ctx.scale(scale, scale)

        ctx.translate(-centerX, -centerY)

        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
        )

        ctx.restore()

        canvas.toBlob((blob) => {
            setCroppedImage(blob);
        });
    }

    function handleImage() {
        if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current && previewCanvasRef.current
        ) {
            canvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                completedCrop,
                scale,
                rotate,
            )
        }
    }

    useDebounceEffect(
        async () => {
            handleImage()
        },
        100,
        [completedCrop, scale, rotate],
    )

    const resetUpload = () => {
        Emitter.EventEmitter.emit(Emitter.Event.Action.ResetUploadImage, true)
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
        setCroppedImage(null);
    };

    const handleModalOk = () => {
        if (!croppedImage) return

        // closeModal();
        // callback({
        //     index,
        //     value: croppedImage
        // })
        Emitter.EventEmitter.emit(Emitter.Event.Action.CompleteUploadImage, {
            index,
            value: croppedImage
        })
        closeModal();
    };
    // const [imgSrc, setImgSrc] = useState('');
    const [aspect, setAspect] = useState<number | undefined>(175 / 395)

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    return (
        <div>
            <Modal
                title="Recortar Imagem"
                open={modalVisible}
                footer={<Row justify={'space-between'}>
                    <Button onClick={closeModal}>
                        Fechar
                    </Button>
                    <Button onClick={resetUpload}>
                        Trocar imagem
                    </Button>
                    <Button type='primary' onClick={handleModalOk}>
                        Alterar
                    </Button>
                </Row>}
            >
                <Row justify={'center'}>
                    <Col span={24}>
                        {selectedImage && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={selectedImage}
                                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        )}
                    </Col>
                    <Col>
                        {
                            completedCrop && <canvas
                                ref={previewCanvasRef}
                                style={{
                                    border: '1px solid black',
                                    objectFit: 'contain',
                                    width: completedCrop.width,
                                    height: completedCrop.height,
                                }}
                            />
                        }
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};