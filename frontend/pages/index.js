import React, { useState, useEffect } from "react";

import axios from "axios";
import { useRouter } from "next/router";
import Link from 'next/link'
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

//import CreatePost from "../components/CreatePost";
import { setToast } from "../components/ToastMsg";
import SkeletonComp from "../components/SketetonComp";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

import ShortProfileSidebar from "../components/ShortProfileSidebar";
import TrendingGroups from "../components/TrendingGroups";
import TrandingBlogs from "../components/TrandingBlogs";
import Navbar from '../components/NavbarComp'
import PostCard from '../components/postcard/PostCard'
import Head from "next/head";
import CreatePost from '../components/createpost'

import LoginModal from '../components/LoginModal'

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
}));

function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [fetchingMore, setFatchingMore] = useState(false)


  const [handleOpen, sethandleOpen] = useState(null);
  const [postfetch, setPostfetch] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(null)

  const classes = useStyles();
  let Router = useRouter();

  let { authenticated, profile } = useSelector((state) => state.auth);

  const handleClose = () => {
    setOpen(false);
  };

  let gosigninpage = () => {
    setOpen(false);
    Router.push("/signin");
  };

  let gosignuppage = () => {
    setOpen(false);
    Router.push("/signup");
  };

  let fetchPost = (post) => {
    setPosts([post, ...posts]);
  };

  const fetchAllPost = (query) => {
    //console.log(page)
    setFatchingMore(true);
    axios.get(`/post/get?query=${query}&page=${page}`)
      .then((res) => {
        if (res.status === 200) {

          setPosts([...posts, ...res.data.post]);
          setFatchingMore(false);
          setPage(page + 1)
          if (res.data.post.length !== 15) {
            setHasMore(false)
          }
        }
      })
      .catch(err => {
        setFatchingMore(false)
        alert("something went wrong")
      })
  }


  let deletePost = (id) => {
    axios.patch(`/post/delete/${id}`).then((res) => {
      if (res.data.success) {
        let postarray = [...posts];
        let index = postarray.findIndex((post) => post._id === id);
        postarray.splice(index, 1);
        setPosts(postarray);
        setToast("Post Deleted", "success");
      }
    })
    .catch(err=>{
      setToast("Something went wrong", "error");
    })
  };


  useEffect(() => {
    if (window.location.search.split('=')[1] === undefined || window.location.search.split('=')[1] === '') {
      setPage(0)
      setQuery(null)
      setPostfetch(true);
      axios.get(`/post/get?query=${undefined}&page=${0}`)
        .then((res) => {
          if (res.status === 200) {

            setPosts(res.data.post);
            setPostfetch(false);
            setPage(page + 1)
            if (res.data.post.length !== 15) {
              setHasMore(false)
            } else {
              setHasMore(true)
            }
          }
        })
        .catch(err => {
          setPostfetch(false);
          alert("something went wrong")
        })


    } else if (window.location.search.split('=')[1]) {
      setPage(0)
      let query = window.location.search.split('=')[1]
      setPostfetch(true);
      axios.get(`/post/get?query=${query}&page=${0}`)
        .then((res) => {
          if (res.status === 200) {

            setPosts(res.data.post);
            setPostfetch(false);
            setPage(page + 1)
            //console.log(res.data.post.length)
            if (res.data.post.length !== 15) {
              setHasMore(false)
            } else {
              setHasMore(true)
            }
          }
        })
        .catch(err => {
          setPostfetch(false);
          alert("something went wrong")
        })
      setQuery(query.replace(/%20/g, ' '))
      //console.log(query)

    }

  }, [Router])

  const handleMore = () => {

    fetchAllPost(query || undefined)
  }

  return (
    <>
      <Navbar />
      <Head>
        <meta charSet="utf-8" />
        <title>Flikhs</title>
        <meta property="og:title" content="Flikhs" key="title" />
        <meta property="og:description" content="Flikhs is a social media and blogging platform. Create an account or log into Flikhs. Connect with friends, family, and other people you know. Share your knowledge, photos, videos, send messages, and get updates." />
        <meta property="og:image" content="/logo.png" />


        {/* Twitter Meta Tags */}
        <meta property="twitter:card" content="summary_large_image" />
        {/* <meta property="twitter:url" content="https://flikhs-nextjs.vercel.app/g/my-group" /> */}
        <meta property="twitter:title" content="Flikhs" />
        {/* <meta property="twitter:description" content={groupserver ? groupserver.description : group ? group.description : ""} /> */}
        <meta property="twitter:image" content="/logo.png" />
      </Head>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"You need to signin"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={gosigninpage} color="primary">
            signin
          </Button>
          <Button onClick={gosignuppage} color="primary" autoFocus>
            signup
          </Button>
        </DialogActions>
      </Dialog>

      <section id="home_post">
        <div className='home'>
          <div className="row col-md-12 col-sm-12">
            <div className="col-md-8 col-sm-8  ">
              {/* <!-- ------------------- POST BOX---------------------- --> */}

              {authenticated && (
                <div className="post_box row shadow-sm rounded">
                  <CreatePost fetchPost={fetchPost} />
                </div>
              )}

              {
                query && <div className="post_box row shadow-sm rounded">
                  <span>Showing results for <strong>"{query && decodeURI(query)}"</strong></span>
                </div>
              }

              {/* <!-- ------------------- POST BOX---------------------- --> */}

              {postfetch ? (
                <>
                  <SkeletonComp /> <SkeletonComp />
                </>
              ) : posts.length === 0 ? (
                "No posts found"
              ) : (
                posts.map((post, index) => {
                  return (
                    <PostCard
                      deletePost={deletePost}
                      index={index}
                      post={post}
                      key={index}
                      from='home'
                    />
                  );
                })
              )}
              <div style={{ textAlign: "center", margin: "10px 0" }}>
                {
                  hasMore ? <button className='loadMoreButton' onClick={() => handleMore()}>
                    {fetchingMore ? 'Loading...' : "Load more"}
                  </button> :
                    <p>No more posts to fetch</p>
                }
              </div>


            </div>

            {/* <!-- ------------------- POST IMAGE---------------------- -->


                 <!-- ------------------- ABOUT SIDE BAR ---------------------- --> */}

            <div className="col-md-4 col-sm-12">
              {
                authenticated && <ShortProfileSidebar />
              }

              <div className="shadow-sm rounded">
                <TrendingGroups />

              </div>
              <div className="shadow-sm rounded">

                <TrandingBlogs />
              </div>
            </div>

          </div>
        </div>
      </section>
      <LoginModal />
    </>
  );
}

export default Home;
