import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";
import { setToast } from "../components/ToastMsg";
import Navbar from '../components/NavbarComp'
import { Modal } from 'react-bootstrap'
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Head from "next/head";
import CreateGroup from "../components/CreateGroup";

function Allgroups() {
    const { user, authenticated } = useSelector((state) => state.auth);
    const [show, setShow] = useState(false);
    const [groups, setGroups] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const [tab, setTab] = useState("all");

    

    let Router = useRouter();

    useEffect(() => {
        setBackdrop(true);
        if (tab === "all") {
            axios.get("/group/getall").then((res) => {
                setGroups(res.data.group);
                setBackdrop(false);
            });
        } else if (tab === "joined") {
            axios.get("/group/joined").then((res) => {
                setGroups(res.data.group);
                setBackdrop(false);
            });
        }
    }, [tab]);

    useEffect(() => {
        if (window.location.search.split("=")[1] === undefined) {
            setTab("all");
        } else if (window.location.search.split("=")[1] === "joined") {
            setTab("joined");
        }
    }, [Router]);

   

    let handleJoin = (id) => {
        axios
            .put("/group/join/" + id)
            .then((res) => {
                let array = [...groups];
                let index = array.findIndex((g) => g._id === id);
                array[index] = res.data.group;
                setGroups(array);
                // setGroups(array)
                // console.log(groups);
                // axios.get('/group/getall')
                // .then(res=>{
                //     setGroups(res.data.group)
                // })
            })
            .catch((err) => {
                err.response && setToast(err.response.data.error, "error");
            });
    };
    let handleLeave = (id) => {
        axios
            .put("/group/leave/" + id)
            .then((res) => {
                let array = [...groups];
                let index = array.findIndex((g) => g._id === id);
                //array.splice(index,1)
                array[index] = res.data.group;
                setGroups(array);
                // setGroups(array)
                // console.log(groups);
                // axios.get('/group/getall')
                // .then(res=>{
                //     setGroups(res.data.group)
                // })
            })
            .catch((err) => {
                err.response && setToast(err.response.data.error, "error");
            });
    };


    const handleClose = () => {

        setShow(false)
    };
    const handleShow = () => setShow(true);

    

    return (
        <>
            <Navbar />
            <div id="groups_blogs">
                <Head>
                    <meta charSet="utf-8" />
                    <title>Groups | Flikhs</title>
                </Head>
                <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
                    <CircularProgress color="primary" />
                </Backdrop>


                
                <CreateGroup handleClose={handleClose} show={show} />


                <section id="banner" className="banner_part ">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 shadow-sm p-0">
                                <img

                                    src='/GroupBanner.png'
                                    alt=""
                                />
                                <div className="banner_button">
                                    <Link
                                        href="/groups"
                                    >
                                        <a style={
                                            tab === "all"
                                                ? { background: "#0e5fa5" }
                                                : { background: "#2684d4" }
                                        }
                                            className="btn">All Group</a>
                                    </Link>
                                    {authenticated && (
                                        <>
                                            <Link

                                                href="/groups?tab=joined"
                                            >
                                                <a style={
                                                    tab === "joined"
                                                        ? { background: "#0e5fa5" }
                                                        : { background: "#2684d4" }
                                                }
                                                    className="btn">
                                                    <i className="fas fa-sign-in-alt"></i> Joined Group
                                                </a>
                                            </Link>
                                            
                                                <a onClick={()=>handleShow()} className="btn" href='#'><i className="fas fa-plus"></i> Create Group</a>
                                           
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <!-- <<<<<<<<< GROUP BANNER  = (ENDs) <<<<<<<<< -->
        <!-- --------------------------------------------------------------------------------------
        <!-- >>>>>>>>>  GROUPS ITEMS = (START) >>>>>>>> --> */}

                <section className="list_section ">
                    <div
                        style={{ background: "#fff" }}
                        className="container shadow-sm rounded"
                    >
                        <div className="row">
                            {groups &&
                                groups.map((group, index) => {
                                    return (
                                        <div key={index} className="col-md-6 col-sm-6">
                                            <div className="row list_items  rounded">
                                                <div className="col-2 p-0">
                                                    {" "}
                                                    <img
                                                        src={group.groupimg ? group.groupimg : '/groupholder.png'}
                                                        alt=""
                                                        className="img-fluid"
                                                    />
                                                </div>
                                                <div className="col-7 p-0">
                                                    <Link href={`/g/${group.slug}`}>
                                                        <a><h6>{group.name}</h6></a>
                                                    </Link>
                                                    <p style={{ fontSize: "12px", color: "#666" }}>
                                                        /g/{group.slug}
                                                    </p>
                                                </div>
                                                <div className="col-3 p-0 group_button">
                                                    {!authenticated ? (
                                                        false
                                                    ) : group.members.includes(user._id) ? (
                                                        <button
                                                            onClick={() => handleLeave(group._id)}
                                                            style={{ background: "red", color: "white" }}
                                                            className="btn"
                                                            href=""
                                                        >
                                                            Leave <i className="fas fa-sign-out-alt"></i>
                                                        </button>
                                                    ) : (
                                                                <button
                                                                    style={{ background: "#2684d4", color: "white" }}
                                                                    onClick={() => handleJoin(group._id)}
                                                                    className="btn"
                                                                >
                                                                    Join <i className="fas fa-sign-in-alt"></i>
                                                                </button>
                                                            )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Allgroups;
