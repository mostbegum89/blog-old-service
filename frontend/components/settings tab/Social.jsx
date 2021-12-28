import React from 'react'

function Social() {
    return (
        <div className="col-md-7 col-sm-7">
            <div className="social_header">
                <h1>Social Accounts</h1>
            </div>
            <div className="main_bar shadow-sm rounded">
                <div className="row social">
                    <div className="col-2 p-0">
                        <a href="#"> <i style={{ background: "#196ec3" }} className="fab fa-facebook-f"></i></a>
                    </div>
                    <div className="col-10 social_input">
                        <input type="text" name="" placeholder="Facebook link" />
                    </div>
                </div>
                <div className="row social">
                    <div className="col-2 p-0">
                        <a href="#"> <i style={{ background: "#50a8ff" }} className="fab fa-twitter"></i></a>
                    </div>
                    <div className="col-10 social_input">
                        <input type="text" name="" placeholder="Twitter link" />
                    </div>
                </div>
                <div className="row social">
                    <div className="col-2 p-0">
                        <a href="#"> <i className="fab fa-instagram"></i></a>
                    </div>
                    <div className="col-10 social_input">
                        <input type="text" name="" placeholder="Instagram link" />
                    </div>
                </div>
                <div className="row social">
                    <div className="col-2 p-0">
                        <a href="#"> <i style={{ background: "#cc1d1d" }} className="fab fa-google-plus-g"></i></a>
                    </div>
                    <div className="col-10 social_input">
                        <input type="text" name="" placeholder="Google+ link" />
                    </div>
                </div>
                <div className="row social">
                    <div className="col-2 p-0">
                        <a href="#"> <i style={{ background: "#114b84" }} className="fab fa-linkedin-in"></i></a>
                    </div>
                    <div className="col-10 social_input">
                        <input type="text" name="" placeholder="Linkedin link" />
                    </div>
                </div>
                <div className="row social">
                    <div className="col-2 p-0">
                        <a href="#"> <i style={{ background: "#e00f0f" }} className="fab fa-youtube"></i></a>
                    </div>
                    <div className="col-10 social_input">
                        <input type="text" name="" placeholder="youtube Channel link" />
                    </div>
                </div>
                <div className="row social">
                    <div className="col-2 p-0">
                        <a href="#"> <i style={{ background: "#3e9ba7" }} className="fab fa-vk"></i></a>
                    </div>
                    <div className="col-10 social_input">
                        <input type="text" name="" placeholder="Vkontakte link" />
                    </div>
                </div>
                <div className="social_footer">
                    <a href="#" className="btn">Save</a>
                </div>
            </div>
        </div>
    )
}

export default Social
