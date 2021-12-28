import React, { useState } from 'react'
import axios from 'axios'
import { setToast } from '../ToastMsg'
import CustomBackdrop from '../CustomBackdrop'

function Password() {
    const [currentpassword, setCurrentpassword] = useState('')
    const [newpassword, setNewpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')

    const [error, setError] = useState(null)
    const [load, setload] = useState(false)

    const handleChangePassword = () => {
        setload(true)
        let newpass = {
            currentpassword,
            newpassword,
            confirmpassword
        }
        axios.patch('/user/changepassword', newpass)
            .then(res => {
                if (res.status === 200) {
                    setToast("Password changed successfully", "success")
                    setError(null)
                    setload(false)
                }
            })
            .catch(err => {
                err.response && setError(err.response.data)
                setload(false)
            })
    }
    return (
        <>
            <CustomBackdrop backdrop={load} />
            <div className="col-md-7 col-sm-7">
                <div className="password_header">
                    <h1>Change Your Password</h1>
                    <p>To change your password, provide your old password and choose a new password</p>
                </div>
                <div className="main_bar shadow-sm rounded">
                    <div className="row password border-bottom  pb-4 mb-3">
                        <div className="col-md-4 p-0">
                            <h6>Current Password :</h6>
                        </div>
                        <div className="col-md-8 password_input">
                            <input value={currentpassword} onChange={(e) => setCurrentpassword(e.target.value)} type="password" name="" placeholder="" />
                        </div>
                    </div>
                    <div className="row password  ">
                        <div className="col-md-4 p-0">
                            <h6>New Password :</h6>
                        </div>
                        <div className="col-md-8 password_input">
                            <input value={newpassword} onChange={(e) => setNewpassword(e.target.value)} type="password" name="" placeholder="" />
                        </div>
                    </div>
                    <div className="row password  ">
                        <div className="col-md-4 p-0">
                            <h6>Confirm New Password :</h6>
                        </div>
                        <div className="col-md-8 password_input">
                            <input value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)} type="password" name="" placeholder="" />
                        </div>
                    </div>
                    {error && <div className="alert alert-danger m-4" role="alert">
                        <strong>Error</strong> {error.error}

                    </div>}
                    <div className="password_footer">
                        <button onClick={() => handleChangePassword()} className="btn">Change</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Password
