import React, { useState, useEffect } from 'react'
import General from '../../components/settings tab/General'
import Notification from '../../components/settings tab/Notification'
//import { useParams } from 'react-router-dom'
import Link from 'next/link'
import Social from '../../components/settings tab/Social'
import Verification from '../../components/settings tab/Verification'
import MyInformation from '../../components/settings tab/MyInformation'
import Privacy from '../../components/settings tab/Privacy'
import Password from '../../components/settings tab/Password'
import Button from '@material-ui/core/Button'

import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setToast } from '../../components/ToastMsg'
import CustomBackdrop from '../../components/CustomBackdrop'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Head from "next/head";
import { useRouter } from 'next/router'
import Navbar from '../../components/NavbarComp'
import protectedRoute from '../../helper/protectedRoute'


function UserSetting() {
    const [tabs, settabs] = useState('')
    const [load, setload] = useState(false)
    const [openDialogue, setOpenDialogue] = useState(false);

    // let params = useParams()
    let dispatch = useDispatch()
    let Router = useRouter()
    useEffect(() => {
        if (window.location.search.split('=')[1]) {
            settabs(window.location.search.split('=')[1]);
        } else if (window.location.search.split('=')[1] === undefined) {
            settabs('general')
        }
    }, [Router])

    let logOut = () => {
        localStorage.removeItem('auth_token1')
        window.location.pathname = '/'
        dispatch({
            type: "LOGOUT"
        })
        setToast("Account deleted", "error")

    }

    const handleDelete = () => {
        setload(true)
        axios.delete('/user/delete')
            .then(res => {
                if (res.status == 200) {
                    setload(false)
                    logOut()
                }
            })
            .catch(err => {
                setload(false)
                err.response && setToast("Something went wrong, try again later", "error")
            })
    }


    const handleCloseDialogue = () => {
        setOpenDialogue(false);
    };



    return (
        <>
        <Navbar />
            <Head>
                <meta charSet="utf-8" />
                <title>Settings | Flikhs</title>
            </Head>
            <CustomBackdrop backdrop={load} />

            <Dialog
                open={openDialogue}
                onClose={handleCloseDialogue}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure ? Your images, posts will be permanently deleted !"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDialogue} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            
            <div>

                <section id="body" className="body_part">
                    <div className="container-fluid">
                        <div className="row">
                            {/* <!-- ================================================================== -->
                 <!-- >>>>>>>>>  Side Manu BAR = (START) >>>>>>>> --> */}
                            <div className="col-md-3 col-sm-3">
                                <div className="side_manu_bar">
                                    <div className="h-100 overflow-auto pb-5" role="navigation">
                                        {/* <div className="side_manu_header">
                                 <img src={Logo} alt="" className="img-fluid" />
                             </div> */}
                                        <ul className="nav manu_ul flex-column ">
                                            <p>SETTINGS</p>
                                            <li className="nav-item">
                                                <Link href="/user/setting">
                                                    <a className={`nav-link ${tabs === 'general' && "tab_active"}`}><i style={{ color: "#093765" }} className="fas fa-cogs"></i> Generel</a>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link href="/user/setting?tab=notification">
                                                    <a className={`nav-link ${tabs === 'notification' && "tab_active"}`}><i style={{ color: "#22be88" }} className="fas fa-bell"></i> Notification Settings</a>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link href="/user/setting?tab=social">
                                                    <a className={`nav-link ${tabs === 'social' && "tab_active"}`}><i style={{ color: "#5eafff" }} className="fas fa-share-alt"></i> Social Accounts</a>
                                                </Link>
                                            </li>
                                        </ul>
                                        <ul className="nav manu_ul flex-column ">
                                            <p>PROFILE</p>
                                            <li className="nav-item">
                                                <Link className="nav-link" href="/user/setting">
                                                    <a  className={`nav-link ${tabs === 'verification' && "tab_active"}`}><i style={{ color: "#eb6969" }} className="fas fa-user-cog"></i> Profile Setting </a>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link href="/user/setting?tab=verification">
                                                    <a className={`nav-link ${tabs === 'verification' && "tab_active"}`}><i style={{ color: "#4a9ae8" }} className="fas fa-check-circle"></i> Verification of the profile!</a>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link href="/user/setting?tab=my_information">
                                                    <a className={`nav-link ${tabs === 'my_information' && "tab_active"}`}><i style={{ color: "#496480" }} className="fas fa-file-invoice"></i> My Information</a>
                                                </Link>
                                            </li>
                                        </ul>
                                        <ul className="nav manu_ul flex-column ">
                                            <p>SECURITY</p>
                                            <li className="nav-item">
                                                <Link href="/user/setting?tab=privacy">
                                                    <a  className={`nav-link ${tabs === 'privacy' && "tab_active"}`}><i style={{ color: "#a81eba" }} className="fas fa-user-shield"></i> Privacy </a>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link  href="/user/setting?tab=password">
                                                    <a className={`nav-link ${tabs === 'password' && "tab_active"}`}><i style={{ color: "#1b835f" }} className="fas fa-lock"></i> Password</a>
                                                </Link>
                                            </li>
                                            <li className="nav-item"><a className="nav-link" href="#"> <i style={{ color: "#e22323" }} className="fas fa-fingerprint"></i> Manage Sessions </a></li>
                                            <li className="nav-item"><a className="nav-link" href="#"> <i style={{ color: "#b78b50" }} className="fab fa-slack"></i> Two-factor authentication</a></li>
                                        </ul>
                                        <ul className="nav manu_ul flex-column ">
                                            <p>OTHERS</p>
                                            <li className="nav-item"><a className="nav-link" href="#"> <i style={{ color: "#18907d" }} className="fas fa-user-slash"></i> Block Users </a></li>
                                            <li className="nav-item"><Button onClick={() => setOpenDialogue(true)} size="small" style={{ border: "none", outline: "none", background: "transparent", textTransform: "capitalize" }} className="nav-link" > <i style={{ color: "#d43131" }} className="fas fa-trash"></i> Delete Account </Button></li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- <<<<<<<<< Side Manu BAR = (ENDS) <<<<<<<<< -->
                 <!-- ================================================================== -->
                 <!-- ================================================================== -->
                 <!-- >>>>>>>>> MAIN BAR = (START) >>>>>>>> --> */}

                            {
                                tabs === 'general' && <General />
                            }

                            {
                                tabs === 'notification' && <Notification />
                            }

                            {
                                tabs === 'social' && <Social />
                            }

                            {
                                tabs === 'verification' && <Verification />
                            }

                            {
                                tabs === 'my_information' && <MyInformation />
                            }

                            {
                                tabs === 'privacy' && <Privacy />
                            }

                            {
                                tabs === 'password' && <Password />
                            }

                            {/* <!-- <<<<<<<<< MAIN BAR = (ENDS) <<<<<<<<< -->
                 <!-- ================================================================== -->
                 <!-- ================================================================== -->
                 <!-- >>>>>>>>> SIDE  BAR = (START) >>>>>>>> --> */}
                            {/* <div className="col-md-2 col-sm-1 ">
                                <div className=""></div>
                            </div> */}
                            {/* <!-- <<<<<<<<<  SIDE BAR = (ENDS) <<<<<<<<< -->
                 <!-- ================================================================== --> */}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default protectedRoute(UserSetting)
