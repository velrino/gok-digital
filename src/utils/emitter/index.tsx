import { EventEmitter } from 'fbemitter';

export const Emitter = {
    EventEmitter: new EventEmitter(),
    Event: {
        Action: {
            ClickUploadImage: 'ClickUploadImage',
            AfterClickUploadImage: 'AfterClickUploadImage',
            ResetUploadImage: 'ResetUploadImage',
            CompleteUploadImage: 'CompleteUploadImage',
            Notification: 'Notification'
        },
    }
}
