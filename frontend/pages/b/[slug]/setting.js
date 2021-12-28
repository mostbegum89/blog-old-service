import React, { useState, useEffect } from 'react'

import { setToast } from '../../../components/ToastMsg'

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Backdrop from '@material-ui/core/Backdrop';
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import moment from 'moment'
import { useSelector } from 'react-redux'
import Navbar from '../../../components/NavbarComp'

import SecondHeader from '../../../components/SecondHeader'
import CreateBlog from '../../../components/CreateBlog';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function BlogSetting() {
    const [backdrop, setBackdrop] = useState(false)
    const [show, setShow] = useState(false);
    const { user, authenticated } = useSelector(state => state.auth)
    const [categories, setCategories] = useState([])
    const [showCategory, setShowCategory] = useState(true)

    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')

    const [blog, setBlog] = useState(null)

    let Router = useRouter()
    let slug  = Router.query.slug


    const fetchdata = () => {
        setBackdrop(true)
        axios.get('/blog/single/' + slug)
            .then(res => {
                if (res.data.sucess) {
                    // console.log(res.data.blog)
                    setBlog(res.data.blog)
                    setName(res.data.blog.name)
                    setUrl(res.data.blog.slug)
                    setDescription(res.data.blog.description)
                    
                    setShowCategory(res.data.blog.showCategory)
                    //console.log(res.data.showCategory);
                    if (user._id !== res.data.blog.creator) {
                        Router.push(`/b/${res.data.blog.slug}`)
                    }
                }
                setBackdrop(false)

            })
            .catch(err => {
                err.response && Router.push('/')
                setBackdrop(false)
            })
    }
    useEffect(() => {

        fetchdata()

    }, [])



    const handleSave = () => {
        setBackdrop(true)
        let data = {
            name,
            slug: url,
            description,
            showCategory
        }
        axios.put('/blog/edit/' + slug, data)
            .then(res => {
                setBlog(res.data.blog)
                setName(res.data.blog.name)
                setUrl(res.data.blog.slug)
                setDescription(res.data.blog.description)
                setBackdrop(false)
                setToast("Updated successfully", "success")
                Router.push(`/b/${res.data.blog.slug}/setting`)
            })
            .catch(err => {
                setBackdrop(false)
                err && err.response && setToast(err.response.data.error, 'error')
            })
    }

    //blog image

    let handleGroupImg = (img) => {
        setBackdrop(true)
        if (img) {
            let formData = new FormData()
            formData.append('blogimg', img)
            axios.put('/blog/blogimg/' + slug, formData)
                .then(res => {
                    setBlog(res.data.blog)
                    setBackdrop(false)
                })
                .catch(err => {
                    setBackdrop(false)
                    err && err.response && setToast(err.response.data.error, 'error')
                })
        }
    }



    const handleClose = () => {

        setShow(false)
    };
    const handleShow = () => setShow(true);


    return (
        <>
        <Navbar />
        <div id="blog_home">
            <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
                <CircularProgress color="primary" />
            </Backdrop>

            <SecondHeader blog={blog && blog.name} />

            <CreateBlog handleClose={handleClose} show={show}/>


            {/* <!-- >>>>>>>>>>>>>>> BANNER = (START) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> --> */}
            <section id='blog' className="blog_home_banner_part">
                <div className="blog_home_overlay"></div>
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <div >
                                <Link href={`/b/${blog && blog.slug}`}>
                                    <a> <img className="blog_home_profile_img" src={blog && blog.blogImage ? blog.blogImage : '/profile.png'} alt="" />
                                    </a>
                                   
                                </Link>
                                <Link  href={`/b/${blog && blog.slug}`}>
                                    <a className="blog_home_profile_img_a">{blog && blog.name}</a>
                                    </Link>
                            </div>
                            <nav style={{ marginTop: "20px" }} className="navbar navbar-expand-lg">
                                <a className="navbar-toggler ml-auto" data-toggle="collapse" data-target="#navbarNav">
                                    <i style={{ color: "#eee" }} className="fas fa-bars"></i>
                                </a>
                                <div className="collapse navbar-collapse" id="navbarNav">
                                    <ul className="navbar-nav ml-auto">
                                        <li className="nav-item">
                                            <Link href={`/blog/${blog && blog.slug}`}>
                                               <a  style={{ color: "white" }} className="nav-link"> Home</a>
                                            </Link>
                                        </li>

                                        <li className="nav-item">
                                            <a style={{ color: "white" }} className="nav-link" href="#">About</a>
                                        </li>

                                        <li className="nav-item">
                                            <a style={{ color: "white" }} className="nav-link" href="#">Contact</a>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a style={{ color: "white" }} className="nav-link" href="" data-toggle="dropdown">Share <i className="fas fa-share-alt"></i></a>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <a className="dropdown-item" href="#"><i className="fab fa-facebook-f"></i> Facebook</a>
                                                <a className="dropdown-item" href="#"><i className="fab fa-twitter"></i> Twitter</a>
                                                <a className="dropdown-item" href="#"><i className="fab fa-google-plus-g"></i> Google+</a>
                                                <a className="dropdown-item" href="#"><i className="fab fa-pinterest-p"></i> Pinterest</a>
                                            </div>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a style={{ color: "white" }} className="nav-link" href="" data-toggle="dropdown">More <i className="fas fa-angle-down"></i></a>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <a className="dropdown-item" href="#"> <i className="fas fa-user-plus"></i> Invite Members</a>
                                                <a className="dropdown-item" href="#"> <i className="fas fa-thumbtack"></i> Pin to Shortcuts</a>
                                                <a className="dropdown-item" href="#"> <i className="fas fa-edit"></i> Edit Blog Settings</a>
                                                <a onClick={()=>handleShow()} className="dropdown-item" href="#"> <i className="fas fa-plus-square"></i> Create new Blog</a>
                                            </div>
                                        </li>

                                    </ul>
                                </div>
                            </nav>

                        </div>
                    </div>
                </div>
            </section>


            {/* <!-- <<<<<<<<<<<<<< POST = (ENDS) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< --> */}
            <div style={{ marginTop: "0" }} className="blog_home_main_body shadow-sm">




                <div style={{ marginTop: "0" }} className="main_bar shadow-sm">


                    {/* Change blog img */}
                    <div className="row group_name border-bottom">
                        <div className="col-md-4 col-sm-4 py-3">
                            <h6>Blog Photo : </h6>
                        </div>
                        <div className="col-md-8 col-sm-8 py-3">
                            <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="contained-button-file20"
                                onChange={(e) => handleGroupImg(e.target.files[0])}
                                type="file"
                                
                            />
                            <label htmlFor="contained-button-file20">
                                <Button startIcon={<PhotoCamera />} size="small" variant="contained" color="primary" component="span">
                                    Upload
                                </Button>
                            </label>

                        </div>
                    </div>


                    {/* <!-- ---------------------------------------------------------------- -->
        <!-- >>>>>>>>> BLOG NAME = (START) >>>>>>>> --> */}
                    <div className="row  border-bottom">
                        <div className="col-md-4 col-sm-4 py-3">
                            <h6>Blog Name : </h6>
                        </div>
                        <div className="col-md-8 col-sm-8 py-3">
                            <input className='form-control w-50' value={name} onChange={(e) => setName(e.target.value)} type="text" name="textfield" placeholder="Your Blog Name" />
                        </div>
                    </div>


                    {/*<!-- >>>>>>>>> BLOG URL = (START) >>>>>>>> --> */}
                    <div className="row  border-bottom">
                        <div className="col-md-4 col-sm-4 p-3">
                            <h6>Blog URL : </h6>
                        </div>
                        <div className="col-md-8 col-sm-8 py-3">
                            <p>https://www.flikhs.com/b/blogname</p> 
                            <input className='form-control w-50' value={url} onChange={(e) => setUrl(e.target.value)} type="text" name="textfield" placeholder="Change Your URL" />
                        </div>
                    </div>


                    {/*-- >>>>>>>>> BLOG Descriptions   = (START) >>>>>>>>  */}
                    <div className="row border-bottom">
                        <div className="col-md-4 col-sm-4 py-3">
                            <h6>Blog Descriptions : </h6>
                        </div>
                        <div className="col-md-8 col-sm-8 py-3">
                            <textarea className='form-control w-50' value={description} onChange={(e) => setDescription(e.target.value)} name="textarea" placeholder="TextArea"></textarea>
                        </div>
                    </div>

                    {/*-- >>>>>>>>> BLOG Category   = (START) >>>>>>>>  */}
                    <div className="row ">
                        <div className="col-md-4 col-sm-4 py-3">
                            <h6>Blog Category : </h6>
                        </div>
                        <div className="col-md-8 col-sm-8 py-3">
                        <RadioGroup aria-label="gender" name="gender1" value={showCategory} onChange={(e) => setShowCategory(e.target.value == 'true')}>
                            <FormControlLabel value={true} control={<Radio size='small' />} label="Show" />
                            <FormControlLabel value={false} control={<Radio size='small' />} label="Hide" />
                        </RadioGroup>
                        </div>
                    </div>

                    {/* <div className="border-bottom text-center">
                        <Button onClick={() => setOpenDialogue(true)} startIcon={<DeleteIcon />} variant="contained" color="secondary" className='m-3'>Delete group</Button>
                    </div> */}



                    {/*<!-- >>>>>>>> Save  = (START) >>>>>>>> --> */}
                    <div className=" save text-right">
                        <button onClick={() => handleSave()} className="btn"><i className="fas fa-save"></i> SAVE</button>
                    </div>

                </div>



            </div>

        </div>
        </>
    )
}

export default BlogSetting
