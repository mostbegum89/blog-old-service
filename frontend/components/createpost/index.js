import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import PostAddIcon from '@material-ui/icons/PostAdd';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import LinkIcon from '@material-ui/icons/Link';
import { setToast } from '../ToastMsg'
import { Tabs, Modal, Button } from 'antd';
import GeneralPost from './GeneralPost'
import ImagePost from './ImagePost'
import LinkPost from './LinkPost'

const { TabPane } = Tabs;

import {dataURIToBlob,resizeFile } from '../../helper/imageResize'






function CreatePost({ fetchPost }) {
  const [loading, setLoading] = useState(false)

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('general')

  const { profile } = useSelector(state => state.auth)

  //general Post
  const [generalTitle, setGeneralTitle] = useState('')
  const [generalPost, setGeneralPost] = useState('')

  //image post
  const [imageTitle, setImageTitle] = useState('')
  const [images, setImages] = useState([])

  //link post
  const [linkTitle, setLinkTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')



  //general post action
  const handlePostGeneral = () => {
  
    if (!generalTitle) {
      return setToast("Post title cannot be empty", "error")
    }
    setLoading(true)
    let data = {
      title: generalTitle,
      post: generalPost
    }

    axios.post('/post/general/create', data)
      .then(res => {
        if (res.status === 200) {
          fetchPost(res.data.post)
          setGeneralTitle('')
          setGeneralPost('')
          setLoading(false)
          setIsModalVisible(false)
          setToast("Post created", "success")
        }

      })
      .catch(err => {
        setLoading(false)
        err && err.response && setToast(err.response.data.err, 'error')
      })
  }


  //image post action
  let deleteImg = (index) => {
    let array = [...images]
    array.splice(index, 1)
    setImages(array)
  }
  const handlePostImg = (e) => {

    setImages([
      ...images,
      e.target.files[0]
    ])
  }

  const handlePostImage = async() => {
    if (!imageTitle) {
      return setToast("Image title cannot be empty", "error")
    }
    if (images.length < 1) {
      return setToast("Minimum 1 image required", "error")
    }

    setLoading(true)
    
    let formData = new FormData();
    formData.append('title', imageTitle)
    for (let image of images) {
      const imageConverted = await resizeFile(image);
      formData.append('postimg', dataURIToBlob(imageConverted))
    }

    axios.post('/post/image/create', formData)
    .then(res => {
      if (res.status === 200) {
        fetchPost(res.data.post)
        setImageTitle('')
        setImages([])
        setLoading(false)
        setIsModalVisible(false)
        setToast("Post created", "success")
      }

    })
    .catch(err => {
      setLoading(false)
      err && err.response && setToast(err.response.data.err, 'error')
    })
  }

  //Link post action
  const handlePostLink = () => {
   
    if (!linkUrl) {
      return setToast("Link Url is required", "error")
    }
    setLoading(true)
    let data = {
      title: linkTitle,
      url: linkUrl
    }

    axios.post('/post/link/create', data)
      .then(res => {
        if (res.status === 200) {
          fetchPost(res.data.post)
          setLinkTitle('')
          setLinkUrl('')
          setLoading(false)
          setIsModalVisible(false)
          setToast("Post created", "success")
        }

      })
      .catch(err => {
        setLoading(false)
        err && err.response && setToast(err.response.data.err, 'error')
      })
  }


  const handleOkSubmit = () => {
    if (currentTab === 'general') {
      handlePostGeneral()
    }
    if (currentTab === 'image') {
      handlePostImage()
    }
    if (currentTab === 'link') {
      handlePostLink()
    }

  }


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChangeTab = (e) => {
    setCurrentTab(e);
  }


  return (
    <div className="post_box_container">

      <Modal

        closable={false}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
        </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOkSubmit}>
            Submit
        </Button>,
        ]}
      >
        <Tabs onChange={handleChangeTab} size="large" activeKey={currentTab} centered>
          <TabPane tab={
            <span className='d-flex align-items-center'>
              <PostAddIcon />
               Post
          </span>
          }
            key="general">
            <GeneralPost
              handleGeneralTitle={(e) => setGeneralTitle(e.target.value)}
              generalTitle={generalTitle}
              generalPost={generalPost}
              handleGeneralPost={(value) => setGeneralPost(value)}

            />
          </TabPane>
          <TabPane tab={
            <span className='d-flex align-items-center'>
              <CropOriginalIcon />
             Image
        </span>
          }
            key="image">
            <ImagePost
              handleImageTitle={(e) => setImageTitle(e.target.value)}
              imageTitle={imageTitle}
              handlePostImg={handlePostImg}
              deleteImg={deleteImg}
              images={images}
            />
          </TabPane>
          <TabPane tab={
            <span className='d-flex align-items-center'>
              <LinkIcon />
             Link
        </span>
          }
            key="link">
            <LinkPost
              handleLinkTitle={(e) => setLinkTitle(e.target.value)}
              linkTitle={linkTitle}
              handleLinkUrl={(e) => setLinkUrl(e.target.value)}
              linkUrl={linkUrl}
            />
          </TabPane>
        </Tabs>
      </Modal>









      <div className='field_wrapper'>
        <div className='img'>
          <img src={profile.profileimg||'profile.png'} alt="" className="img-fluid " />
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

export default CreatePost
{/* <button onClick={()=>removeimg(index)}>X</button> */ }