import React, { useState, useRef, useEffect, DependencyList } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import ReactCrop, { Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { UploadOutlined } from '@ant-design/icons';
import { Emitter } from '../../utils/emitter';

const TO_RADIANS = Math.PI / 180;

export function useDebounceEffect(fn: () => void, waitTime: number, deps?: DependencyList) {
  useEffect(() => {
    const timeout = setTimeout(fn, waitTime);
    return () => clearTimeout(timeout);
  }, deps);
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

const defaultData = {
  selectedImage:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII='
};

export const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(defaultData.selectedImage);
  const [crop, setCrop] = useState<Crop>({
    height: 395,
    unit: 'px',
    width: 195,
    x: 25,
    y: 25
  });

  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>({
    height: 395,
    unit: 'px',
    width: 175,
    x: 0,
    y: 0
  });
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [index, setIndex] = useState(0);
  const previewEditor = useRef<any>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement |null>(null);

  useEffect(() => {
    Emitter.EventEmitter.addListener(
      Emitter.Event.Action.AfterClickUploadImage,
      (params: any) => {
        setModalVisible(true);
        setSelectedImage(params.data);
        setIndex(params.index);
        handleImage();
      }
    );
  }, []);

  function canvasPreview(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    scale = 1,
    rotate = 0
  ) {
    const ctx = canvas?.getContext('2d');

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    const rotateRads = rotate * TO_RADIANS;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    ctx.translate(-cropX, -cropY);

    ctx.translate(centerX, centerY);

    ctx.rotate(rotateRads);

    ctx.scale(scale, scale);

    ctx.translate(-centerX, -centerY);

    ctx.filter = 'grayscale(100%)';

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();

    canvas.toBlob((blob) => {
      setCroppedImage(blob);
    });
  }

  function handleImage() {
    canvasPreview(
      imgRef.current as HTMLImageElement,
      previewCanvasRef.current as HTMLCanvasElement,
      completedCrop,
      scale,
      rotate
    );
  }

  useDebounceEffect(() => {
    handleImage();
  }, 100, [completedCrop, scale, rotate]);

  const resetUpload = () => {
    Emitter.EventEmitter.emit(Emitter.Event.Action.ResetUploadImage, true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(defaultData.selectedImage);
    setCroppedImage(null);
  };

  const handleModalOk = () => {
    if (!croppedImage) return;

    Emitter.EventEmitter.emit(Emitter.Event.Action.CompleteUploadImage, {
      index,
      value: croppedImage
    });
    closeModal();
  };

  const [aspect, setAspect] = useState<number | undefined>(175 / 395);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  return (
    <div>
      <Modal
        title="Recortar Imagem"
        visible={modalVisible}
        footer={
          <Row justify="space-between">
            <Button onClick={closeModal}>Fechar</Button>
            <Button onClick={resetUpload}>Trocar imagem</Button>
            <Button type="primary" onClick={handleModalOk}>
              Alterar
            </Button>
          </Row>
        }
      >
        <Row justify="center">
          <Col span={24}>
            {selectedImage && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                ref={previewEditor}
              >
                <img
                  ref={imgRef}
                  id="image"
                  alt="Crop me"
                  src={selectedImage}
                  style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </Col>
          <Col>
            <canvas
              ref={previewCanvasRef}
              id="canvas"
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: completedCrop?.width || 0,
                height: completedCrop?.height || 0
              }}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
