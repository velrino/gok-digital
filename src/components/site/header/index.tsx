import { useState } from 'react';
import { Drawer, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

export const SiteHeaderComponent = () => {
    const [visible, setVisible] = useState(false);
    const isDesktop = useMediaQuery({ minWidth: 768 });

    const showDrawer = () => {
        setVisible(true);
    };

    const closeDrawer = () => {
        setVisible(false);
    };

    const renderDesktopNavbar = () => {
        return (
            <Menu mode="horizontal" className='bg-secondary'>
                <Menu.Item key="1">Home</Menu.Item>
                <Menu.Item key="2">Serviços</Menu.Item>
                <Menu.Item key="3">Sobre</Menu.Item>
            </Menu>
        );
    };

    const renderMobileNavbar = () => {
        return (
            <div className='header-navbar-responsive'>
                <div className="header-navbar-title">Ventura</div>
                <div className="header-menu-responsive" onClick={showDrawer}>
                    <MenuOutlined className='header-menu-icon' />
                </div>
                <Drawer
                    title="Ventura"
                    placement="right"
                    onClose={closeDrawer}
                    open={visible}
                    width={300}
                    headerStyle={{ background: 'black' }}
                    bodyStyle={{ padding: 0, background: 'black' }}
                >
                    <Menu mode="inline" className='bg-secondary'>
                        <Menu.Item key="1">Home</Menu.Item>
                        <Menu.Item key="2">Serviços</Menu.Item>
                        <Menu.Item key="3">Sobre</Menu.Item>
                    </Menu>
                </Drawer>
            </div>
        );
    };

    return (
        <div className='header-navbar'>
            {isDesktop ? renderDesktopNavbar() : renderMobileNavbar()}
        </div>
    );
};
