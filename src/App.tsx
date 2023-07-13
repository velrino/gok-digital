import { useState, useEffect } from "react";
import { ConfigProvider, theme } from 'antd';
import { MainRoutes } from "./Routes";
import { Emitter } from "./utils/emitter";
import { INotificationProps, NotificationTypeEnum, showNotification } from "./components/notification";

export default function App() {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    Emitter.EventEmitter.addListener(Emitter.Event.Action.Notification, (properties: INotificationProps) => showNotification({
      type: properties.type ? properties.type : NotificationTypeEnum.error,
      title: properties.title,
      message: (properties.message) ? properties.message : "",
      duration: (properties.duration) ? properties.duration : 5,
    }));
  }, [])

  return (<>
    <ConfigProvider theme={{
      algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      token: {
        colorPrimary: '#4caf50',
        wireframe: false,
      },
    }}>
      <div className={isDarkMode ? "base-content dark-theme" : "base-content light-theme"}>
        <MainRoutes />
      </div>
    </ConfigProvider>
  </>
  );
}