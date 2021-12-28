import React, { useEffect, useState } from 'react'
import Slider from "react-slick";
import Navbar from '../components/NavbarComp'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import moment from 'moment'
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import SecondHeader from '../components/SecondHeader'
import ShareDialogue from '../components/ShareDialogue'
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    prevArrow: <div className='slick-prev' />,
    nextArrow: <div className='slick-next' />,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true

            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: false
            }
        }
    ]
};
function article() {

    const Router = useRouter()
    let slug = Router.query.slug
    const [backdrop, setBackdrop] = useState(false)
    // const params = useParams()
    // const history = useHistory()
    const { authenticated } = useSelector(state => state.auth)

    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])


    const [articles, setArticles] = useState([])
    const [populars, setPopulars] = useState([])

    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedSubCategory, setSelectedSubCategory] = useState("all")

    const [searchText, setSearchText] = useState("")
    const [sharePopup, setSharePopup] = useState(false)

    useEffect(() => {
        //console.log(window.location.search.split('=')[1])
        if (Router.query.category) {
            setSelectedCategory(Router.query.category);
        } else {
            setSelectedCategory('all')
        }
        if (Router.query.sub) {
            setSelectedSubCategory(Router.query.sub);
            //console.log(Router.query.sub);
        } else {
            setSelectedSubCategory('all')
        }

        //console.log(Router)
    }, [Router])

    const fetchdata = () => {
        setBackdrop(true)
        axios.get("article/recentarticle")
            .then(res => {
                setArticles(res.data.article)
                console.log(res.data.popular.length);
                setPopulars(res.data.popular)
                setBackdrop(false)
            })
            .catch(err => {
                setBackdrop(false)
                //console.log(err)
            })
    }

    useEffect(() => {
        if (selectedCategory !== 'all' && selectedSubCategory === 'all') {
            setBackdrop(true)
            axios.get(`article/recentarticle?category=${selectedCategory}`)
                .then(res => {
                    setArticles(res.data.article)
                    setPopulars(res.data.popular)
                    setBackdrop(false)
                })
                .catch(err => {
                    setBackdrop(false)
                    // console.log(err)
                })
        } else if (selectedCategory !== 'all' && selectedSubCategory !== 'all') {
            setBackdrop(true)
            axios.get(`article/recentarticle?subcategory=${selectedSubCategory}`)
                .then(res => {
                    setArticles(res.data.article)
                    setPopulars(res.data.popular)
                    setBackdrop(false)
                })
                .catch(err => {
                    setBackdrop(false)
                    // console.log(err)
                })
        }
        else {
            fetchdata()
        }
    }, [selectedCategory, selectedSubCategory])

    useEffect(() => {
        axios.get('/blogcategory/getcategory')
            .then(res => {
                if (res.data.success) {
                    setCategories(res.data.blogCategory)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        if (categories.length > 0 && selectedCategory !== 'all') {
            let filter = categories.filter(cat => cat.slug === selectedCategory)
            setSubCategories(filter[0]?.children)
            //console.log(filter[0]?.children);
        } else {
            setSubCategories([])
        }


    }, [selectedCategory, Router, categories])


    const textShort = (text, index) => {
        let shortend
        if (text.length > index) {
            shortend = text.slice(0, index) + "..."
        } else {
            shortend = text.slice(0, index)
        }
        return shortend
    }

    const handleCloseShare = () => {
        setSharePopup(false)
    }

    const handleSharePopup = () => {
        setSharePopup(true)
    }

    let handleKey = (e) => {

        if (e.keyCode === 13) {
            e.preventDefault()
            Router.push(`/article/search?search=${searchText}`)
        }
    }



    const SubCategories = () => {
        return (
            <section id="" className="article_cetagories_part">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="cetagories_box mb-3">
                                <p><i className="fas fa-check"></i> Select Sub Categories</p>
                                <Link href={`/articles?category=${selectedCategory}`}>
                                    <a className={selectedSubCategory === 'all' && "cetagories_box_active"} style={{ textTransform: "capitalize" }}>all</a>
                                </Link>
                                {
                                    subCategories && subCategories.map((cat, index) => {
                                        return (
                                            index < 15 && <Link href={`/articles?category=${selectedCategory}&sub=${cat.slug}`}>
                                                <a className={selectedSubCategory === cat.slug && "cetagories_box_active"} style={{ textTransform: "capitalize" }} key={index}>{cat.name}</a>
                                            </Link>
                                        )
                                    })
                                }
                                {
                                    subCategories && subCategories.length > 15 && <>
                                        <a className="dropdown-toggle" href="#" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            More..
                                                    </a>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                                            {
                                                subCategories && subCategories.length > 5 && subCategories.map((cat, index) => {
                                                    return (
                                                        index >= 15 && <>
                                                            <Link href={`/articles?category=${selectedCategory}&sub=${cat.slug}`}>
                                                                <a className="dropdown-item"> {cat.name}</a>
                                                            </Link>
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }


    return (
        <>
            <Navbar />
            <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
                <CircularProgress color="primary" />
            </Backdrop>
            <SecondHeader img={null} setSharePopup={handleSharePopup} blog={"Articles"} />
            <ShareDialogue hideTimeline={true} title={"Articles"} img={null} sharePopup={sharePopup} handleCloseShare={handleCloseShare} data={`articles`} />
            <div id="article_container">
                {/* <!-- ---------------------------------------------------------------------------------------------- -->
 		<!-- >>>>>>>>>>>>>>> BLOG = (START) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> --> */}
                <section className="blog_part">
                    <div className="container">
                        {/* <!-- >>>>>>>>>>>>>>> HEADER = (START) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> --> */}
                        <section className="article_header_part">
                            <div>
                                <div className="row p-3">
                                    <div className="col-12 d-flex justify-content-between">
                                        <h1 className="article_header_part_h1">Articles</h1>
                                        {
                                            authenticated && <Link href="/article/create" >
                                                <a className="article_header_btn"><i className="fas fa-plus" style={{ color: "white" }}></i> Create a New Artical</a>
                                            </Link>
                                        }

                                        {/* <a href="#" className="article_header_part_btn"><i className="fas fa-cogs" style={{ color: "white" }}></i> Setting</a> */}
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* <!-- <<<<<<<<<<<<<< HEADER = (ENDS) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< --> */}
                        {/* <!-- >>>>>>>>>>>>>>> CETAGORIES = (START) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> --> */}
                        <section id="" className="article_cetagories_part">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="cetagories_box mb-3">
                                            <p><i className="fas fa-check"></i> Select Categories</p>
                                            <Link href={`/articles`}>
                                                <a className={selectedCategory === 'all' && "cetagories_box_active"} style={{ textTransform: "capitalize" }}>all</a>
                                            </Link>
                                            {
                                                categories && categories.map((cat, index) => {
                                                    return (
                                                        index < 15 && <Link href={`/articles?category=${cat.slug}`}>
                                                            <a className={selectedCategory === cat.slug && "cetagories_box_active"} style={{ textTransform: "capitalize" }} key={index}>{cat.name}</a>
                                                        </Link>
                                                    )
                                                })
                                            }
                                            {
                                                categories && categories.length > 15 && <>
                                                    <a className="dropdown-toggle" href="#" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        More..
                                                    </a>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                                                        {
                                                            categories && categories.length > 5 && categories.map((cat, index) => {
                                                                return (
                                                                    index >= 15 && <>
                                                                        <Link href={`/articles?category=${cat.slug}`}>
                                                                            <a className="dropdown-item"> {cat.name}</a>
                                                                        </Link>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* <!-- >>>>>>>>>>>>>>> sub CETAGORIES = (START) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> --> */}
                        {
                            subCategories.length > 0 && <SubCategories />
                        }

                        {/* ---------sub cat ends---------------- */}
                        <div className="row">
                           
                            <div className="col-md-8 col-sm-12 mt-2">
                                <div className="article_leftside ptb">
                                <div className="search  d-md-none d-sm-block m-2">
                                <input
                                    placeholder="Search Blog"
                                    type="text"
                                    onKeyDown={(e) => { handleKey(e) }}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                <Link href={`/article/search?search=${searchText}`}>
                                    <a><i className="fas fa-search"></i></a>
                                </Link>
                            </div>
                                    <h3>Recent Posts</h3>
                                    <div className="article_img">
                                        <div className="row">
                                            {
                                                articles.length > 0 &&
                                                <div className="col-md-6 p-0">
                                                    <Link href={`/article/${articles[0].slug}`}>
                                                        <a rel={articles[0].isIndex?"dofollow":"nofollow"}>
                                                            <div style={{ position: "relative" }}>
                                                                <img src={articles[0].thumbnail} alt="" className="img-fluid img1" />
                                                                <div className="article_img_overlay">
                                                                    <div className="article_overlay_text">
                                                                        <span className="cetagori_type">{articles[0].category.name}</span>

                                                                        <h5>{articles[0].title}</h5>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                </div>
                                            }




                                            <div className="col-md-6 p-0">
                                                {
                                                    articles.length > 1 &&
                                                    <div className="col-md-12 p-0">
                                                        <Link href={`/article/${articles[1].slug}`}>
                                                            <a rel={articles[1].isIndex?"dofollow":"nofollow"}>
                                                                <div style={{ position: "relative" }}>
                                                                    <div className="article_img_overlay">
                                                                        <div className="article_overlay_text">
                                                                            <span className="cetagori_type">{articles[1].category.name}</span>

                                                                            <h5>{textShort(articles[1].title, 65)} </h5>

                                                                        </div>
                                                                    </div>
                                                                    <img src={articles[1].thumbnail} alt="" className="img-fluid img2" />
                                                                </div>
                                                            </a>
                                                        </Link>
                                                    </div>
                                                }

                                                <div style={{ padding: "0px 12px" }} className="row">
                                                    {
                                                        articles.length > 2 &&
                                                        <div className="col-md-6 p-0">
                                                            <Link href={`/article/${articles[2].slug}`}>
                                                                <a rel={articles[2].isIndex?"dofollow":"nofollow"}>
                                                                    <div style={{ position: "relative" }}>
                                                                        <img src={articles[2].thumbnail} alt="" className="img-fluid img3" />
                                                                        <div className="article_img_overlay">
                                                                            <div className="article_overlay_text">
                                                                                <span className="cetagori_type">{articles[2].category.name}</span>

                                                                                <h5>{textShort(articles[2].title, 35)}  </h5>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </Link>
                                                        </div>

                                                    }

                                                    {
                                                        articles.length > 3 &&
                                                        <div className="col-md-6 p-0">
                                                            <Link href={`/article/${articles[3].slug}`}>
                                                                <a rel={articles[3].isIndex?"dofollow":"nofollow"}>
                                                                    <div style={{ position: "relative" }}>
                                                                        <img src={articles[3].thumbnail} alt="" className="img-fluid img4" />
                                                                        <div className="article_img_overlay">
                                                                            <div className="article_overlay_text">
                                                                                <span className="cetagori_type">{articles[2].category.name}</span>

                                                                                <h5>{textShort(articles[3].title, 35)}  </h5>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </Link>
                                                        </div>
                                                    }


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- ============================================ --> */}

                                <div className="blog_slide">
                                    <div style={{ padding: "0 15px" }} className="row">
                                        <div className="col-12 p-0">
                                            <div className="slick_slide">
                                                <Slider {...settings}>

                                                    {
                                                        articles.length > 4 && articles.slice(4, 9).map((article, index) => {
                                                            return (
                                                                <Link key={index} href={`/article/${article.slug}`}>
                                                                    <a rel={article.isIndex?"dofollow":"nofollow"}>
                                                                        <div className="blog_slide_item">
                                                                            <div className="blog_slide_overlay">
                                                                                <div className="blog_slide_overlay_text">
                                                                                    <span className="cetagori_type">{article.category.name}</span>

                                                                                    <h5>{textShort(article.title, 20)} </h5>

                                                                                </div>
                                                                            </div>
                                                                            <img src={article.thumbnail} alt="" />
                                                                        </div>
                                                                    </a>
                                                                </Link>
                                                            )
                                                        })
                                                    }


                                                </Slider>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- ============================================ --> */}

                            </div>


                            <div className="col-md-4 col-sm-12 margin_left mt-2">
                                <div className="blog_rightside py-3">
                                    <div className="search row  d-none d-md-block">
                                        <input
                                            placeholder="Search Blog"
                                            type="text"
                                            onKeyDown={(e) => { handleKey(e) }}
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                        />
                                        <Link href={`/article/search?search=${searchText}`}>
                                            <a><i className="fas fa-search"></i></a>
                                        </Link>
                                    </div>

                                    {
                                        articles.length > 9 && articles.slice(9, 14).map((article, index) => {
                                            return (
                                                <Link key={index} href={`/article/${article.slug}`}>
                                                    <a rel={article.isIndex?"dofollow":"nofollow"}>
                                                        <div className="post_items row">
                                                            <div className="col-md-4 col-sm-5 p-0">
                                                                <span className="blog_img">
                                                                    <img src={article.thumbnail} alt="" className="img-fluid" />
                                                                    <span className="cetagori_type">{article.category.name}</span>
                                                                </span>
                                                            </div>
                                                            <div className="col-md-8 col-sm-7 p-0 pl-2 pt-2">
                                                                <h6>{textShort(article.title, 25)}</h6>
                                                                <p>{textShort(article.description, 80)}<span >Read More <i className="fas fa-angle-double-right"></i></span></p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </Link>
                                            )

                                        })
                                    }

                                </div>

                            </div>
                        </div>
                        {/* ---------------------------------------------------------------------------------------------------------------------------------- */}
                        <div className="popular_post_heading row bg-info text-center">
                            <h5><i className="far fa-clock"></i> Popular Posts</h5>
                        </div>
                        {/* ---------------------------------------------------------------------------------------------------------------------------------- */}

                        <div className="row">
                            <div className="col-md-8 col-sm-12">
                                <div className="blog_post ptb">
                                    <div style={{ padding: "0 15px" }} className="row">

                                        {
                                            populars.length > 0 && populars.slice(0, 2).map((popular, index) => {
                                                return (
                                                    <div key={index} className="col-md-6 p-0 pr-2">
                                                        <Link href={`/article/${popular.slug}`}>
                                                            <a rel={popular.isIndex?"dofollow":"nofollow"}>
                                                                <div className="blog_post_item ">
                                                                    <div className="blog_post_img">
                                                                        <div className="blog_post_overlay">
                                                                            <div className="blog_post_overlay_text">
                                                                                <span className="cetagori_type">{popular.category.name}</span>
                                                                                <h5>{textShort(popular.title, 20)} </h5>
                                                                            </div>
                                                                        </div>
                                                                        <img src={popular.thumbnail} alt="" className="img-fluid" />
                                                                    </div>
                                                                    <div className="blog_post_text">
                                                                        <p>{textShort(popular.description, 40)}
                                                                            <Link href={`/article/${popular.slug}`}>
                                                                                <a >Read More <i className="fas fa-angle-double-right"></i></a>
                                                                            </Link>

                                                                        </p>
                                                                        <span className="d-flex justify-content-evenly p-0 mt-2">
                                                                            <span className="p-0">By -{popular.creator?.first}</span>
                                                                            <span className="p-0"><i className="far fa-eye"></i> {popular.views}</span>
                                                                            <span className="p-0">  <i className="far fa-clock"></i>{moment(popular.createdAt).format("D MMM, YYYY")}</span>

                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </Link>
                                                    </div>
                                                )
                                            })
                                        }


                                    </div>
                                </div>


                                {/* <!-- ============================================ --> */}
                                <div className="ptb">
                                    <div style={{ padding: "0 15px" }} className="row">

                                        {
                                            populars.length > 2 && populars.slice(2, 11).map((popular, index) => {
                                                return (
                                                    <div key={index} className="col-md-4 col-sm-12 p-0">
                                                        <Link href={`/article/${popular.slug}`}>
                                                            <a rel={popular.isIndex?"dofollow":"nofollow"}>
                                                                <div className="blog_item2">
                                                                    <div className="blog_item2_overlay">
                                                                        <i className="far fa-newspaper"></i>
                                                                        <div className="blog_item2_overlay_text">
                                                                            <span className="cetagori_type">{popular.category.name}</span>
                                                                            <h5>{textShort(popular.title, 15)} </h5>

                                                                        </div>
                                                                    </div>
                                                                    <img src={popular.thumbnail} alt="article thumbnail" style={{ objectFit: "cover", width: "100%" }} />
                                                                </div>
                                                            </a>
                                                        </Link>
                                                    </div>
                                                )
                                            })
                                        }


                                    </div>
                                </div>
                                {/* <!-- ============================================ --> */}
                                <div className="ptb">
                                    <div style={{ padding: "0 15px" }} className="row">
                                        <div className="col-md-6 col-sm-12 p-0 pr-2">
                                            {
                                                populars.length > 11 && populars.slice(11, 13).map((popular, index) => {
                                                    return (
                                                        <Link key={index} href={`/article/${popular.slug}`}>
                                                            <a rel={popular.isIndex?"dofollow":"nofollow"}>
                                                                <div className="blog_item">
                                                                    <span className="cetagori_type">{popular.category.name}</span>
                                                                    <h5>{textShort(popular.title, 30)}</h5>
                                                                    <span style={{ color: "rgb(107, 107, 107)", fontSize: "13px" }}>By -{popular.creator?.first}</span>
                                                                </div>
                                                            </a>
                                                        </Link>
                                                    )
                                                })
                                            }


                                        </div>
                                        <div className="col-md-6 col-sm-12 p-0 pl-2 mb-5">
                                            {
                                                populars.length > 13 && populars.slice(13, 15).map((popular, index) => {
                                                    return (
                                                        <Link key={index} href={`/article/${popular.slug}`}>
                                                            <a rel={popular.isIndex?"dofollow":"nofollow"}>
                                                                <div className="blog_item">
                                                                    <span className="cetagori_type">{popular.category.name}</span>
                                                                    <h5>{textShort(popular.title, 30)}</h5>
                                                                    <span style={{ color: "rgb(107, 107, 107)", fontSize: "13px" }}>By -{popular.creator?.first}</span>
                                                                </div>
                                                            </a>
                                                        </Link>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- ============================================ --> */}


                            </div>

                            <div className="col-md-4 col-sm-12 ">
                                {/* <!-- ====================================================== --> */}
                                <div className="trending_blog shadow-sm mt-3 sticky_position">
                                    <div id="myHeader">
                                        {/* <div className="trending_blog_item row bg-info">
                                            <h5><i className="far fa-clock"></i> Popular Post</h5>
                                        </div> */}

                                        {
                                            populars.length > 15 && populars.slice(15, 20).map((popular, index) => {
                                                return (
                                                    <Link key={index} href={`/article/${popular.slug}`}>
                                                        <a rel={popular.isIndex?"dofollow":"nofollow"}>
                                                            <div key={index} className="trending_blog_item row">
                                                                <div className="col-11 p-0">

                                                                    <h6>{textShort(popular.title, 30)}</h6>

                                                                    <span>By -{popular.creator?.first}</span>
                                                                </div>
                                                                <div className="col-1  p-0">
                                                                    <Link href={`/article/${popular.slug}`}>
                                                                        <a className="text-center"  rel={popular.isIndex?"dofollow":"nofollow"}>
                                                                            <i className="fas fa-angle-right"></i>
                                                                        </a>
                                                                    </Link>

                                                                </div>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                )
                                            })
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </section>

            </div>
        </>
    )
}



// export async function getServerSideProps(context) {

//     const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/article/recentarticle`)

//     return {
//         props: { articles: res.data.article, populars: res.data.popular }, // will be passed to the page component as props
//     }
// }

export default article
