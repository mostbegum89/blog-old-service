import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import ToastMsg from './ToastMsg'

import Cookies from "js-cookie";
import Link from 'next/link'
import ScrollToTop from './ScrollToTop'
import LoginModal from "./LoginModal";
import { socket } from '../helper/auth'

import { Menu, Dropdown, List, Avatar, Badge } from 'antd';
import moment from "moment";
import axios from "axios";

export default function NavbarComp() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [query, setQuery] = useState(null)

  let { user, authenticated, profile } = useSelector((state) => state.auth);
  let { chats } = useSelector((state) => state.chat);
  let { notifications } = useSelector((state) => state.notification);
  let dispatch = useDispatch();
  let Router = useRouter()


  let logOut = () => {
    Cookies.remove("flikhs_auth");
    dispatch({
      type: "LOGOUT",
    });
    window.location.pathname = "/";
  };




  useEffect(() => {
    if (socket) {
      socket.on("newmessage", data => {
        console.log(data);
        dispatch({
          type: "UPDATE_CHATS",
          payload: data.chat
        })
      })

      socket.on("newnotification", data => {
        console.log(data);
        dispatch({
          type: "NEW_NOTIFICATION",
          payload: data.notification
        })
      })
    }
  }, [socket])


  useEffect(() => {
    if (query !== null) {
      const delayed = setTimeout(() => {
        Router.push(`/?query=${query}`)
      }, 300)
      return () => clearTimeout(delayed)
    }

  }, [query])

  const findOtherUser = (users) => {
    let otherUser = users.filter(u => u._id !== profile._id)[0]
    return otherUser
  }

  const messageLists = (
    <List
      // header={<p>Messages</p>}
      style={{ width: "400px", maxHeight: "50vh", overflowY: "auto",padding:"0" }}
      size="large"
      itemLayout="horizontal"
      dataSource={chats}
      renderItem={chat => (
        <List.Item className={chat.toRead.includes(profile._id)?"unread":""} onClick={() => Router.push(`/chat/${chat._id}`)} style={{ cursor: "pointer" }}>
          <List.Item.Meta
            avatar={<Avatar src={findOtherUser(chat.users).profileimg} />}
            title={<span>{findOtherUser(chat.users).first} {findOtherUser(chat.users).last}</span>}
            description={
              !chat.latestMessage ? <>New chat</> :
                chat.latestMessage?.type === 'image' ?
                  <>
                    {chat.latestMessage.sender.first}: Image
                  </>
                  :
                  <>
                    {chat.latestMessage.sender.first}: {chat.latestMessage.content}
                  </>
            }
          />
        </List.Item>
      )}
    />
  );



  const generateNotificationText=(type,user)=>{
    let text = ""
    if(type === "like"){
        text = `${user.first} ${user.last} liked your post`
    }
    if(type === "comment"){
        text = `${user.first} ${user.last} commented on your post`
    }
    return text
  }


  const generateNotificationUrl=(type,entityId)=>{
    let url = ""
    if(type === "like"){
      url = `/post/${entityId}`
    }
    if(type === "comment"){
      url = `/post/${entityId}`
    }
    return url
  }

  
  const notificationMarkRead=(noti)=>{
    axios.patch(`/notification/markread/${noti._id}`)
    .then(res=>{
      dispatch({
        type:"UPDATE_NOTIFICATION",
        payload:res.data.notification
      })
        //console.log(res.data.notification);
        Router.push(generateNotificationUrl(noti.notificationType,noti.entityId))
    })
    .catch(err=>{
      console.log(err);
    })
  }


  const notificationLists = (
    <List
      // header={<p>Messages</p>}
      style={{ width: "400px", maxHeight: "50vh", overflowY: "auto",padding:"0" }}
      size="small"
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={noti => (
        <List.Item onClick={()=>notificationMarkRead(noti)} className={!noti.opened?"unread":""}  style={{ cursor: "pointer" }}>
          <List.Item.Meta
            avatar={<Avatar src={noti.userFrom.profileimg} />}
            title={<span >{generateNotificationText(noti.notificationType,noti.userFrom)}</span>}
            description={moment(noti.createdAt).fromNow() }
          />
          
        </List.Item>
      )}
    />
  );

  return (
    <>
      <LoginModal show={showLoginModal} onCloseModal={() => setShowLoginModal(false)} />
      <ToastMsg />
      <ScrollToTop />
      <header className="header_part shadow-sm">
        <div className="container-fluid ">
          <nav className="navbar navbar-expand">
            {/* <button
              style={{ color: "#080808" }}
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fas fa-bars"></i>
            </button> */}
            <a className="navbar-brand" href="/">
              <img src='/logo.png' alt="" className="img-fluid desktop_logo" />
              <img src='/flikhs-icon.png' alt="" className="mobile_logo" />
            </a>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <div className="dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  type="button"
                  id="dropdownMenu2"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-bars"></i>
                </a>
                <div
                  className="dropdown-menu sidebar-offcanvas overflow-auto left_dropdown"
                  role="navigation"
                  aria-labelledby="dropdownMenu2 "
                  style={{ width: "200px", borderRadius: "5px" }}
                >
                  <p className='m-0'>MY FEEDS</p>
                  <Link href="/">
                    <a className="dropdown-item"><i className="fas fa-home"></i>Home</a>
                  </Link>
                  <li>
                    <Link href="/articles">
                      <a className="dropdown-item"><i className="fas fa-chart-line"></i>Articles</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blogs">
                      <a className="dropdown-item"><i className="fas fa-chart-bar"></i>Blogs</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/groups">
                      <a className="dropdown-item"><i className="fas fa-list-ol"></i>Groups</a>
                    </Link>
                  </li>
                  {authenticated && <>
                    <p className='m-0'>Shortcuts</p>

                    {
                      profile && profile.pinnedgroups && profile.pinnedgroups.length > 0 && profile.pinnedgroups.map((group, index) => {
                        return <li key={index}>
                          <Link href={`/g/${group.slug}`}>
                            <a className="dropdown-item">
                              <img src={group.groupimg ? group.groupimg : '/groupholder.png'} alt="" className="img-fluid" />
                              {group.name}
                            </a>
                          </Link>
                        </li>
                      })
                    }

                    {

                      profile && profile.pinnedblogs && profile.pinnedblogs.length > 0 && profile.pinnedblogs.map((blog, index) => {
                        return <li key={index}>
                          <Link href={`/b/${blog.slug}`}>
                            <a className="dropdown-item">
                              <img src={blog.blogImage ? blog.blogImage : '/groupholder.png'} alt="" className="img-fluid" />
                              {blog.name}
                            </a>
                          </Link>
                        </li>
                      })

                    }

                    {
                      profile && profile.pinnedgroups && profile.pinnedgroups.length > 0 ? null :
                        profile && profile.pinnedblogs && profile.pinnedblogs.length > 0 ? null :
                          <li className="dropdown-item">No shourts fround</li>
                    }




                    <p className='m-0'>Other</p>
                    <li>
                      <Link href="/user/setting">
                        <a className="dropdown-item"><i className="fas fa-user-cog"></i>User settings</a>
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-envelope"></i>
                      Messege
                    </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="fas  fa-edit"></i>Create post
                    </a>
                    </li>
                  </>
                  }
                </div>
              </div>
              <li className="nav-item">
                <input
                  className="form-control nav_search"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </li>

              <ul className="navbar-nav menu mobile-res">
                <li className="nav-item">
                  <Link href="/">
                    <a className="nav_icon"><i className="fas fa-home"></i></a>
                  </Link>
                </li>
              </ul>

              {authenticated && (
                <>
                  <Link href="/profile">
                    <a className='navbar_profile_img'>
                      <img style={{ height: "25px", width: "25px", borderRadius: "50%" }} src={profile.profileimg} alt="" className="img-fluid" />{" "}
                    </a>
                  </Link>
                  <Link href="/profile">

                    <a className="nav_profile menu">
                      <img style={{ height: "18px", width: "18px" }} src={profile.profileimg||"profile.png"} alt="" className="img-fluid" />{" "}
                      <span></span>{profile.first} {profile.last}
                    </a>
                  </Link>



                  <ul className="navbar-nav menu mobile-res">
                    <li className="nav-item">

                      <Dropdown overlay={messageLists} trigger={['click']}>
                        <a className="ant-dropdown-link nav_icon mobile-res" onClick={e => e.preventDefault()}>
                          <Badge count={chats && chats.filter(chat=>chat.toRead.includes(profile._id)).length}>
                            <i className="fas fa-comment-dots"></i>
                          </Badge>

                        </a>
                      </Dropdown>

                    </li>
                  </ul>

                  <ul className="navbar-nav menu mobile-res ">
                    <li className="nav-item">
                      <a href="" className="nav_icon">
                        <i className="fas fa-envelope"></i>
                      </a>
                    </li>
                  </ul>

                  <ul className="navbar-nav menu mobile-res">
                    <li className="nav-item">

                      <Dropdown overlay={notificationLists} trigger={['click']}>
                        <a className="ant-dropdown-link nav_icon mobile-res" onClick={e => e.preventDefault()}>
                          <Badge count={notifications && notifications.filter(noti=>!noti.opened).length}>
                          <i className="fas fa-bell"></i>
                          </Badge>

                        </a>
                      </Dropdown>

                    </li>
                  </ul>


                </>
              )}


              {authenticated ? <div className="dropdown menu">
                <a
                  className="nav-link dropdown-toggle dropdown_icon"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-caret-down"></i>
                </a>

                <div className="dropdown-menu dropleft" aria-labelledby="dropdownMenu2">
                  <Link href="/profile">
                    <a className="dropdown-item"><i className="fas fa-user-circle"></i> My profile</a>
                  </Link>
                  <Link href="/user/setting">
                    <a className="dropdown-item"><i className="fas fa-user-cog"></i> User Setting</a>
                  </Link>
                  <a className="dropdown-item" href="#">
                    <i className="fas fa-question"></i> Questions
                    </a>
                  <button onClick={() => logOut()} className="dropdown-item">
                    <i className="fas fa-sign-out-alt "></i> Logout
                    </button>
                </div>

              </div> : ""
                // <button className='login_button' onClick={()=>setShowLoginModal(true)}>Login</button>
              }
            </div>
          </nav>
        </div>
      </header>

    </>
  );
}
