import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

import { useRouter } from 'next/router'

import { makeStyles } from '@material-ui/core/styles';

import AboutProfileInfo from '../../components/AboutProfileInfo'

import SkeletonComp from '../../components/SketetonComp'
import PostCard from '../../components/postcard/PostCard'

import { setToast } from '../../components/ToastMsg'
import moment from 'moment'
import Head from "next/head";
import Navbar from '../../components/NavbarComp'



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  input: {
    display: 'none',
  },
}));




function UserProfile() {

  const classes = useStyles();
  const [myposts, SetMyposts] = useState([])
  const [postfetch, setPostfetch] = useState(false)
  const [handleOpen, sethandleOpen] = useState(null)
  const [userProfile, setUserprofile] = useState(false)
  const [profilepic, setProfilePic] = useState(null)
  const [coverpic, setCoverPic] = useState(null)

  const [requests, setRequests] = useState([])
  const [friends, setFriends] = useState([])


  const dispatch = useDispatch()
  const { user, profile ,authenticated} = useSelector(state => state.auth)

  const Router = useRouter()

  // useEffect(() => {
  //   if (userProfile) {
  //     if (userProfile.profileimg.length > 0) {
  //       setProfilePic(userProfile.profileimg)
  //     } else {
  //       setProfilePic('https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png')
  //     }
  //   }
  // }, [userProfile])
  // useEffect(() => {
  //   if (userProfile) {
  //     if (userProfile.coverimg.length > 0) {
  //       setCoverPic(userProfile.coverimg)
  //     } else {
  //       setCoverPic('https://onlymevip.com/postuploads/profilepictures/default_cover.jpg')
  //     }
  //   }
  // }, [userProfile])

  useEffect(() => {
    setPostfetch(true)
    axios.get('/post/userprofile/' + Router.query.username)
      .then(res => {
        SetMyposts(res.data.post);
        setUserprofile(res.data.user);
        setFriends(res.data.user.friends)
        setRequests(res.data.user.requests)
        setPostfetch(false)
      })
      .catch(err => {
        err.response && setToast(err.response.data.error, "error")
        Router.push('/')
      })

  }, [Router])


  const sendRequest = () => {
    axios.put(`/user/addfriend/${userProfile._id}`)
      .then(res => {
        setFriends(res.data.user.friends)
        setRequests(res.data.user.requests)
      })
      .catch(err => {
        err.response && setToast(err.response.data.error, "error")
      })
  }

  const cancelRequest = () => {
    axios.put(`/user/cancelreq/${userProfile._id}`)
      .then(res => {
        setFriends(res.data.user.friends)
        setRequests(res.data.user.requests)
      })
      .catch(err => {
        err.response && setToast(err.response.data.error, "error")
      })
  }


  const unfriend = () => {
    axios.put(`/user/unfriend/${userProfile._id}`)
      .then(res => {
        setFriends(res.data.user.friends)
        setRequests(res.data.user.requests)
      })
      .catch(err => {
        err.response && setToast(err.response.data.error, "error")
      })
  }


  const sendMessage=()=>{
    axios.post(`/chat/findorcreate/${userProfile._id}`)
    .then(res=>{
      dispatch({
        type:"ADD_CHAT",
        payload:res.data.chat
      })
      Router.push(`/chat/${res.data.chat._id}`)
    })
    .catch(err => {
      err.response && setToast(err.response.data.error, "error")
    })
  }

  let deletePost = (id) => {
    axios.patch(`/post/delete/${id}`).then((res) => {
      if (res.data.success) {
        let postarray = [...myposts];
        let index = postarray.findIndex((post) => post._id === id);
        postarray.splice(index, 1);
        SetMyposts(postarray);
        setToast("Post Deleted", "success");
      }
    })
    .catch(err=>{
      setToast("Something went wrong", "error");
    })
  };


  return (
    <>
      <Navbar />
      <Head>
        <meta charSet="utf-8" />
        <title>{`${userProfile && userProfile.first} ${userProfile && userProfile.last} | Flikhs`}</title>
      </Head>

      <div id="profile" className='profile'>
        <section>
          <div>
            <div className="row">
              <div className="col-12">
                <div className="banner_img shadow-sm">
                  <img src={userProfile && userProfile.coverimg ? userProfile.coverimg :"/cover.png"} alt="" style={{ objectFit: "cover" }} />

                  <div className="banner_profile_pic text-center">
                    <div className="img_change">
                      <img style={{ backgroundColor: "white" }} src={userProfile && userProfile.profileimg ? userProfile.profileimg :"/profile.png"} alt="" className="img-fluid profile_avatar" />

                    </div>
                  </div>

                  <h5 style={{ textTransform: "capitalize", fontWeight: "bolder" }}>{userProfile && userProfile.first} {userProfile && userProfile.last}</h5>

                  {
                    authenticated && 
                    <div className="button_req_msg">

                    {
                      requests?.includes(profile._id) ?
                        <button onClick={() => cancelRequest()} className='req_button'>
                          <i className="fas fa-user-minus"></i>
                        Request sent
                    </button>
                        :
                        friends?.includes(profile._id) ?
                          <button onClick={() => unfriend()} className='req_button'>
                            <i className="fas fa-user"></i>
                          Friend
                      </button>
                          :
                          <button onClick={() => sendRequest()} className='req_button'>
                            <i className="fas fa-user-plus"></i>
                              Add friend
                          </button>
                    }

                    <button onClick={()=>sendMessage()} className='req_button msg'>
                      <i className="far fa-comment-alt"></i>
                    Message
                  </button>
                  </div>
                  }
                  



                  {/* <div className="banner_nav">
                    <a href="/" className="active"> Timeline</a>
                     <a href="/"> About</a>
                    <a href="/"> Photo</a> 
                    <a href="/"> Friends</a>
                     <a href="" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">More <i className="fas fa-angle-down"></i></a>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      <a className="dropdown-item" href="/"><i className="fab fa-blogger-b"></i> Blog</a>
                      <a className="dropdown-item" href="/"><i className="fas fa-users"></i> Group</a>
                      <a className="dropdown-item" href="/"><i className="fas fa-play-circle"></i> live</a>
                      <a className="dropdown-item" href="/"><i className="fas fa-video"></i> Video</a>

                    </div>
                  </div> */}

                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- <<<<<<<<< BANNER = (ENDS) <<<<<<<<< --> */}

        {/* <!-- >>>>>>>>> POST PART = (START) >>>>>>>> --> */}
        <section id="post" className="post_part ">
          <div>
            <div className="row">


              {/* <!-- ------------- POP UP ------------------------- --> */}
              <div id="popup" className="popup">

              </div>

              {/* <!-- ------------------- POST IMAGE---------------------- --> */}

              <div className="col-md-8 col-sm-12  ">


                {
                  postfetch ? <><SkeletonComp /> <SkeletonComp /></> :
                    myposts.length > 0 ? myposts.map((post, index) => {
                      return <PostCard deletePost={deletePost} index={index} post={post} key={index} />
                    }) : <p style={{ textAlign: "center" }}>No posts found</p>
                }
              </div>

              {/* <!-- ------------------- POST IMAGE---------------------- --> */}

              {/* <!-- ------------------- ABOUT SIDE BAR ---------------------- --> */}

              <AboutProfileInfo profile={userProfile && userProfile} />
              {/* <!-- ------------------- ABOUT SIDE BAR ---------------------- --> */}


            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default UserProfile






