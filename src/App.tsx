import { useState } from "react";
import { ConfigProvider, theme } from 'antd';
import { MainRoutes } from "./Routes";

export default function App() {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (<>
    <ConfigProvider theme={{
      algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    }}>
      <div className={isDarkMode ? "base-content dark-theme" : "base-content light-theme"}>
        <MainRoutes />
      </div>
    </ConfigProvider>
  </>
  );
}