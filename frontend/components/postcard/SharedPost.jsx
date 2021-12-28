import React,{useEffect, useState} from 'react'
import axios from 'axios'
import PostCard from './PostCard'
import { setToast } from '../ToastMsg'
import SkeletonComp from '../SketetonComp'

function SharedPost({singlepost}) {
    //console.log(singlepost);
    const [sharedPost, setSharedPost] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        axios.get(`/post/singlepost/${singlepost.sharedPost?.slug}`)
        .then(res=>{
            setSharedPost(res.data.post)
            setLoading(false)
        })
        .catch(err=>{
            setLoading(false)
            //console.log(err && err.response && err.response.data);
            //err && err.response && setToast("Something went wrong","error")
        })
    }, [singlepost])
    return (
        <div>
             {
                 loading ? <SkeletonComp />:
                sharedPost ? <PostCard post={sharedPost} hideFooter={true} hideDropdown={true} />:
                <h5 className='p-3'>Attachment unavailable</h5>
            } 
           
        </div>
    )
}

export default SharedPost
