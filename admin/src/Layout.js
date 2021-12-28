import React, { useState } from 'react';
import Aside from './Aside';
import { FaBars } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { Menu, Space, Dropdown, Avatar ,Button} from 'antd';
import { useSelector } from 'react-redux'
import {
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons';
function Layout({ children }) {
  const { user, authenticated } = useSelector(state => state.auth)
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };


  const handleToggleSidebar = () => {
    setToggled(!toggled);
  };

  const logout = () => {
    Cookies.remove("flikhs_admin");
    window.location.pathname = '/login'
  }

  const menu = (
    <Menu style={{ textAlign: "center"}}>
      <Menu.Item key="0">
        <Button onClick={()=>logout()} type='primary' danger>Logout</Button>
      </Menu.Item>
    </Menu>
  );


  return (
    <div className={`app ${toggled ? 'toggled' : ''}`}>
      <Aside
        image={false}
        collapsed={collapsed}
        rtl={false}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
      />

      <div className='main_layout'>
        <div className='appbar'>
          <div className="appbar_container">
            <div className="collapse_icon toggle" onClick={() => handleToggleSidebar()}>
              <FaBars />
            </div>
            <div className="collapse_icon collapse" onClick={() => handleCollapsedChange()}>
              <FaBars />
            </div>
            {
              authenticated &&
              <Dropdown overlay={menu} trigger={['click']}>
                <Space className='header_menu'>
                  <Avatar size='small' style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                  <h3>{user.first} {user.last} <span>({user.role}) </span></h3>
                  <DownOutlined />
                </Space>
              </Dropdown>
            }

            {/* <button onClick={()=>logout()}>Logout</button> */}
          </div>

        </div>

        <div className="main_container">
          {children}
        </div>




      </div>
    </div>
  );
}

export default Layout;
