import React from 'react'
import { Input } from 'antd';


function LinkPost({handleLinkTitle,linkTitle,handleLinkUrl,linkUrl}) {
    return (
        <div>
            <Input onChange={handleLinkTitle} value={linkTitle} placeholder="Title" className='mb-3' />
            <Input onChange={handleLinkUrl} value={linkUrl} placeholder="Url" className='mb-3' />
        </div>
    )
}

export default LinkPost
