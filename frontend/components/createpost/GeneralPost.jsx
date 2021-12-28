import React, { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'
import { Input } from 'antd';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

function GeneralPost({handleGeneralTitle,generalTitle,handleGeneralPost,generalPost}) {
   
    
    const [show, setShow] = useState(false);
    // ReactQuill.register('modules/imageResize', ImageResize);
    const modules = {
        toolbar: [
            //[{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            //[{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link' ],
            ['clean']
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false
        }
    }


    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link',
    ]

  
    return (
        <>

            <div style={{ display: "block" }} >
                <Input onChange={handleGeneralTitle} value={generalTitle} placeholder="Title" className='mb-3' />
                <ReactQuill
                    onChange={handleGeneralPost}
                    value={generalPost}
                    modules={modules}
                    formats={formats}

                />
            </div>

        </>
    )
}

export default GeneralPost
