import React, { useState, useEffect } from "react";
import Link from 'next/link'
import dynamic from 'next/dynamic'

import moment from "moment";
import { useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
//import { ReactTinyLink } from "react-tiny-link";
import { setToast } from "../ToastMsg";
import SendIcon from "@material-ui/icons/Send";
import ShowMore from '../ShowMore'
import FsLightbox from 'fslightbox-react';
import ShareDialogue from '../ShareDialogue'
import LinkPreview from '../LinkPreview'
import PostImages from "./PostImages";
import SharedPost from "./SharedPost";
import ReportPopup from "../ReportPopup";
const { ReactTinyLink } = dynamic(() => import("react-tiny-link"), { ssr: false })

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 100,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    marginBottom: "10px",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    border: "1px solid #f1f1f1",
    marginTop: "-14px"
  },
}));

export default function PostCard({ post, index, deletePost, from, group, hideFooter,hideDropdown }) {
  const classes = useStyles();
  const [singlepost, setSinglePosts] = useState(false);
  const [postuser, setpostuser] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState(false);
  const [createComment, setCreateComment] = useState("");
  const [dialogueopen, setdialogueOpen] = useState(false);
  const [comsend, setcomsend] = useState(false);
  const [sharePopup, setsharePopup] = useState(false);

  const [toggler, setToggler] = useState(false);
  //---report popup
  const [visibleReport, setVisibleReport] = useState(false)



  let { user, profile, authenticated } = useSelector((state) => state.auth);
  let Router = useRouter();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
    setComments(post.comment);
    setSinglePosts(post);
    setpostuser(post.user);
    //console.log(post.user);

  }, [post]);





  let sendComment = () => {
    if (from === "group") {
      if (group.members && !group.members.includes(user._id)) {
        return setToast("You need to join this group", "warning");
      }
    }
    setcomsend(true);
    let formData = new FormData();
    formData.append("comment", createComment);
    axios.post("/comment/create/" + post._id, formData).then((res) => {
      setComments(res.data.comment);
      setCreateComment("");
      setcomsend(false);
    });
  };


  let handleKey = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault()
      sendComment()
    }
  }



  let deleleComment = (commentid) => {
    axios.delete(`/comment/delete/${post._id}/${commentid}`).then((res) => {
      setComments(res.data.comment);
    });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let handleDelete = (id) => {
    deletePost(id);
    handleClose();
  };

  const handledialogueClickOpen = () => {
    setdialogueOpen(true);
  };

  const handledialogueClose = () => {
    setdialogueOpen(false);
  };

  let handlePopupContent = () => {
    setsharePopup(true);
  };

  let handleCloseShare = () => {
    setsharePopup(false);
  };

  let submitReact = (id) => {
    if (from === "group") {
      if (group.members && !group.members.includes(user._id)) {
        return setToast("You need to join this group", "warning");
      }
    }

    if (authenticated) {
      axios.put("post/unlike/" + id).then((res) => {
        setSinglePosts(res.data.post);
      });
    } else {
      return setToast("You need to sign in", "warning");
    }
  };

  let submitunReact = (id) => {
    if (from === "group") {
      if (group.members && !group.members.includes(user._id)) {
        return setToast("You need to join this group", "warning");
      }
    }

    if (authenticated) {
      axios.put("post/like/" + id).then((res) => {
        setSinglePosts(res.data.post);
      });
    } else {
      return setToast("You need to sign in", "warning");
    }
  };




  const PostFooter = () => {
    return (
      <div className="post_like">
        {!authenticated ? null : singlepost && user && singlepost.like.includes(user._id) ? (
          <span
            name="unlike"
            onClick={() => submitReact(singlepost._id, index)}
            className="col-4"
          >
            <i
              style={{ color: "#1d7dff" }}
              className="fas fa-thumbs-up checked"
            ></i>{" "}
              Like {singlepost.like.length}
          </span>
        ) : (
            <span
              name="like"
              onClick={() => submitunReact(singlepost._id, index)}
              className="col-4"
            >
              <i className="fas fa-thumbs-up "></i> Like{" "}
              {singlepost && singlepost.like.length}
            </span>
          )}

        {
          authenticated && (
            <span
              style={{ padding: "0" }}
              onClick={handleExpandClick}
              aria-label="click to comment"
              className="col-4"
            >
              <i className="fas fa-comment-alt"></i> {comments.length} comments
            </span>
          )
        }

        <span onClick={() => handlePopupContent()} class="col-4" post>
          <i className="fas fa-share-alt"></i> Share
          </span>
      </div>
    )
  }


  const PostDropdown=()=>{
    return(
      <div className="col-2 post_dot">
            <a
              type="button"
              className="dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-h"></i>
            </a>
            <div className="dropdown-menu aria-labelledby=" dropdownMenuLink>

              {authenticated &&
                postuser &&
                profile &&
                (profile._id == postuser._id || profile.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(singlepost && singlepost._id)}
                    className="dropdown-item"
                  >
                    <i className="fas fa-trash"></i> Delete Post
                  </button>
                )}
                
              
              <Link href={`/post/${singlepost && singlepost.slug ? singlepost.slug: singlepost._id}`}>
                    <a className="dropdown-item"><i className="fas fa-eye"></i> View Post</a>
                  </Link>
              
              {
                authenticated &&
                postuser &&
                profile &&
                profile._id !== postuser._id && profile.role !== 'admin' && <button onClick={() => setVisibleReport(true)} className="dropdown-item" type="button">
                  <i className="fas fa-flag"></i> Report to site admin
                </button>
              }

              {
                authenticated && 
                postuser &&
                profile &&
                profile._id !== postuser._id &&
                singlepost && 
                singlepost.group.status ? <button onClick={() => setVisibleReport(true)} className="dropdown-item" type="button">
                  <i className="fas fa-flag-checkered"></i> Report to group admin
                </button> : null
              }

            </div>
          </div>
    )
  }

  return (
    <>
    <ReportPopup post={singlepost && singlepost._id} visible={visibleReport} handleCancel={()=>setVisibleReport(false)}/>
      <FsLightbox
        toggler={toggler}
        sources={singlepost && singlepost.image}
      />
      <ShareDialogue
        postId={singlepost && singlepost._id}
        sharePopup={sharePopup}
        handleCloseShare={handleCloseShare}
        data={`post/${singlepost && singlepost.slug}`}
        img={postuser && postuser.profileimg}
        title={postuser &&
          `${postuser.first} ${postuser.last}  ${singlepost.activity ? singlepost.activity : ""
          }`}
      />

      {/* ------ Post card starts------ */}
      <Card className='post_card_section' style={{ marginBottom: "15px", height: "auto" }}>

        <div className="row Post_profile p-0">
          {/* ------ Post card header------ */}
          <div className="col-10 d-flex align-items-center px-4">
            <Link

              href={
                authenticated && profile._id == postuser._id
                  ? `/profile`
                  : `/user/${postuser.username}`
              }
            >
              <a>
                <Avatar
                  src={postuser && postuser.isSuspended ? null : postuser.profileimg}

                  className={`${classes.avatar} postcard_avatar`}
                />
              </a>

            </Link>
            <h6>
              
              <Link
                href={
                  authenticated && profile?._id == postuser._id
                    ? `/profile`
                    : postuser.isSuspended ? '/': `/user/${postuser.username}`
                }
              >
                <a style={{ color: "#050505" }}>{postuser && postuser.isSuspended ?"Flikhs User": `${postuser.first} ${postuser.last} `}</a>
              </Link>




              <span>
                {postuser &&
                  `${singlepost.activity ? singlepost.activity : ""}`}
              </span>
              <span
                style={
                  from === "group"
                    ? { display: "none" }
                    : singlepost && singlepost.group.status == true
                      ? { visibility: "visible", opacity: "1" }
                      : { display: "none" }
                }
              >
                <i className="fas fa-caret-right"></i>
                <Link

                  href={`/g/${singlepost && singlepost.group.status == true
                    ? singlepost.group.name.slug
                    : ""
                    }`}
                >
                  <a style={{ fontWeight: "500" }}>
                    {singlepost && singlepost.group.status == true
                      ? singlepost.group.name.name
                      : ""}
                  </a>
                </Link>
              </span>
              <p>
                {moment(post.date).fromNow()} -{" "}
                <i className="fas fa-globe-americas"></i>{" "}
              </p>
            </h6>
          </div>
          

          {/* -------post dropdown option--------- */}
          {
            !hideDropdown && <PostDropdown />
          }
          
        </div>
        {/* ------------shared post---------- */}
        {singlepost && singlepost.posttype === "share" && <SharedPost singlepost={singlepost} />}

        {/* ------ Post card text------ */}
        {singlepost.title && <h6 style={{ padding: "0 10px",fontWeight:"600" }}>{singlepost.title}</h6>}
        {singlepost.post && <ShowMore post={singlepost.post}></ShowMore>}
        
        {singlepost && singlepost.posttype === "link" ? (
          <div style={{ padding: "10px", paddingTop: "0" }}>

            <LinkPreview
              url={singlepost.link.name}
            />
          </div>
        ) : null}


        {/* ------ Post card images------ */}
        <PostImages singlepost={singlepost} setToggler={()=>setToggler(!toggler)}/>

        {/* ------ Post card footer------ */}
          {
            !hideFooter && <PostFooter />
          }
        
        {/* ------ Post card comment section------ */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Divider />
            {comments &&
              comments.map((comment, index) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      margin: "10px 0",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    key={index}
                  >
                    <div style={{ flex: "1" }}>
                      <Avatar src={comment.commentedby?.profileimg} />
                    </div>
                    <div
                      style={{
                        flex: "6",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="button">
                        {comment.commentedby &&
                          comment.commentedby.first +
                          " " +
                          comment.commentedby.last}
                      </Typography>
                      <Typography variant="caption">{comment.body}</Typography>
                    </div>
                    <div style={{ flex: "1" }}>
                      {authenticated &&
                        profile._id == comment.commentedby?._id && (
                          <DeleteIcon
                            style={{ color: "red", cursor: "pointer" }}
                            fontSize="small"
                            onClick={() => deleleComment(comment._id)}
                          />
                        )}
                    </div>
                  </div>
                );
              })}
            <Divider />

            {authenticated ? (
              <div
                style={{
                  display: "flex",
                  margin: "10px 0",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                key={index}
              >
                <div style={{ flex: "1" }}>
                  <Avatar src={profile && profile.profileimg} />
                </div>
                <div style={{ flex: "6" }}>
                  <input
                    value={createComment}
                    onChange={(e) => setCreateComment(e.target.value)}
                    className="w-100 p-2"
                    style={{ border: "none", borderBottom: "1px solid #ccc" }}
                    type="text"
                    placeholder="write a comment and press enter "
                    onKeyDown={(e) => { handleKey(e) }}
                  />
                </div>
                <Button
                  disabled={comsend ? true : !createComment ? true : false}
                  onClick={() => sendComment()}
                  style={{ flex: "1" }}
                >
                  <SendIcon />
                </Button>
              </div>
            ) : (
                <p>
                  Please signin to post comment
                </p>
              )}
          </CardContent>
        </Collapse>
      </Card>
      {/* ------ Post card ends------ */}
    </>
  );
}
