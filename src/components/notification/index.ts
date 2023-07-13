import { notification } from 'antd';

export enum NotificationTypeEnum {
    error = "error",
    info = "info",
    success = "success",
    warning = "warning"
}

export interface INotificationProps {
    type: NotificationTypeEnum;
    title: string;
    message: string;
    duration?: number;
    i18n?: boolean;
}

export const showNotification = (props: INotificationProps) => {
    const { type, title, message, duration = 3 } = props;
    notification[type]({
        message: title,
        description: message,
        duration: duration,
    });
};