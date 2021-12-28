import React from 'react'

function MyInformation() {
    return (
        <div className="col-md-7 col-sm-7">
            <div className="info_header">
                <h1>Download My Information </h1>
                <p>Please choose which information you would like to download</p>
            </div>
            <div className="main_bar">
                <div className="row informations">
                    <div className="col-4">
                        <div href="#" className="info_box">
                            <i style={{ color: "#1e94b7" }} className="fas fa-info-circle"></i>
                            <p>My Informations</p>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="info_box">
                            <i style={{ color: "#d05b5b" }} className="fas fa-file-alt"></i>
                            <p>My Post</p>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="info_box">
                            <i style={{ color: "#ad4dad" }} className="fas fa-users"></i>
                            <p> Groups</p>
                        </div>
                    </div>
                </div>
                <div className="row informations">
                    <div className="col-4">
                        <div className="info_box">
                            <i style={{ color: "#ba8054" }} className="fas fa-flag"></i>
                            <p> Page</p>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="info_box">
                            <i style={{ color: "#5ab74e" }} className="fas fa-user-plus"></i>
                            <p> Followers</p>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="info_box">
                            <i style={{ color: "#ad6363" }} className="fas fa-user-check"></i>
                            <p> Following</p>
                        </div>
                    </div>
                </div>
                <div className="info_footer">
                    <a href="#" className="btn">Generate File</a>
                </div>
            </div>
        </div>
    )
}

export default MyInformation
