import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";
import { setToast } from "../components/ToastMsg";

import Navbar from '../components/NavbarComp'

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Head from "next/head";
import CreateBlog from "../components/CreateBlog";

function Allblogs() {
    const { user, authenticated } = useSelector((state) => state.auth);
    const [show, setShow] = useState(false);
    const [blogs, setBlogs] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const [tab, setTab] = useState("all");

   

    let Router = useRouter();

    useEffect(() => {
        setBackdrop(true);
        if (tab === "all") {
            axios.get("/blog/allblogs").then((res) => {
                setBlogs(res.data.blog);
                setBackdrop(false);
            });
        } else if (tab === "myblog") {
            axios.get("/blog/myblog").then((res) => {
                setBlogs(res.data.blog);
                setBackdrop(false)
            });
        }
    }, [tab]);

    useEffect(() => {
        if (window.location.search.split("=")[1] === undefined) {
            setTab("all");
        } else if (window.location.search.split("=")[1] === "myblog") {
            setTab("myblog");
        }
    }, [Router]);


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
                    <title>Blogs | Flikhs</title>
                </Head>
                <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
                    <CircularProgress color="primary" />
                </Backdrop>


            <CreateBlog handleClose={handleClose} show={show} />
                



                <section className="banner_part ">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 shadow-sm p-0">
                                <img
                                    src='/BlogBanner.png'
                                    alt=""
                                />
                                <div className="banner_button">
                                    <Link href="/blogs" >
                                        <a style={
                                            tab === "all"
                                                ? { background: "#0e5fa5" }
                                                : { background: "#2684d4" }
                                        }
                                            className="btn">All Blogs</a>
                                    </Link>
                                    {authenticated && (
                                        <>
                                            <Link

                                                href="/blogs?tab=myblog"
                                            >
                                                <a style={
                                                    tab === "myblog"
                                                        ? { background: "#0e5fa5" }
                                                        : { background: "#2684d4" }
                                                }
                                                    className="btn">
                                                    <i className="fas fa-sign-in-alt"></i> My blog
                                                </a>
                                            </Link>

                                            <a onClick={() => handleShow()} className="btn" href="#"> <i className="fas fa-plus"></i> Create Blog</a>

                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <!-- <<<<<<<<< GROUP BANNER  = (ENDs) <<<<<<<<< -->
        <!-- ---------------------------------------------------------------------------------------------- -->
        <!-- ---------------------------------------------------------------------------------------------- -->
        <!-- >>>>>>>>>  GROUPS ITEMS = (START) >>>>>>>> --> */}

                <section className="list_section ">
                    <div
                        style={{ background: "#fff" }}
                        className="container shadow-sm rounded"
                    >
                        <div className="row">
                            {blogs &&
                                blogs.map((blog, index) => {
                                    return (
                                        <div key={index} className="col-md-6 col-sm-6">
                                            <div className="row list_items  rounded">
                                                <div className="col-2 p-0">
                                                    {" "}
                                                    <img
                                                        src={blog.blogImage ? blog.blogImage : '/groupholder.png'}
                                                        alt=""
                                                        className="img-fluid"
                                                    />
                                                </div>
                                                <div className="col-7 p-0">
                                                    <Link href={`/b/${blog.slug}`}>
                                                        <a><h6>{blog.name}</h6></a>
                                                    </Link>
                                                    <p style={{ fontSize: "12px", color: "#666" }}>
                                                        /blog/{blog.slug}
                                                    </p>
                                                </div>
                                                <div className="col-3 p-0">
                                                    <Link
                                                        href={`/b/${blog.slug}`}

                                                    >
                                                        <a style={{ background: "#2684d4", color: "white" }}
                                                            className="btn">
                                                            View <i className="fas fa-sign-out-alt"></i></a>
                                                    </Link>
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

export default Allblogs;
