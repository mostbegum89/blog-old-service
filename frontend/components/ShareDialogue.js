import React from 'react'
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import { useSelector } from 'react-redux'
import axios from 'axios'
import { setToast } from './ToastMsg';


function ShareDialogue({ sharePopup, handleCloseShare, data, img, title, postId,articleLink }) {
  const { authenticated } = useSelector(state => state.auth)

  const shareTimeline = () => {
    axios.post('/post/sharepost', { postId })
      .then(res => {
        setToast("shared to your timeline", "success")
        handleCloseShare()
      })
      .catch(err => {
        setToast("something went wrong", "error")
      })
  }


  const shareTimelineLink = () => {
   //console.log(window.location);
    let data = {
      url: window.location.origin+"/"+articleLink
    }

    axios.post('/post/link/create', data)
      .then(res => {
        if (res.status === 200) {
          setToast("shared to your timeline", "success")
          handleCloseShare()
        }

      })
      .catch(err => {
        setToast("something went wrong", "error")
      })
  }


  return (
    <>
      <Dialog
        style={{ overflow: "hidden" }}
        onClose={handleCloseShare}
        aria-labelledby="simple-dialog-title"
        open={sharePopup}

      >
        <section id="share_popup" className="share_popup_part ">
          <div>
            <div className="row p-0">
              <div className="col-12 p-0">
                <div className="popup_box">
                  <h6>
                    {" "}
                    Share the Post on{" "}
                    {/* <span
                      onClick={() => setsharePopup(false)}
                      className="close text-right"
                    >
                      
                    </span> */}
                  </h6>
                  <div className="social_icon">
                    {
                      authenticated && postId && <div onClick={() => shareTimeline()} className="icons">
                        <a href='#' >
                          <img src='/timeline.png'></img>{" "}
                        </a>
                        <p>Timeline</p>
                      </div>
                    }
                    {
                      authenticated && articleLink && <div onClick={() => shareTimelineLink()} className="icons">
                        <a href='#' >
                          <img src='/timeline.png'></img>{" "}
                        </a>
                        <p>Timeline</p>
                      </div>
                    }

                    <div className="icons">
                      <a
                        target="_blank"
                        href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_CLIENT}/${data}`}
                      >
                        <i
                          style={{ background: "#0359ce" }}
                          className="fab fa-facebook-f"
                        ></i>{" "}
                      </a>
                      <p>Facebook</p>
                    </div>
                    <div className="icons">
                      <a
                        target="_blank"
                        href={`https://twitter.com/intent/tweet?url=${process.env.NEXT_PUBLIC_CLIENT}/${data
                          }`}
                      >
                        <i
                          style={{ background: "#5a95e5" }}
                          className="fab fa-twitter"
                        ></i>{" "}
                      </a>
                      <p>Twitter</p>
                    </div>

                    <div className="icons">
                      <a target="_blank"
                        href={`https://api.whatsapp.com/send?text=${process.env.NEXT_PUBLIC_CLIENT}/${data
                          }`}
                      >
                        <i
                          style={{ background: "#1aaf6a" }}
                          className="fab fa-whatsapp"
                        ></i>{" "}
                      </a>
                      <p>WhatsApp</p>
                    </div>
                    <div className="icons">
                      <a
                        target="_blank"
                        href={`http://pinterest.com/pin/create/button/?url=${process.env.NEXT_PUBLIC_CLIENT}/${data
                          }`}
                      >
                        <i
                          style={{ background: "#c91313" }}
                          className="fab fa-pinterest-p"
                        ></i>{" "}
                      </a>
                      <p>Pinterest</p>
                    </div>
                    <div className="icons">
                      <a
                        target="_blank"
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${process.env.NEXT_PUBLIC_CLIENT}/${data
                          }`}
                      >
                        <i
                          style={{ background: "#115580" }}
                          className="fab fa-linkedin-in"
                        ></i>{" "}
                      </a>
                      <p>Linkdin</p>
                    </div>
                    <div className="icons">
                      <a
                        target="_blank"
                        href={`https://telegram.me/share/url?url=${process.env.NEXT_PUBLIC_CLIENT}/${data
                          }`}
                      >
                        <i
                          style={{ background: "#4695ff" }}
                          className="fab fa-telegram-plane"
                        ></i>{" "}
                      </a>
                      <p>Telegram</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }} className="user">
                    {/* <img
                      src={img}
                      alt=""
                      className="img-fluid"
                    /> */}
                    <Avatar style={{ marginRight: "10px" }} src={img} />
                    <h4>
                      {title}
                    </h4>
                    {/* <p>
                      {moment(post.date).fromNow()} -{" "}
                      <i className="fas fa-map-marker-alt"></i> Dhaka,
                      Bangladesh
                    </p> */}
                  </div>
                  {/* <div className="share_btn">
                    <button className="btn" href="#">
                      Share
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Dialog>
    </>
  )
}

export default ShareDialogue
