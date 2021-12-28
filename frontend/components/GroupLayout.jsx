import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { setToast } from './ToastMsg'
import axios from 'axios'
import Navbar from './NavbarComp'



import Dialog from '@material-ui/core/Dialog';
import Avatar from "@material-ui/core/Avatar";
import CreateGroup from './CreateGroup'
import ShareDialogue from './ShareDialogue'

function GroupLayout({ children, group, catChange, setting }) {
    const { user, profile, authenticated } = useSelector(state => state.auth)
    let dispatch = useDispatch()
    const [show, setShow] = useState(false);

    const [Joined, setJoined] = useState(false)
    const [isCreator, setIsCreator] = useState(false)

    const [CatSelected, setCatSelected] = useState('All')

    const [sharePopup, setsharePopup] = useState(false)
    const [pinned, setPinned] = useState(false)

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => setShow(true);

    useEffect(() => {

        if (group.members && group.members.includes(user._id)) {
            setJoined(true)
        }

        if (group.creator && group.creator == user._id) {
            setIsCreator(true)
        }
    }, [group])

    let handleJoin = (id) => {
        axios.put('/group/join/' + id)
            .then(res => {
                if (res.status == 200) {
                    setJoined(true)
                    window.location.reload()
                }

            })
            .catch(err => {
                err.response && setToast(err.response.data.error, "error")
            })
    }

    let handleLeave = (id) => {
        axios.put('/group/leave/' + id)
            .then(res => {
                if (res.status == 200) {
                    setJoined(false)
                    window.location.reload()
                }
            })
            .catch(err => {
                err.response && setToast(err.response.data.error, "error")
            })
    }

    let handleCatSelect = (cat) => {
        setCatSelected(cat)
        catChange(cat)
    }

    let handleCloseShare = () => {
        setsharePopup(false)
    }



    const [scrolled, setScrolled] = React.useState(false);
    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 250) {
            setScrolled(true);
        }
        else {
            setScrolled(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
    })
    let navbarClasses = ['navbar2'];
    if (scrolled && !setting) {
        navbarClasses.push('scrolled');
    }

    const handlePin = (id) => {
        axios.put('/user/setpinnedgroup/' + id)
            .then(res => {
                dispatch({
                    type: 'SET_PROFILE',
                    payload: res.data.user

                })
                setToast("Shortcuts updated", "success")
            })
            .catch(err => {
                err.response && setToast(err.response.data.error, "error")
            })
    }


    useEffect(() => {

        if (authenticated && profile.pinnedgroups && group) {
            let index = profile.pinnedgroups.findIndex(g => g._id == group._id)

            if (index === -1) {
                setPinned(false)
            } else {
                setPinned(true)
            }
        }
    }, [profile, group])

    return (
        <>
            <Navbar />
            <div>
                <CreateGroup handleClose={handleClose} show={show} />

                <ShareDialogue hideTimeline={true} title={group && group.name} img={group.groupimg ? group.groupimg : '/groupholder.png'} sharePopup={sharePopup} handleCloseShare={handleCloseShare} data={group && `g/${group.slug}`}/>


                <div id='group_container'>
                    {/* <Dialog style={{ overflow: "hidden" }} onClose={handleCloseShare} aria-labelledby="simple-dialog-title" open={sharePopup}>

                        <section id="share_popup" className="share_popup_part ">
                            <div className="">
                                <div className="row">
                                    <div className="col-12 p-0">
                                        <div className="popup_box shadow-sm">
                                            <h6> Share the Post on   <span onClick={() => setsharePopup(false)} className="close text-right"><i className="fas fa-times"></i> </span></h6>
                                            <div className="social_icon">
                                                <div className="icons">
                                                    <a target='_blank' href={`https://www.facebook.com/sharer/sharer.php?u=https://fb-clone-front.herokuapp.com/g/${group && group.slug}`}><i style={{ background: "#0359ce" }} className="fab fa-facebook-f"></i> </a>
                                                    <p>Facebook</p>
                                                </div>
                                                <div className="icons">
                                                    <a target='_blank' href={`https://twitter.com/intent/tweet?url=https://fb-clone-front.herokuapp.com/g/${group && group.slug}`}><i style={{ background: "#5a95e5" }} className="fab fa-twitter"></i> </a>
                                                    <p>Twitter</p>
                                                </div>
                                                <div className="icons">
                                                    <a target='_blank' href={`https://plus.google.com/share?url=https://fb-clone-front.herokuapp.com/g/${group && group.slug}`}><i style={{ background: "#f72323" }} className="fab fa-google-plus-g"></i> </a>
                                                    <p>Google+</p>
                                                </div>
                                                <div className="icons">
                                                    <a target='_blank' href=""><i style={{ background: "#1aaf6a" }} className="fab fa-whatsapp"></i> </a>
                                                    <p>WhatsApp</p>
                                                </div>
                                                <div className="icons">
                                                    <a target='_blank' href={`http://pinterest.com/pin/create/button/?url=https://fb-clone-front.herokuapp.com/g/${group && group.slug}`}><i style={{ background: "#c91313" }} className="fab fa-pinterest-p"></i> </a>
                                                    <p>Pinterest</p>
                                                </div>
                                                <div className="icons">
                                                    <a target='_blank' href={`https://www.linkedin.com/shareArticle?mini=true&url=https://fb-clone-front.herokuapp.com/g/${group && group.slug}`}><i style={{ background: "#115580" }} className="fab fa-linkedin-in"></i> </a>
                                                    <p>Linkdin</p>
                                                </div>
                                                <div className="icons">
                                                    <a target='_blank' href={`https://telegram.me/share/url?url=https://fb-clone-front.herokuapp.com/g/${group && group.slug}`}><i style={{ background: "#4695ff" }} className="fab fa-telegram-plane"></i> </a>
                                                    <p>Telegram</p>
                                                </div>
                                            </div>


                                            <div className="user">
                                                <img src={group.groupimg ? group.groupimg : '/groupholder.png'} alt="" className="img-fluid" />
                                                <h4>{group && group.name} </h4>
                                                <p>{group && group.privacy}</p>

                                            </div>
                                            {/*           
          <div className="share_btn">
            <button className="btn" href="#">Share</button>


          </div> 

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </Dialog> */}




                    <section id="body" className="body_part">
                        <div className="container-fluid">
                            <div className="row">
                                <div style={{ padding: "0" }} className="col-md-12 col-sm-12">
                                    {/* <!-- -------------------------------------------------------------------------- -->
             <!-- >>>>>>>>> BANNER = (START) >>>>>>>> --> */}
                                    <section id="banner" className="banner_group_timeline_part">
                                        <div className="container shadow-sm">
                                            <div className="row">
                                                <div style={{ position: "relative" }} className="col-lg-12 col-md-12 p-0">
                                                    <img src={group.groupcover ? group.groupcover : '/grouplistcover.png'} alt="" className="img-fluid" />

                                                    <h4><Link href={`/g/${group && group.slug}`}>
                                                        <a style={{ color: "white" }}>{group && group.name} </a>
                                                    </Link>
                                                        {
                                                            !authenticated ? null : Joined ? <button onClick={() => handleLeave(group._id)} style={{ background: "red", color: "white" }} className="btn mx-3">Leave <i className="fas fa-sign-out-alt"></i></button> : <button onClick={() => handleJoin(group._id)} className="btn mx-3">join <i className="fas fa-sign-in-alt"></i></button>
                                                        }
                                                        <span className='privacy' style={{ display: "block", fontSize: "12px", fontWeight: "300" }}>( {group && group.privacy} )</span>
                                                    </h4>

                                                    <div className="profile_pic">
                                                        <Link href={`/g/${group && group.slug}`}>
                                                            <a>
                                                                <img style={{ background: "white" }} src={group.groupimg ? group.groupimg : '/groupholder.png'} alt="" className="img-fluid" />
                                                            </a>
                                                        </Link>



                                                    </div>
                                                    <div className="cover_dropdown">
                                                        {
                                                            (group.showcategory && !setting) && <div className="dropdown">
                                                                <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    {CatSelected} <i className="fas fa-caret-down"></i>
                                                                </button>
                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                    <button onClick={() => handleCatSelect('All')} className="dropdown-item"  >All</button>
                                                                    {
                                                                        group.category && group.category.map((cat, index) => {
                                                                            return <button onClick={() => handleCatSelect(cat)} className="dropdown-item" key={index} >{cat}</button>
                                                                        })
                                                                    }

                                                                </div>
                                                            </div>
                                                        }
                                                        {
                                                            isCreator && <div className="dropdown">
                                                                <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    Notifications <i className="far fa-bell"></i>
                                                                </button>
                                                            </div>
                                                        }


                                                        <div className="dropdown">
                                                            <button onClick={() => setsharePopup(true)} className="btn ">
                                                                Share <i className="fas fa-share-alt"></i>
                                                            </button>
                                                        </div>

                                                        {
                                                            !authenticated ? null : <div className="dropdown">
                                                                <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    More <i className="fas fa-ellipsis-h"></i>
                                                                </button>
                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                    <a className="dropdown-item" href="#">
                                                                        <i className="fas fa-user-plus"></i> Invite Members
                                                                    </a>
                                                                    <a style={{ cursor: "pointer" }} onClick={() => handlePin(group && group._id)} className="dropdown-item" >
                                                                        <i className="fas fa-map-pin"></i>
                                                                        {pinned ? "Remove from shortcurts" : "Pin to shortcuts"}
                                                                    </a>
                                                                    {
                                                                        isCreator && <Link href={`/g/${group && group.slug}/setting`}>
                                                                            <a className="dropdown-item"><i className="fas fa-edit"></i> Edit Group Settings</a>
                                                                        </Link>

                                                                    }
                                                                    
                                                                        <span style={{cursor:"pointer"}} onClick={()=>handleShow()} className="dropdown-item"><i className="far fa-plus-square"></i> Create new Group</span>
                                                                  
                                                                </div>
                                                            </div>
                                                        }

                                                    </div>
                                                </div>



                                            </div>
                                        </div>
                                    </section>

                                    <header className={navbarClasses.join(" ")}>
                                        <div className="container header">
                                            <div className="header_name d-flex align-items-center">
                                                <a href="#body"><Avatar src={group.groupimg ? group.groupimg : '/groupholder.png'} /></a>
                                                <h5><a href="#body">{group && group.name}</a></h5>
                                            </div>
                                            <nav className="navigation">
                                                {
                                                    authenticated && <ul>
                                                        <li>
                                                            <a href="#">Invite</a>
                                                            <span style={{cursor:"pointer"}} onClick={()=>handleShow()}><a>Create new group</a></span>
                                                        </li>
                                                    </ul>
                                                }

                                            </nav>
                                        </div>
                                    </header>

                                    {children}
                                </div>
                                {/* <!--  SIDE BAR START  --> */}
                                {/* <div className="col-md-2 "> */}
                                {/* <div class="sidebar_part">
                                <h5>Side Bar</h5>
                            </div> */}
                                {/* </div> */}
                                {/* <!--  SIDE BAR ENDS  --> */}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default GroupLayout
