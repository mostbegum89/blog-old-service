import React, { useState, useEffect } from 'react'
import { Tabs, Modal, Button,Alert } from 'antd';
import { useSelector } from 'react-redux'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { Input } from 'antd';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import LinearProgress from '@material-ui/core/LinearProgress';
import { setToast } from './ToastMsg'
import {resizeFile,dataURIToBlob} from '../helper/imageResize'


function CreateGroupPost({ group, getpost }) {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);

    //general
    const [postBody, setPostBody] = useState('')
    const [category, setCategory] = useState('')
    const [generalTitle, setGeneralTitle] = useState('')

    //link
    const [linkTitle, setLinkTitle] = useState('')
    const [link, setLink] = useState('')

    //picture
    const [images, setImages] = useState([])
    const [imageTitle, setImageTitle] = useState('')


    const { profile } = useSelector(state => state.auth)



    //general
    let handleGeneral = () => {
        if (!generalTitle) {
            return setToast("Title cannot be empty", "error")
        }
        if (!postBody) {
            return setToast("Post field cannot be empty", "error")
        }
        setLoading(true)
        let newPost = {
            title: generalTitle,
            post: postBody,
            category
        }
        axios.post(`post/${group._id}/general/create`, newPost)
            .then(res => {
                getpost(res.data.post);
                setLoading(false)
                setIsModalVisible(false)
                setGeneralTitle('')
                setPostBody('')
            })
            .catch(err => {
                setLoading(false)
                err && err.response && setToast(err.response.data.err, 'error')
            })
    }

    //link
    let handleLink = () => {
        setLoading(true)
        let newPost = {
            title: linkTitle,
            link
        }
        axios.post(`post/${group._id}/link/create`, newPost)
            .then(res => {
                getpost(res.data.post);
                setLoading(false)
                setIsModalVisible(false)
                setLink('')
                setLinkTitle('')
            })
            .catch(err => {
                err.response && setError(err.response.data)
                setLoading(false)
            })
    }

    //picture
    const handleImg = (e) => {



        setImages([
            ...images,
            e.target.files[0]
        ])
    }
    const deleteImg = (index) => {
        let array = [...images]
        array.splice(index, 1)
        setImages(array)
    }

    const handlepicture = async() => {
        if (!imageTitle) {
            return setToast("Image title cannot be empty", "error")
        }
        if (images.length < 1) {
            return setToast("Minimum 1 image required", "error")
        }
        setLoading(true)
        var formData = new FormData();
        formData.append('title', imageTitle)
        for (let image of images) {
            const imageConverted = await resizeFile(image);
            formData.append('postimg', dataURIToBlob(imageConverted))
        }
        axios.post(`post/${group._id}/picture/create`, formData)
            .then(res => {
                getpost(res.data.post);
                setLoading(false)
                setIsModalVisible(false)
                setImages([])
                setImageTitle('')
            })
            .catch(err => {
                err.response && setError(err.response.data)
                setLoading(false)
            })

    }


    const modules = {
        toolbar: [
            //[{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            //[{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            // ['clean']
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false
        }
    }


    const formats = [
        //'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
    ]



    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <div className="post_box">




            <Modal
                closable={false}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={
                            () => group.posttype === 'general' ? handleGeneral() :
                                group.posttype === 'link' ? handleLink() :
                                    group.posttype === 'picture' ? handlepicture() : null
                        }>
                        Submit
                    </Button>,
                ]}
            >


                {/* if there is any error */}
                {error && <Alert className='mt-3' message={error.error} type="warning" showIcon  />}

                {/* general post modal */}
                {group.posttype === 'general' && <section className='pt-3'>

                    <Input onChange={(e) => setGeneralTitle(e.target.value)} value={generalTitle} placeholder="Title" className='mb-3' />
                    <ReactQuill
                        onChange={(value) => setPostBody(value)}
                        //style={{ height: "20vh" }}
                        modules={modules}
                        formats={formats}
                        value={postBody}
                    />



                    {
                        group.showcategory && <FormControl>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ width: "100px" }}
                            >
                                {
                                    group.category.map((cat, index) => {
                                        return <MenuItem key={index} value={cat}>{cat}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    }
                </section>}



                {/* Link post modal */}
                {group.posttype === 'link' && <section className="pt-2">

                    <Input className='my-2' value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} type="text"  placeholder="Title" />


                    <Input className='my-2' value={link} onChange={(e) => setLink(e.target.value)} type="text" name="textfield" placeholder="Url" />


                </section>}



                {/* Picture Post modal */}
                {group.posttype === 'picture' && <section className="pt-3">


                    <Input value={imageTitle} onChange={(e) => setImageTitle(e.target.value)} type="text" name="textfield" placeholder="Title" />


                    <div className="post_image_list">

                        {
                            images.length > 0 &&
                            images.map((image, index) => {

                                return <div key={index} className="image">
                                    <img className="img" src={URL.createObjectURL(image)}></img>
                                    <div className="img_overlay">
                                        <span onClick={() => deleteImg(index)}>
                                            <i className="fas fa-times"></i>
                                        </span>
                                    </div>
                                </div>

                            })
                        }

                        <div className="img_upload">
                            <input onChange={(e) => handleImg(e)} accept="image/*" style={{ display: "none" }} id="icon-button-file" type="file" />
                            <label htmlFor="icon-button-file">
                                <span color="primary" aria-label="upload picture" component="span">
                                    <i className="fas fa-plus"></i>
                                </span>
                            </label>
                        </div>
                    </div>


                </section>}

            </Modal>


            <div className='field_wrapper'>
                <div className='img'>
                    <img src={profile.profileimg} alt="" className="img-fluid " />
                </div>

                <input readOnly style={{ width: "69%" }} onClick={showModal} id="popup_btn" className="col-md-9 col-sm-9" type="text" placeholder="Create a Post.. " />
                <div>
                    <a className="profile_edit" href="#" data-toggle="tooltip" data-placement="top" title="Upload  Image"><i className="fas fa-image"></i></a>
                    <a className="profile_edit" href="#" data-toggle="tooltip" data-placement="top" title="Share  Link"><i className="fas fa-link"></i></a>
                </div>
            </div>
        </div>
    )
}

export default CreateGroupPost






















//<Modal style={{ marginTop: "20vh" }} show={show} onHide={handleClose}>
//{
//Load && <LinearProgress style={{ marginTop: "5px" }} />
//}
//{/* if there is any error */}


//</div>}









{/* <Modal.Footer>
    {/* general post modal footer */}
//{group.posttype === 'general' && <div style={{ display: "flex" }} class="post_footer">


//<button onClick={() => handleGeneral()} className="btn">Post</button>
//</div>}


//{/* Link post modal footer */}
//{group.posttype === 'link' && <div className="link_footer">

// <button onClick={handleClose} className="btn">Cancel</button>
//<button onClick={() => handleLink()} className="btn">Post</button>
//</div>}

{/* Picture post modal footer */ }
    //{group.posttype === 'picture' && <div className="img_video_footer">
       // <button onClick={handleClose} className="btn">Cancel</button>
        //<button onClick={() => handlepicture()} className="btn">Post</button>
   /// </div>}

//</Modal.Footer>
//</Modal> */}
