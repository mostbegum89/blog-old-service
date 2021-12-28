import React,{useState} from 'react'
import { Input } from 'antd';


function ImagePost({handlePostImg,deleteImg,handleImageTitle,imageTitle,images}) {
    
    
    return (
        <div>
            <Input onChange={handleImageTitle} value={imageTitle} placeholder="Title" className='mb-3' />
            <div style={{ width: "100%" }} className="img_video shadow-sm">

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
                        <input onChange={(e) => handlePostImg(e)} accept="image/*" style={{ display: "none" }} id="icon-button-file" type="file" />
                        <label htmlFor="icon-button-file">
                            <span color="primary" aria-label="upload picture" component="span">
                                <i className="fas fa-plus"></i>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImagePost
