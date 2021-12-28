import React from 'react'

function Notification() {
    return (
        <div className="col-md-7 col-sm-7">
            <div className="manu_bar_header">
                <h1>Notifications Settings</h1>
            </div>
            <div className="main_bar shadow-sm rounded">
                <div className="notification_header">
                    <a style={{ background: "#278ece", boxShadow: "1px 2px 3px #aaa", color: " #fff" }} href="notifications.html"> Notification Settings</a><a href="email-setting.html"> Email Settings</a>
                </div>
                <div className="row notification_box ">
                    <div className="col-md-4 ">
                        <h6> Notify me when :</h6>
                    </div>
                    <div className="col-md-8 notification_text">
                        <p><input type="checkbox" name="checkbox" checked /> Someone liked my post</p>
                        <p><input type="checkbox" name="checkbox" checked /> Someone comment on my post</p>
                        <p><input type="checkbox" name="checkbox" checked /> Someone send me messege</p>
                        <p><input type="checkbox" name="checkbox" checked /> Someone share my on post</p>
                        <p><input type="checkbox" name="checkbox" checked /> Someone follow me</p>
                        <p><input type="checkbox" name="checkbox" checked /> Someone liked my page</p>
                        <p><input type="checkbox" name="checkbox" checked /> Someone visite my profile</p>
                        <p><input type="checkbox" name="checkbox" checked /> Someone mentioned me</p>
                        <p><input type="checkbox" name="checkbox" checked /> Someone joined my group</p>
                        <p><input type="checkbox" name="checkbox" checked /> Someone accepted my friend requset</p>
                        <p><input type="checkbox" name="checkbox" checked /> Someone post on my timeline</p>
                        <p><input type="checkbox" name="checkbox" checked /> you have remembrance on this day</p>
                    </div>
                </div>
                <div className="notification_footer">
                    <a href="#" className="btn">Save</a>
                </div>
            </div>
        </div>
    )
}

export default Notification
