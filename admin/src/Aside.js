import React from 'react';
import {useSelector} from 'react-redux'
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import {FaBug,FaUserLock,FaBook, FaBookOpen,FaRegSun, FaTachometerAlt, FaShoppingCart, FaListAlt, FaUserFriends } from 'react-icons/fa';

import sidebarBg from './assets/bg1.jpg';
import { Link } from 'react-router-dom'

const Aside = ({ image, collapsed, rtl, toggled, handleToggleSidebar }) => {
const {user} = useSelector(state => state.auth)
  return (
    <ProSidebar
      image={false}
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign:"center"
          }}
        >
          FLIKHS ADMIN
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem
            icon={<FaTachometerAlt />}

          >
            <Link to='/'>Dashboard</Link>
          </MenuItem>
          <MenuItem icon={<FaListAlt />}><Link to='/categories'>Categories</Link> </MenuItem>

           <SubMenu
            title="Articles"
            icon={<FaBookOpen />}
          >
            <MenuItem><Link to='/articles/approved'>Approved Articles</Link></MenuItem>
            <MenuItem><Link to='/articles/pending'>Pending Articles</Link></MenuItem>
          </SubMenu>

          <MenuItem icon={<FaBook />}><Link to='/blogs'>Blogs</Link> </MenuItem>

          <MenuItem icon={<FaUserFriends />}><Link to='/users'>Users</Link> </MenuItem>
          <SubMenu
            title="Admin And Moderators"
            icon={<FaUserLock />}
          >
            <MenuItem><Link to='/admin-moderator/all'>All Admin-Moderators</Link></MenuItem>
            {
              user.role === 'admin' && <MenuItem><Link to='/add-new'>Add New</Link></MenuItem>
            }
            
          </SubMenu>

          <MenuItem icon={<FaBug />}><Link to='/reports'>Reports</Link> </MenuItem>



          {/* <SubMenu
            title="Doctors Info"
            icon={<FaBookOpen />}
          >
            <MenuItem><Link to='/doctor/country-city'>Country/City</Link></MenuItem>
            <MenuItem><Link to='/doctor/departments'>Departments</Link></MenuItem>
            <MenuItem><Link to='/doctor/pending'>Pending Doctor</Link></MenuItem>
            <MenuItem><Link to='/doctor/approved'>Approved Doctor</Link></MenuItem>
            <MenuItem><Link to='/doctor/reviews'>Doctor Reviews</Link></MenuItem>
            <MenuItem><Link to='/doctor/articles'>Doctor Articles</Link></MenuItem>
          </SubMenu> */}








          {/* <MenuItem icon={<FaCreditCard />}><Link to='/brands'>Brands</Link> </MenuItem>
          <MenuItem icon={<FaRegClock />}><Link to='/campaigns'>Campaigns</Link> </MenuItem> */}



          {/* <SubMenu
            title="Products"
            icon={<FaShoppingCart />}
          >
            <MenuItem><Link to='/product/create'>Create Product</Link></MenuItem>
            <MenuItem><Link to='/product/productlist'>All products</Link></MenuItem>
            <MenuItem><Link to='/product/attribute'>Attribute</Link></MenuItem>
            <MenuItem><Link to='/product/bulk-import'>Bulk Import</Link></MenuItem>
            <MenuItem><Link to='/product/bulk-export'>Bulk Export</Link></MenuItem>

          </SubMenu>
          <MenuItem icon={<FaStackExchange />}><Link to='/product-reviews'>Product Reviews</Link> </MenuItem>
          <MenuItem icon={<FaMoneyCheck />}><Link to='/orders'>Orders</Link> </MenuItem>
          
          <MenuItem icon={<FaDollarSign />}><Link to='/payment-method'>Payment Methods</Link> </MenuItem>

          <SubMenu
            title="Website Setup"
            icon={<FaDesktop />}
          >
            <MenuItem><Link to='/website/slider'>Homepage Slider</Link></MenuItem>
            <MenuItem><Link to='/website/analytics'>Analytics</Link></MenuItem>


          </SubMenu>


          <SubMenu
            title="Settings"
            icon={<FaRegSun />}
          >
            <MenuItem><Link to='/settings/smtp'>SMTP</Link></MenuItem>
            <MenuItem><Link to='/settings/image-storage'>Image Storage</Link></MenuItem>
            <MenuItem><Link to='/settings/live-chat'>Live Chat</Link></MenuItem>
            <MenuItem><Link to='/settings/import-demo'>Import Demo</Link></MenuItem>


          </SubMenu> */}
        </Menu>
      </SidebarContent>

      {/* <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >

          DCELL
        </div>
      </SidebarFooter> */}
    </ProSidebar>
  );
};

export default Aside;
