import React, { useState, useRef, DependencyList, useEffect } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import ReactCrop, { Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { UploadOutlined } from '@ant-design/icons';
import { Emitter } from '../../utils/emitter';

export const ImageUploaderInput = ({ index }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e?.target?.files) return;

        const file = e.target.files[0];

        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            if (event.target && event?.target?.result) {
                Emitter.EventEmitter.emit(Emitter.Event.Action.AfterClickUploadImage, {
                    data: event.target.result,
                    index
                })
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const openModal = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };


    useEffect(() => {
        Emitter.EventEmitter.addListener(Emitter.Event.Action.ResetUploadImage, () => {
            openModal();
        })
    }, []);

    return (
        <div>
            <Button icon={<UploadOutlined />} onClick={openModal} />
            <input
                type="file"
                accept="image/png;image/jpeg"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
            />
        </div>
    );
};