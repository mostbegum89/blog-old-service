import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Skeleton from './SketetonComp'

function LinkPreview({ url }) {
   
    const [meta, setMeta] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (url) {
            setLoading(true)
            axios.post('/post/getmeta', { url })
                .then(res => {
                    setMeta(res.data.result)
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                })
        }

    }, [url])

    const textShort = (text, index) => {
        let shortend
        if (text.length > index) {
            shortend = text.slice(0, index) + "..."
        } else {
            shortend = text.slice(0, index)
        }
        return shortend
    }
    return (
        <>
            {
                loading ? <Skeleton /> : 
                <a href={meta.requestUrl} target='_blank'>
                <div className='og_container'>
                    <img src={meta.ogImage && meta.ogImage.url ? meta.ogImage.url : "https://www.toddbershaddvm.com/wp-content/uploads/sites/257/2018/09/placeholder-img-300x225.jpg"} className="og_image"></img>
                    <div className='og_footer'>
                        <span>{meta.requestUrl}</span>
                        <h5>{meta.ogTitle ?textShort(meta.ogTitle,100) : ""}</h5>
                        <p>{meta.ogDescription ? textShort(meta.ogDescription,150) : ""}</p>
                    </div>
                </div>
                </a>
            }

        </>
    )
}

export default LinkPreview
