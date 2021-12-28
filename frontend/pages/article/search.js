import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Navbar from '../../components/NavbarComp'
function ArticleSearch() {
    let Router = useRouter()
    const [backdrop, setBackdrop] = useState(false)

    const [search, setSearch] = useState('')
    const [searchText, setSearchText] = useState('')


    const [articles, setArticles] = useState([])

    const fetchData = (text) => {
        if (text) {
            setBackdrop(true)
            axios.get(`/article/search?search=${text}`)
                .then(res => {
                    setArticles(res.data.article)
                    setBackdrop(false)
                })
                .catch(err => {
                    setBackdrop(false)
                    alert('something went wrong')
                })
        }
    }

    useEffect(() => {
        if (window.location.search.split('=')[1]) {
            let query = window.location.search.split('=')[1].replace(/%20/g, ' ')
            setSearch(decodeURI(query));
            setSearchText(decodeURI(query));
            fetchData(query)
            //console.log(decodeURI(query))
        } else if (window.location.search.split('=')[1] === undefined) {
            setSearch('')
            setSearchText('')
        }
    }, [Router])


    const texShort = (text, index) => {
        let shortend
        if (text.length > index) {
            shortend = text.slice(0, index) + "..."
        } else {
            shortend = text.slice(0, index)
        }
        return shortend
    }


    return (
        <>
        <Navbar />
        <div id='blog_home' style={{ background: "white", minHeight: "100vh", marginTop: "2vh" }}>
            <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
                <CircularProgress color="primary" />
            </Backdrop>
            <div style={{ padding: "20px 6vw" }}>
                <div className='row' >
                    <div style={{ width: "60%" }} className="blog_home_rightside_search">
                        <input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)} className="blog_home_rightside_search_input"
                            placeholder="Search Blog"
                            type="text" />
                        <Link href={`/article/search?search=${searchText}`}>
                            <a className="blog_home_rightside_search_a"><i className="fas fa-search"></i></a>
                            </Link>
                    </div>

                </div>

                <div style={{ marginTop: "20px" }}>
                    {
                        articles.length > 0 ? articles.map((article, index) => {
                            return (
                                <div key={index} className="blog_home_post_items row">

                                    <div className="col-md-4 col-sm-5">
                                        
                                        <Link href={`/article/${article.slug}`} >
                                        <a>
                                        <img style={{ objectFit: "cover", width: "100%", height: "150px" }} className="blog_home_post_items_img" src={article.thumbnail} alt="" />
                                        </a>
                                        </Link>
                                    </div>
                                    <div className="col-md-8 col-sm-7 p-0">
                                        <Link href={`/article/${article.slug}`} >
                                            <a>
                                            <h6 className="blog_home_right_post_item_h6">{texShort(article.title, 100)}</h6>
                                            <p className="blog_home_right_post_item_p">{texShort(article.description, 160)} 
                                            <Link href={`/article/${article.slug}`} >
                                                <a className="blog_home_right_post_item_a">Read More <i className="fas fa-angle-double-right"></i></a>
                                            </Link></p>
                                            </a>
                                            
                                        </Link>
                                    </div>
                                </div>
                            )
                        }) :
                            <p>No articles found</p>
                    }
                </div>
            </div>

        </div >
        </>
    )
}

export default ArticleSearch
