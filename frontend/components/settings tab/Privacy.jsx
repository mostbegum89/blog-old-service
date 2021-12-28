import React from 'react'

function Privacy() {
    return (
        <div className="col-md-7 col-sm-7">
            <div className="privacy_header">
                <h1>Privacy Setting</h1>
            </div>
            <div className="main_bar shadow-sm rounded">
                <div className="row privacy">
                    <div className="col-md-5 p-0">
                        <h6>Who can see my profile :</h6>
                    </div>
                    <div className="col-md-7 privacy_input">
                        <select name="selectoptions">
                            <option value="1">Friends & Follower</option>
                            <option value="1">Public</option>
                            <option value="1"> Only Me</option>
                        </select>
                    </div>
                </div>
                <div className="row privacy">
                    <div className="col-md-5 p-0">
                        <h6>Who can post on your timeline :</h6>
                    </div>
                    <div className="col-md-7 privacy_input">
                        <select name="selectoptions">
                            <option value="1"> Public</option>
                            <option value="1">options</option>
                            <option value="1">options</option>
                            <option value="1">options</option>
                        </select>
                    </div>
                </div>
                <div className="row privacy">
                    <div className="col-md-5 p-0">
                        <h6>Who can see your birth Date :</h6>
                    </div>
                    <div className="col-md-7 privacy_input">
                        <select name="selectoptions">
                            <option value="1">Public</option>
                            <option value="1">options</option>
                            <option value="1">options</option>
                            <option value="1">options</option>
                        </select>
                    </div>
                </div>
                <div className="row privacy">
                    <div className="col-md-5 p-0">
                        <h6>Who can see my Private Album :</h6>
                    </div>
                    <div className="col-md-7 privacy_input">
                        <input type="text" name="textfield" placeholder="Enter a friend name" />
                    </div>
                </div>
                <div className="row privacy">
                    <div className="col-md-5 p-0">
                        <h6>Who can send you message :</h6>
                    </div>
                    <div className="col-md-7 privacy_input">
                        <select name="selectoptions">
                            <option value="1">Public</option>
                            <option value="1">options</option>
                            <option value="1">options</option>
                            <option value="1">options</option>
                        </select>
                    </div>
                </div>
                <div className="row privacy">
                    <div className="col-md-5 p-0">
                        <h6>Who can send my Friend list :</h6>
                    </div>
                    <div className="col-md-7 privacy_input">
                        <select name="selectoptions">
                            <option value="1">Public</option>
                            <option value="1">options</option>
                            <option value="1">options</option>
                            <option value="1">options</option>
                        </select>
                    </div>
                </div>
                <div className="row privacy">
                    <div className="col-md-5 p-0">
                        <h6>Who can see my profile :</h6>
                    </div>
                    <div className="col-md-7 privacy_input">
                        <select name="selectoptions">
                            <option value="1">Public</option>
                            <option value="1">options</option>
                            <option value="1">options</option>
                            <option value="1">options</option>
                        </select>
                    </div>
                </div>
                <div className="privacy_footer">
                    <a href="#" className="btn">Save</a>
                </div>
            </div>
        </div>
    )
}

export default Privacy
