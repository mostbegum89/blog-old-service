import React from 'react'

function PostImages({ singlepost, setToggler }) {
  return (
    <>
      {singlepost.image && singlepost.image.length === 1 && (

        <div style={{ cursor: "pointer" }} onClick={setToggler}>
          <img style={{ height: "350px", objectFit: "cover" }} src={singlepost.image[0]} className="img-fluid w-100"></img>
        </div>
      )}


      {singlepost.image && singlepost.image.length === 2 && (
        <div onClick={setToggler} style={{ height: "400px", cursor: "pointer" }} className="image_box2 d-flex justify-content-around m-1 mb-4">
          <img src={singlepost.image[0]} alt="" className="m-1 img-fluid" />
          <img src={singlepost.image[1]} alt="" className="m-1 img-fluid" />

        </div>
      )}


      {singlepost.image && singlepost.image.length === 3 && (
        <div onClick={setToggler} style={{ height: "300px", width: "100%", cursor: "pointer" }} className="image_box3 d-flex justify-content-around mb-4">
          <div className="col-6 p-0 mr-1">
            <img src={singlepost.image[0]} alt="" className="img-fluid h-100" />
          </div>
          <div className="col-6 p-0 ">
            <img src={singlepost.image[1]} alt="" className="img-fluid h-50 mb-1 w-100" />
            <img src={singlepost.image[2]} alt="" className="img-fluid h-50 w-100 calc_small" />
          </div>

        </div>
      )}


      {singlepost.image && singlepost.image.length === 4 && (
        <div onClick={setToggler} className="image_box4 row float-left mb-4">
          <div style={{ height: "400px", cursor: "pointer" }} className="col-6 p-0">
            <img style={{ objectFit: "cover" }} src={singlepost.image[0]} alt="" className="h-50 w-100" />
            <img style={{ objectFit: "cover" }} src={singlepost.image[1]} alt="" className="h-50 w-100" />
          </div>
          <div style={{ height: "400px" }} className="col-6 p-0">
            <img style={{ objectFit: "cover" }} src={singlepost.image[2]} alt="" className="h-50 w-100" />
            <img style={{ objectFit: "cover" }} src={singlepost.image[3]} alt="" className="h-50 w-100" />
          </div>

        </div>
      )}


      {singlepost.image && singlepost.image.length >= 5 && (
        <div style={{ cursor: "pointer" }} onClick={setToggler} className="imagecontainer_5">
          <div style={{ height: "500px" }} className="col_1">
            <img src={singlepost.image[0]} alt="" className="h-50 w-100 mb-1" />
            <img src={singlepost.image[1]} alt="" className="h-50 w-100 mb-1 " />
          </div>
          <div style={{ height: "500px" }} className="col-5 p-0">
            <img style={{ height: "166px" }} src={singlepost.image[2]} alt="" className="w-100 mb-1" />
            <img style={{ height: "166px" }} src={singlepost.image[3]} alt="" className="w-100 mb-1" />
            <div className="view_more_img">
              <img style={{ height: "166px" }} src={singlepost.image[4]} alt="" className="w-100 " />
              {
                singlepost.image.length > 5 &&
                <div className="img_overlay">
                  <p> <i className="fas fa-plus"></i> {singlepost.image.length - 5}</p>
                </div>
              }
            </div>
          </div>
          <span>
            <img style={{ height: "166px" }} src={singlepost.image[5]} alt="" className="img-fluid d-none" />
          </span>
        </div>
      )}
    </>
  )
}

export default PostImages
