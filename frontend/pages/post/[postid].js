import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import SkeletonComp from '../../components/SketetonComp'
import { setToast } from '../../components/ToastMsg'
import PostCard from '../../components/postcard/PostCard'
import ShortProfileSidebar from "../../components/ShortProfileSidebar";
import TrendingGroups from "../../components/TrendingGroups";
import Navbar from '../../components/NavbarComp'
import Head from "next/head";


function SinglePost({ singlepost }) {
    // const [singlepost, setSinglepost] = useState(null)
    const [postfetch, setPostfetch] = useState(false)

    let Router = useRouter()
    let postid = Router.query.postid
    const { user, profile, authenticated } = useSelector(state => state.auth)

    // useEffect(() => {
    //     if (postid) {
    //         setPostfetch(true)

    //         axios.get('/post/singlepost/' + postid)
    //             .then(res => {
    //                 setSinglepost(res.data.post)
    //                 setPostfetch(false)
    //             })
    //             .catch(err => {
    //                 Router.push("/")
    //                 err.response && setToast("Post not found", "error")

    //             })
    //     }

    // }, [postid])

    useEffect(() => {
        if (!singlepost) {
            Router.push("/")
        }
    }, [singlepost])


    let deletePost = (id) => {
        axios.patch(`/post/delete/${id}`)
            .then(res => {
                if (res.data.success) {
                    Router.push('/')
                    setToast("Post Deleted", "error")
                }
            })
            .catch(err => {
                err.response && setToast("something went wrong", "error")
                Router.push('/')
            })
    }

    const texShort = (text, index) => {
        let shortend
        if (text.length > index) {
            shortend = text.slice(0, index) + "..."
        } else {
            shortend = text.slice(0, index)
        }
        return shortend
    }

    function getText(html) {
        var divContainer = document.createElement("div");
        divContainer.innerHTML = html;
        return texShort(divContainer.textContent, 300) || texShort(divContainer.innerText, 300) || "";
    }
    return (
        <>
            <Navbar />
            <Head>
                <meta charSet="utf-8" />
                <title>{`${singlepost && singlepost.title} | Flikhs`}</title>
                <meta property="og:title" content={singlepost && singlepost.title} key="title" />
                <meta property="og:description" content={singlepost && singlepost.post} />
                <meta property="og:image" content={singlepost && singlepost.image ? singlepost.image[0] : "/logo.png"} />


                {/* Twitter Meta Tags */}
                <meta property="twitter:card" content="summary_large_image" />
                {/* <meta property="twitter:url" content="https://flikhs-nextjs.vercel.app/g/my-group" /> */}
                <meta property="twitter:title" content={singlepost && singlepost.title} />
                {/* <meta property="twitter:description" content={groupserver ? groupserver.description : group ? group.description : ""} /> */}
                <meta property="twitter:image" content={singlepost && singlepost.image ? singlepost.image[0] : "/logo.png"} />
            </Head>
            <section id="home_post" >
                <div className="home">
                    <div className="row col-md-12 col-sm-12">
                        <div className="col-md-8 col-sm-8  ">

                            {postfetch ? (
                                <>
                                    <SkeletonComp /> <SkeletonComp />
                                </>
                            ) : singlepost ? <PostCard
                                deletePost={deletePost}
                                post={singlepost}
                                from='home'
                            /> :
                                    <p>No posts found</p>

                            }
                            <div style={{ textAlign: "center" }}>
                            </div>
                        </div>

                        {/* <!-- ------------------- POST IMAGE---------------------- -->


                 <!-- ------------------- ABOUT SIDE BAR ---------------------- --> */}

                        <div className="col-md-4 col-sm-12 about_side">
                            {
                                authenticated && <ShortProfileSidebar />
                            }
                            <div className="trending_group shadow-sm rounded">
                                <TrendingGroups />

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}


export async function getServerSideProps(context) {

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/post/singlepost/${context.params.postid}`)
        return {
            props: { singlepost: res.data.post }, // will be passed to the page component as props
        }
    } catch (error) {
        //console.log(error);
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }



}

export default SinglePost
