import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { Card } from 'antd'
import { useRouter } from 'next/router'

import { makeStyles } from "@material-ui/core/styles";

import Populargroup from "../components/GroupList";

import { setToast } from "../components/ToastMsg";
import AboutProfileInfo from '../components/AboutProfileInfo'
import Navbar from '../components/NavbarComp'


import Hidden from "@material-ui/core/Hidden";
import SkeletonComp from "../components/SketetonComp";

import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import CircularProgress from "@material-ui/core/CircularProgress";
import PostCard from '../components/postcard/PostCard'
import CreatePost from '../components/createpost'
import protectedRoute from '../helper/protectedRoute'
import { dataURIToBlob, resizeFile } from '../helper/imageResize'
import Head from 'next/head'


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  input: {
    display: "none",
  },
}));

function Profile() {
  const classes = useStyles();
  const Router = useRouter()
  const [myposts, SetMyposts] = useState([]);
  const [postfetch, setPostfetch] = useState(false);
  const [changeprofileimg, setchangeprofileimg] = useState(null);
  const [changecoverimg, setchangecoverimg] = useState(null);
  const [images, setImages] = useState([]);
  const [handleOpen, sethandleOpen] = useState(null);
  const [create, setCreate] = useState("");
  const [profileimgload, setprofileimgload] = useState(false);
  const [coverimgload, setcoverimgload] = useState(false);
  // const [profilepic, setProfilePic] = useState(null);
  // const [coverpic, setCoverPic] = useState(null);

  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])

  const [tab, setTab] = useState("timeline")

  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.auth);


  // useEffect(() => {
  //   if (Object.keys(profile).length) {
  //     if (profile.profileimg.length > 0) {
  //       setProfilePic(profile.profileimg);
  //     } else {
  //       setProfilePic('/profile.png');
  //     }
  //   }
  // }, [profile]);
  // useEffect(() => {
  //   if (Object.keys(profile).length) {
  //     if (profile.coverimg.length > 0) {
  //       setCoverPic(profile.coverimg);
  //     } else {
  //       setCoverPic('/grouplistcover.png');
  //     }
  //   }
  // }, [profile]);

  let fetchPost = (post) => {
    SetMyposts([post, ...myposts]);
  };

  useEffect(() => {
    if (changecoverimg != null) {
      (async function () {
        setcoverimgload(true);
        const imageConverted = await resizeFile(changecoverimg);
        let formData = new FormData();
        formData.append("coverimg", dataURIToBlob(imageConverted));
        axios.put("/user/coverimg", formData).then((res) => {
          SetMyposts([res.data.post, ...myposts]);
          dispatch({
            type: "SET_PROFILE",
            payload: res.data.user,
          });
          setcoverimgload(false);
        });
      })();

    }
  }, [changecoverimg]);

  useEffect(() => {
    if (changeprofileimg != null) {

      (async function () {
        setprofileimgload(true);
        const imageConverted = await resizeFile(changeprofileimg);
        let formData = new FormData();
        formData.append("profileimg", dataURIToBlob(imageConverted));
        axios.put("/user/profileimg", formData).then((res) => {
          SetMyposts([res.data.post, ...myposts]);
          dispatch({
            type: "SET_PROFILE",
            payload: res.data.user,
          });
          setprofileimgload(false);
        });
      })();





    }
  }, [changeprofileimg]);

  useEffect(() => {
    axios.get("/post/mypost").then((res) => {
      SetMyposts(res.data.post);
      setPostfetch(false);
    });
  }, []);

  let deletePost = (id) => {
    axios.patch(`/post/delete/${id}`).then((res) => {
      if (res.data.success) {
        let postarray = [...myposts];
        let index = postarray.findIndex((post) => post._id === id);
        postarray.splice(index, 1);
        SetMyposts(postarray);
        setToast("Post Deleted", "error");
      }
    });
  };


  useEffect(() => {
    axios.get('/user/getfriends')
      .then(res => {
        setFriends(res.data.friends)
        setRequests(res.data.requests)
      })
  }, [Router])

  const cancelRequest = (id) => {
    axios.put(`/user/rejectreq/${id}`)
      .then(res => {
        let reqArray = [...requests]
        let index = reqArray.findIndex(r=>r._id === id)
        reqArray.splice(index,1)
        setRequests(reqArray)
      })
      .catch(err => {
        err.response && setToast(err.response.data.error, "error")
      })
  }


  const confirmRequest = (id) => {
    axios.put(`/user/confirmfriend/${id}`)
      .then(res => {
        let reqArray = [...requests]
        let index = reqArray.findIndex(r=>r._id === id)
        reqArray.splice(index,1)
        setRequests(reqArray)
      })
      .catch(err => {
        err.response && setToast(err.response.data.error, "error")
      })
  }

  const unfriend = (id) => {
    axios.put(`/user/unfriend/${id}`)
      .then(res => {
        let fndArray = [...friends]
        let index = fndArray.findIndex(r=>r._id === id)
        fndArray.splice(index,1)
        setFriends(fndArray)
      })
      .catch(err => {
        err.response && setToast(err.response.data.error, "error")
      })
  }



  const PostList = () => (
    <>
      <div className="post_box row shadow-sm rounded">
        <CreatePost fetchPost={fetchPost} />
      </div>
      {/* <!-- ------------------- POST BOX---------------------- --> */}

      {postfetch ? (
        <>
          <SkeletonComp /> <SkeletonComp />
        </>
      ) : myposts.length > 0 ? (
        myposts.map((post, index) => {
          return (
            <PostCard
              deletePost={deletePost}
              index={index}
              post={post}
              key={index}
            />
          );
        })
      ) : (
        <p style={{ textAlign: "center" }}>No posts found</p>
      )}
    </>
  )







  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{`${profile && profile.first} ${profile && profile.last} | Flikhs`}</title>

      </Head>
      <Navbar />
      <div id="profile" className='profile'>
        <section>
          <div>
            <div className="row">
              <div className="col-12">
                <div className="banner_img shadow-sm">
                  <img src={profile && profile.coverimg ? profile.coverimg :"/cover.png"} style={{ objectFit: "cover" }} />

                  <a
                    className="profile_edit"
                    href="#"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Edit  Profile"
                  >
                    <i className="fas fa-edit"></i>
                  </a>

                  <div className="dropdown">
                    <div>
                      <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file15"
                        type="file"
                        onChange={(e) => setchangecoverimg(e.target.files[0])}
                      />
                      <label htmlFor="contained-button-file15">
                        <IconButton
                          className="cover_btn_change"
                          color="primary"
                          size="small"
                          component="span"
                        >
                          {coverimgload ? (
                            <CircularProgress color="secondary" size={30} />
                          ) : (
                            "Change Photo"
                          )}
                        </IconButton>
                      </label>
                    </div>
                  </div>
                  <div className="banner_profile_pic text-center">
                    <div className="img_change">
                      <img
                        style={{ backgroundColor: "white" }}
                        src={profile && profile.profileimg ? profile.profileimg :"/profile.png"}
                        alt=""
                        className="img-fluid profile_avatar"
                      />
                      <div className="profile_pic_overlay">
                        {" "}
                        <a
                          href="#"
                          data-toggle="tooltip"
                          data-placement="Right"
                          title="Change Profile Picture"
                        >
                          <input
                            onChange={(e) =>
                              setchangeprofileimg(e.target.files[0])
                            }
                            accept="image/*"
                            className={classes.input}
                            id="icon-button-file11"
                            type="file"
                          />
                          <label htmlFor="icon-button-file11">
                            <IconButton
                              color="primary"
                              aria-label="upload picture"
                              component="span"
                            >
                              {profileimgload ? (
                                <CircularProgress size={30} />
                              ) : (
                                <PhotoCamera />
                              )}
                            </IconButton>
                          </label>
                        </a>
                      </div>
                    </div>
                  </div>
                  <h5
                    style={{ textTransform: "capitalize", fontWeight: "bolder" }}
                  >
                    {profile.first} {profile.last}
                  </h5>
                  <div className="banner_nav">
                    <Link href="/profile">
                      <a className={!Router.query.tab && 'active'}> Timeline</a>
                    </Link>
                    <Link href="/profile?tab=friends">
                      <a className={Router.query.tab == "friends" && 'active'}> Friends</a>
                    </Link>
                    <Link href="/profile?tab=requests">
                      <a className={Router.query.tab == "requests" && 'active'}> Requests</a>
                    </Link>

                    {/* <a
                    href=""
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    More <i className="fas fa-angle-down"></i>
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <a className="dropdown-item" href="/">
                      <i className="fab fa-blogger-b"></i> Blog
                    </a>
                    <a className="dropdown-item" href="/">
                      <i className="fas fa-users"></i> Group
                    </a>
                    <a className="dropdown-item" href="/">
                      <i className="fas fa-play-circle"></i> live
                    </a>
                    <a className="dropdown-item" href="/">
                      <i className="fas fa-video"></i> Video
                    </a>
                  </div> */}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
        {/* <!-- <<<<<<<<< BANNER = (ENDS) <<<<<<<<< --> */}

        {/* <!-- >>>>>>>>> POST PART = (START) >>>>>>>> --> */}
        <section id="post" className="post_part">
          <div>
            <div className="row">
              {/* <!-- ------------- POP UP ------------------------- --> */}
              <div id="popup" className="popup"></div>

              <div className="col-md-8 col-sm-12  ">
                {/* <!-- ------------------- POST BOX---------------------- --> */}
                {
                  Router.query.tab === 'friends' ?
                    <Card title='Friends'>
                      <div className="friends">
                      {
                            friends.length > 0 ?
                            friends.map((fnd, index) => (
                              <div key={index} className="f_card">
                                <img src={fnd.profileimg} alt=""/>
                                <span>
                                  <Link  href={`/user/${fnd.username}`}>
                                  <a> {fnd.first} {fnd.last}</a>
                                  </Link>
                                 </span>
                                <div className="action">
                                    <button onClick={()=>unfriend(fnd._id)} className='reject'>Remove</button>
                                </div>
                              </div>
                            )):
                            <p>No friends found</p>
                          }
                      </div>
                    </Card> :
                    Router.query.tab === 'requests' ?
                      <Card title="Requests" >
                        <div className="friends">
                          {
                            requests.length > 0 ?
                            requests.map((req, index) => (
                              <div key={index} className="f_card">
                                <img src={req.profileimg} alt=""/>
                                <span>
                                  <Link  href={`/user/${req.username}`}>
                                  <a> {req.first} {req.last}</a>
                                  </Link>
                                 </span>
                                <div className="action">
                                    <button onClick={()=>confirmRequest(req._id)}>Accept</button>
                                    <button onClick={()=>cancelRequest(req._id)} className='reject'>Reject</button>
                                </div>
                              </div>
                            )):
                            <p>No requests found</p>
                          }

                        </div>
                      </Card> :
                      <PostList />
                }

              </div>

              {/* <!-- ------------------- ABOUT SIDE BAR ---------------------- --> */}

              <AboutProfileInfo profile={profile && profile} />
              {/* <!-- ------------------- ABOUT SIDE BAR ---------------------- --> */}
            </div>
          </div>
        </section>


      </div>
    </>
  );
}

export default protectedRoute(Profile);
