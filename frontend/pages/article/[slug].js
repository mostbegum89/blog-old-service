import React, { useState, useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import parse from 'html-react-parser';
import { useSelector } from 'react-redux'
import Avatar from "@material-ui/core/Avatar";
import ShareDialogue from '../../components/ShareDialogue'
import Navbar from '../../components/NavbarComp'
import moment from 'moment'
import Head from "next/head";

function SingleArticle({ article }) {
    const [backdrop, setBackdrop] = useState(false)
    let { user, profile, authenticated } = useSelector((state) => state.auth);

    //const [article, setArticle] = useState(null)
    const [blog, setBlog] = useState(null)
    const [relatedArticle, setRelatedArticle] = useState([])

    const [sharePopup, setSharePopup] = useState(false)

    const handleCloseShare = () => {
        setSharePopup(false)
    }

    let Router = useRouter()
    let slug = Router.query.slug
    useEffect(() => {

        article && setBlog(article.blog ? article.blog : null)

    }, [article])

    useEffect(() => {
        if (article) {
            axios.post("/article/relatedarticles", { tags: article.tags, _id: article._id })
                .then(res => {
                    setRelatedArticle(res.data.article)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [article])


    const [scrolled, setScrolled] = React.useState(false);
    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 250) {
            setScrolled(true);
        }
        else {
            setScrolled(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
    })
    let navbarClasses = ['navbar2'];
    if (scrolled) {
        navbarClasses.push('scrolled');
    }

    const textShort = (text, index) => {
        let shortend
        if (text.length > index) {
            shortend = text.slice(0, index) + "..."
        } else {
            shortend = text.slice(0, index)
        }
        return shortend
    }

    useEffect(() => {
        if(article){
            window.scrollTo(0, 0)
        }else{
            Router.push('/')
        }
      
    }, [article])



    return (
        <>
            <Navbar />
            <Head>
                <meta charSet="utf-8" />
                <title>{`${article && article.title} | Flikhs`}</title>
                <meta property="og:title" content={article && article.title} key="title" />
                <meta property="og:description" content={article && textShort(article.description, 150)} />
                <meta property="og:image" content={article && article.thumbnail} />



                {/* Twitter Meta Tags */}
                <meta property="twitter:card" content="summary_large_image" />
                {/* <meta property="twitter:url" content="https://flikhs-nextjs.vercel.app/g/my-group" /> */}
                <meta property="twitter:title" content={article && article.title} />
                <meta property="twitter:description" content={article && textShort(article.description, 150)} />
                <meta property="twitter:image" content={article && article.thumbnail} />
            </Head>
            <div id='single_article' className="shadow-sm">

                <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
                    <CircularProgress color="primary" />
                </Backdrop>

                <ShareDialogue 
                title={article && article.title} 
                img={article && article.thumbnail} 
                sharePopup={sharePopup} 
                handleCloseShare={handleCloseShare} 
                data={article && `article/${article.slug}`}
                articleLink={article && `article/${article.slug}`}
                 />


                <header className={navbarClasses.join(" ")}>
                    <div className="container header">
                        <div className="header_name d-flex align-items-center">
                            <Link href={blog ? `/b/${blog.slug}` : '/articles'}>
                                <a><Avatar src={blog ? blog.blogImage : null} /></a>
                            </Link>
                            <h5>
                                <Link href={blog ? `/b/${blog.slug}` : '/articles'}>
                                    <a>{blog ? blog.name : "Article"}</a>
                                </Link>
                            </h5>
                        </div>
                        <nav className="navigation">
                            <ul>
                                <li style={{ cursor: "pointer", color: "#25AAE1" }} className="nav-item">
                                    <span onClick={() => setSharePopup(true)} className="nav-link">Share <i className="fas fa-share-alt"></i></span>

                                </li>

                            </ul>
                        </nav>
                    </div>
                </header>
                {/* <!-- ---------------------------------------------------------------------------------------------- -->
 		<!-- >>>>>>>>>> BANNER = (START) >>>>>>>> --> */}
                <section id="banner" className="blog_post_banner_part blog_post_ptb">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h1>{article && article.title}</h1>
                                <img className="blog_post_banner_part_img" src={article && article.thumbnail} alt="" className="img-fluid" />

                            </div>
                        </div>
                    </div>
                </section>
                {/* <!-- <<<<<<<<< BANNER = (ENDS) <<<<<<<<< -->
 		<!-- ---------------------------------------------------------------------------------------------- --> */}

                {/* <!-- ---------------------------------------------------------------------------------------------- -->
 		<!-- >>>>>>>>> PROFILE = (START) >>>>>>>> --> */}
                <section id="" className="bog_post_profile_part blog_post_ptb">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3 col-sm-4">
                                <div className="bog_post_profile_img text-center">

                                    <Link
                                        href={
                                            authenticated && profile?._id == (article && article.creator?._id)
                                                ? `/profile`
                                                : `/user/${article && article.creator?.username}`
                                        }
                                    >
                                        <a style={{ color: "black" }}>
                                            <img src={article && article.creator?.profileimg} alt="" className="img-fluid bog_post_profile_img_img" />
                                            <h6 className="bog_post_profile_h6">{article && article.creator?.first} {article && article.creator?.last}</h6>
                                        </a>

                                    </Link>

                                    {/* <p className="bog_post_profile_p">Web Designer</p>
								<a className="bog_post_profile_a" href="#"> <i className="fab fa-facebook-f bog_post_profile_a_i"></i></a>
								<a className="bog_post_profile_a" href="#"> <i className="fab fa-twitter bog_post_profile_a_i"></i></a>
								<a className="bog_post_profile_a" href="#"> <i className="fab fa-instagram bog_post_profile_a_i"></i></a> */}
                                </div>
                            </div>
                            <div className="col-md-9 col-sm-8">
                                <div className="blog_post_profile_text">

                                    <p className="blog_post_profile_text_p">{article && article.description}</p>
                                </div>

                            </div>

                        </div>
                    </div>




                </section>

                {/* <!-- <<<<<<<<< PROFILE = (ENDS) <<<<<<<<< -->
 		<!-- ---------------------------------------------------------------------------------------------- --> */}

                {/* <!-- ---------------------------------------------------------------------------------------------- -->
 		<!-- >>>>>>>>> TEXT = (START) >>>>>>>> --> */}
                <section id="" className="blog_post_text_part blog_post_ptb">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">

                                {article && parse(article.body)}


                            </div>
                            <div className='text-center w-100 mt-3'>

                            <span style={{ cursor: "pointer", color: "#25AAE1" }} onClick={() => setSharePopup(true)} className="nav-link">Share <i className="fas fa-share-alt"></i></span>
                            </div>

                        </div>
                    </div>
                </section>
                {/* <!-- <<<<<<<<< TEXT = (ENDS) <<<<<<<<< --> */}
                <div style={{ margin: "15px 0", height: "1px", background: "#ccc" }}></div>


                {/* <!-- >>>>>>>>> Articles = (START) >>>>>>>> --> */}
                <section id="" className="blog_post_articles_part blog_Post_ptb">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 text-center">
                                <h4 className="blog_post_articles_part_h4">Related Articles</h4>
                            </div>
                            <div className='row' style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>

                                {
                                    relatedArticle.length > 0 ? relatedArticle.map((related, index) => {
                                        return (

                                            <div key={index} className="col-md-3 col-sm-6">
                                                <div className="related_article">
                                                    <Link href={`/article/${related.slug}`}>
                                                        <a>
                                                            <img src={related.thumbnail} alt="" className="img-fluid related_article_img" />
                                                            <div style={{ height: "70px" }}>
                                                                <h6 className="related_article_h6">{textShort(related.title, 85)}</h6>
                                                            </div>

                                                            <p className="related_article_p d-flex justify-content-between">
                                                                <span> By- {related.creator?.first}</span>
                                                                <span className='views'>
                                                                    <i className="fas fa-eye"></i> {related.views}
                                                                </span>

                                                                <span className="article_popular_item_span">{moment(related.createdAt).format("D MMM")}</span>
                                                            </p>
                                                        </a>

                                                    </Link>
                                                    <span className="related_article_cetagori_type">{related.category.name}</span>
                                                </div>
                                            </div>
                                        )
                                    }) :
                                        <p>No articles found</p>
                                }



                            </div>
                        </div>
                    </div>
                </section>
                {/* <!-- <<<<<<<<< Articles = (ENDS) <<<<<<<<< --> */}

            </div>
        </>
    )
}


SingleArticle.getInitialProps=async(context) =>{

    // const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/article/updateview/${context.query.slug}`)

    // return {
    //    article: res.data.article , // will be passed to the page component as props
    // }


    try {
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/article/updateview/${context.query.slug}`)
        return {
            article: res.data.article , // will be passed to the page component as props
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

export default SingleArticle
