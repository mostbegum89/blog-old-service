import React from 'react'

function Verification() {
    return (
        <div className="col-md-7 col-sm-7">
            <div className="manu_bar_header">
                <h1>Verification of the profile!</h1>
            </div>
            <div className="main_bar shadow-sm rounded">
                <div className="row verification  ">
                    <div className="col-md-12 verification_input">
                        <input type="text" name="" placeholder="Username" />
                    </div>
                </div>
                <div className="row verification  ">
                    <div className="col-md-12 verification_input">
                        <textarea name="textarea" placeholder="Message"></textarea>
                    </div>
                </div>
                <div className="row verification  ">
                    <div className="col-md-12 verification_input">
                        <h6>Upload documents</h6>
                        <p>Please upload a photo with your passport / ID & your distinct photo</p>
                    </div>
                </div>
                <div className="row verification  ">
                    <div className="col-md-12 verification_input">
                        <a href="#">
                            <h5> <i className="fas fa-address-card"></i> Copy of your passport or ID card </h5>
                        </a>
                        <a href="#">
                            <h5> <i className="fas fa-user-tie"></i> Your personal picture </h5>
                        </a>
                    </div>
                </div>


                <div className="verification_footer">
                    <a href="#" className="btn">Send</a>
                </div>
            </div>
        </div>
    )
}

export default Verification
