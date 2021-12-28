import React, { useState, useEffect } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import ShareDialogue from '../../../components/ShareDialogue'

import SecondHeader from '../../../components/SecondHeader'
import Head from "next/head";
import Navbar from '../../../components/NavbarComp'
import CreateBlog from '../../../components/CreateBlog';
import { setToast } from '../../../components/ToastMsg'

function BlogHome({ blogsserver }) {
	const [backdrop, setBackdrop] = useState(false)
	const [show, setShow] = useState(false);

	const { user, authenticated, profile } = useSelector(state => state.auth)
	const [categories, setCategories] = useState([])
	const [subCategories, setSubCategories] = useState([])
	const [selectedCategory, setSelectedCategory] = useState("all")
	const [selectedSubCategory, setSelectedSubCategory] = useState("all")

	const [blog, setBlog] = useState(null)
	const [recentArticles, setRecentArticles] = useState([])
	const [popularArticles, setPopularArticles] = useState([])

	const [searchText, setSearchText] = useState('')

	const [sharePopup, setSharePopup] = useState(false)
	const [pinned, setPinned] = useState(false)

	let Router = useRouter()
	let dispatch = useDispatch()
	let slug = Router.query.slug


	useEffect(() => {

		if (authenticated && blog && profile.pinnedblogs) {
			let index = profile.pinnedblogs.findIndex(b => b._id == blog._id)

			if (index === -1) {
				setPinned(false)
			} else {
				setPinned(true)
			}
		}
	}, [profile, blog])



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
	}, [Router])

	const fetchdata = () => {
		setBackdrop(true)
		axios.get('/blog/single/' + slug)
			.then(res => {
				if (res.data.sucess) {
					//console.log(res.data.blog)
					setBlog(res.data.blog)
					setRecentArticles(res.data.article)
					setPopularArticles(res.data.popular)
				}
				setBackdrop(false)

			})
			.catch(err => {
				err.response && Router.push('/')
				setToast("Blog not found","error")
				setBackdrop(false)

			})
	}


	useEffect(() => {
		if (selectedCategory !== 'all' && selectedSubCategory === 'all') {
			setBackdrop(true)
			axios.get(`blog/single/${slug}?category=${selectedCategory}`)
				.then(res => {
					if (res.data.sucess) {
						//console.log(res.data.blog)
						//setBlog(res.data.blog)
						setRecentArticles(res.data.article)
						setPopularArticles(res.data.popular)
					}
					setBackdrop(false)

				})
				.catch(err => {
					err.response && history.push('/')
					setBackdrop(false)

				})
		} else if (selectedCategory !== 'all' && selectedSubCategory !== 'all') {
			setBackdrop(true)
			axios.get(`blog/single/${slug}?subcategory=${selectedSubCategory}`)
				.then(res => {
					if (res.data.sucess) {
						//console.log(res.data.blog)
						//setBlog(res.data.blog)
						setRecentArticles(res.data.article)
						setPopularArticles(res.data.popular)
					}
					setBackdrop(false)

				})
				.catch(err => {
					err.response && history.push('/')
					setBackdrop(false)

				})
		}
		else {
			fetchdata()
		}
	}, [selectedCategory, selectedSubCategory])

	// useEffect(() => {
	// 	fetchdata()

	// }, [slug])

	const handlePush = () => {
		Router.push(`/article/create?blogid=${blog && blog._id}`)
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

	const handleClose = () => {

		setShow(false)
	};
	const handleShow = () => setShow(true);


	const handlePin = (id) => {
		axios.put('/user/setpinnedblog/' + id)
			.then(res => {
				dispatch({
					type: 'SET_PROFILE',
					payload: res.data.user

				})
				setToast("Shortcuts updated", "success")
			})
			.catch(err => {
				err.response && setToast(err.response.data.error, "error")
			})
	}


	const CategoriesComp = () => {
		return (
			<section id="" className="article_cetagories_part">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="cetagories_box">
								<p><i className="fas fa-check"></i> Select Categories</p>
								<Link href={`/b/${slug}`}>
									<a  className={selectedCategory === 'all' && "cetagories_box_active"} style={{ textTransform: "capitalize" }}>all</a>
								</Link>
								{
									categories && categories.map((cat, index) => {
										return (
											index < 15 && <Link href={`/b/${slug}?category=${cat.slug}`}>
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
															<Link href={`/b/${slug}?category=${cat.slug}`}>
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


	const SubCategoryComp = () => {
		return (
			<section id="" className="article_cetagories_part">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="cetagories_box">
								<p><i className="fas fa-check"></i> Select Sub Categories</p>
								<Link href={`/b/${slug}?category=${selectedCategory}`}>
									<a className={selectedSubCategory === 'all' && "cetagories_box_active"} style={{ textTransform: "capitalize" }}>all</a>
								</Link>
								{
									subCategories && subCategories.map((cat, index) => {
										return (
											index < 15 && <Link href={`/b/${slug}?category=${selectedCategory}&sub=${cat.slug}`}>
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
															<Link href={`/b/${slug}?category=${selectedCategory}&sub=${cat.slug}`}>
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
			<div id="blog_home">
				<Backdrop style={{ zIndex: "99999" }} open={backdrop}>
					<CircularProgress color="primary" />
				</Backdrop>

				<Head>
					<meta charSet="utf-8" />
					<title>{`${blogsserver ? blogsserver.name : blog ? blog.name : ""} | Flikhs`}</title>
					<meta property="og:title" content={blogsserver ? blogsserver.name : blog ? blog.name : ""} key="title" />
					<meta property="og:description" content={blogsserver ? blogsserver.description : blog ? blog.description : ""} />
					<meta property="og:image" content={blogsserver ? blogsserver.blogImage : blog ? blog.blogImage : ""} />


					{/* Twitter Meta Tags */}
					<meta property="twitter:card" content="summary_large_image" />
					{/* <meta property="twitter:url" content="https://flikhs-nextjs.vercel.app/g/my-group" /> */}
					<meta property="twitter:title" content={blogsserver ? blogsserver.name : blog ? blog.name : ""} />
					<meta property="twitter:description" content={blogsserver ? blogsserver.description : blog ? blog.description : ""} />
					<meta property="twitter:image" content={blogsserver ? blogsserver.blogImage : blog ? blog.blogImage : ""} />
				</Head>

				<SecondHeader img={blog && blog.blogImage} setSharePopup={handleSharePopup} blog={blog && blog.name} />

				<ShareDialogue hideTimeline={true} title={blog && blog.name} img={blog && blog.blogImage} sharePopup={sharePopup} handleCloseShare={handleCloseShare} data={blog && `b/${blog.slug}`} />

				<CreateBlog handleClose={handleClose} show={show} />

				{/* <!-- >>>>>>>>>>>>>>> BANNER = (START) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> --> */}
				<section id='blog' className="blog_home_banner_part">
					<div className="blog_home_overlay"></div>
					<div>
						<div className="row">
							<div className="col-md-12">
								<div >
									<Link href={`/b/${blog && blog.slug}`}>
										<a>
											<img className="blog_home_profile_img" src={blog && blog.blogImage ? blog.blogImage : '/profile.png'} alt="" />
										</a>


									</Link>
									<Link href={`/b/${blog && blog.slug}`}>
										<a className="blog_home_profile_img_a">{blog && blog.name}</a>
									</Link>
								</div>
								<nav className="navbar navbar-expand-lg mb-auto blog_nav">
									<a className="navbar-toggler ml-auto" data-toggle="collapse" data-target="#navbarNav">
										<i style={{ color: "#eee" }} className="fas fa-bars"></i>
									</a>
									<div className="collapse navbar-collapse" id="navbarNav">
										<ul className="navbar-nav ml-auto">
											<li className="nav-item">
												<Link href={`/b/${blog && blog.slug}`}>
													<a style={{ color: "white" }} className="nav-link">Home</a>
												</Link>
											</li>

											<li className="nav-item">
												<a style={{ color: "white" }} className="nav-link" href="#">About</a>
											</li>

											<li className="nav-item">
												<a style={{ color: "white" }} className="nav-link" href="#">Contact</a>
											</li>
											<li style={{ cursor: "pointer" }} className="nav-item">
												<span onClick={() => setSharePopup(true)} style={{ color: "white" }} className="nav-link">Share <i className="fas fa-share-alt"></i></span>

											</li>
											{
												authenticated && (
													<li className="nav-item dropdown">
														<a style={{ color: "white" }} className="nav-link" href="" data-toggle="dropdown">More <i className="fas fa-angle-down"></i></a>
														<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
															<a className="dropdown-item" href="#"> <i className="fas fa-user-plus"></i> Invite Members</a>
															<a onClick={() => handlePin(blog._id)} className="dropdown-item" href="#"> <i className="fas fa-thumbtack"></i> {pinned ? "Remove from" : "Pin to"} Shortcuts
														</a>
															{
																blog && user._id === blog.creator && <Link href={`/b/${slug}/setting`}>
																	<a className="dropdown-item">
																		<i className="fas fa-edit"></i> Edit Blog Settings
                                                            </a>

																</Link>
															}

															<a onClick={() => handleShow()} className="dropdown-item" href="#"> <i className="fas fa-plus-square"></i> Create new Blog</a>
														</div>
													</li>
												)
											}

										</ul>
									</div>
								</nav>

							</div>
						</div>
					</div>
				</section>



				{/* <!-- <<<<<<<<<<<<<< POST = (ENDS) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< --> */}
				<div className="blog_home_main_body shadow-sm">
					{
						blog && blog.showCategory && <CategoriesComp />
					}

					{subCategories.length > 0 && <SubCategoryComp />}


					{/* <!-- >>>>>>>>>>>>>>>  = (START) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> --> */}
					{
						authenticated && (user._id === blog?.creator) && (
							<section id="" className="blog_home_post_part">
								<div className="container">
									<div className="row">
										<div className="col-md-7">
											<div className="blog_home_post_box shadow-sm">
												<img className="blog_home_post_box_img" src='/profile.png' alt="" />
												<input onClick={() => handlePush()} className="blog_home_post_box_input" placeholder="Create a post.." type="text" readOnly />
												<a href="#"> <i className="fas fa-link .post_box_a_i"></i></a>
												<a href="#"> <i className="fas fa-image post_box_a_i"></i></a>
											</div>
										</div>
									</div>
								</div>
							</section>
						)
					}


					{/* <!-- <<<<<<<<<<<<<< POST = (ENDS) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< --> */}
					{/* <!-- >>>>>>>>>>>>>>> BLOG = (START) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> --> */}
					<section style={{ paddingTop: "10px" }} id="" className="blog_part blog_home_ptb">
						<div className="container">
							<div style={{ paddingTop: "10px" }} className="row">
								<div className="d-md-none d-sm-block">
									<div style={{ marginBottom: "17px" }} className="blog_home_rightside_search">
										<input
											value={searchText}
											onChange={(e) => setSearchText(e.target.value)} className="blog_home_rightside_search_input"
											placeholder="Search Blog"
											onKeyDown={(e) => { handleKey(e) }}
											type="text" />
										<Link href={`/article/search?search=${searchText}`}>
											<a className="blog_home_rightside_search_a">
												<i className="fas fa-search"></i>
											</a>

										</Link>
									</div>
								</div>
								<div className="col-md-7 col-sm-12 mt-3">
									<h4 style={{ marginBottom: "10px" }} className="blog_home_rightside_h4">Recent Post </h4>
									{
										recentArticles.length > 0 ?
											(
												<div className="blog_home_leftside">

													<Link href={`/article/${recentArticles && recentArticles[0].slug}`}>
														<a rel={recentArticles[0].isIndex?"dofollow":"nofollow"} className='blog_home_image_container'>
															<img className="blog_home_leftside_img" src={recentArticles && recentArticles[0].thumbnail} alt="" />
															<h4 style={{ borderRadius: "5px" }} className="blog_home_leftside_h4">
																<span className='blog_home_leftside_h4_span'>{recentArticles && recentArticles[0].title}</span></h4>
														</a>

													</Link>


													<p className="blog_home_leftside_p">
														{textShort(recentArticles && recentArticles[0].description, 120)}
														<Link href={`/article/${recentArticles && recentArticles[0].slug}`} >
															<a  rel={recentArticles[0].isIndex?"dofollow":"nofollow"} className="blog_home_leftside_btn">Read More <i className="fas fa-angle-right"></i></a>
														</Link>
													</p>
												</div>
											) :
											<p>No articles found</p>
									}

									<div className='row' style={{ marginTop: "25px" }}>
										<div className='col-md-6 col-sm-12'>
											{
												recentArticles.length > 1 && (
													<>
														<Link href={`/article/${recentArticles && recentArticles[1].slug}`}>
															<a rel={recentArticles[1].isIndex?"dofollow":"nofollow"} className='blog_home_image_container_small'>
																<img className="blog_home_leftside_img_small" src={recentArticles && recentArticles[1].thumbnail} alt="" />
																<h4 style={{ borderRadius: "5px" }} className="blog_home_leftside_h4_small">
																	<span className='blog_home_leftside_h4_span_small'>{recentArticles && recentArticles[1].title}</span></h4>
															</a>

														</Link>
														<p className="blog_home_leftside_p">
															{textShort(recentArticles && recentArticles[1].description, 37)}
															<Link href={`/article/${recentArticles && recentArticles[1].slug}`} >
																<a rel={recentArticles[1].isIndex?"dofollow":"nofollow"} className=" blog_home_leftside_btn">
																	Read More <i className="fas fa-angle-right"></i>
																</a>
															</Link>
														</p>
													</>
												)
											}

										</div>
										<div className='col-md-6 col-sm-12'>
											{
												recentArticles.length > 2 && (
													<>
														<Link href={`/article/${recentArticles && recentArticles[2].slug}`}>
															<a rel={recentArticles[2].isIndex?"dofollow":"nofollow"} className='blog_home_image_container_small'>
																<img className="blog_home_leftside_img_small" src={recentArticles && recentArticles[2].thumbnail} alt="" />
																<h4 style={{ borderRadius: "5px" }} className="blog_home_leftside_h4_small">
																	<span className='blog_home_leftside_h4_span_small'>{recentArticles && recentArticles[2].title}</span></h4>
															</a>

														</Link>
														<p className="blog_home_leftside_p">
															{textShort(recentArticles && recentArticles[2].description, 37)}
															<Link href={`/article/${recentArticles && recentArticles[2].slug}`}>
																<a rel={recentArticles[2].isIndex?"dofollow":"nofollow"} className="blog_home_leftside_btn">
																	Read More <i className="fas fa-angle-right"></i>
																</a>
															</Link>
														</p>
													</>
												)
											}
										</div>
									</div>

								</div>
								<div className="col-md-5 col-sm-12">
									<div className="blog_home_rightside">
										<div style={{ marginBottom: "17px" }} className="blog_home_rightside_search d-none d-md-block">
											<input
												value={searchText}
												onChange={(e) => setSearchText(e.target.value)} className="blog_home_rightside_search_input"
												placeholder="Search Blog"
												onKeyDown={(e) => { handleKey(e) }}
												type="text" />
											<Link href={`/article/search?search=${searchText}`}>
												<a className="blog_home_rightside_search_a">
													<i className="fas fa-search"></i>
												</a>

											</Link>
										</div>


										{
											recentArticles.length > 0 ? recentArticles.map((article, index) => {
												if (index <= 2) return
												return (
													<div key={index} className="blog_home_post_items row">

														<div className="col-md-4 col-sm-5">
															<Link href={`/article/${article.slug}`} >
																<a rel={article.isIndex?"dofollow":"nofollow"}>
																	<img className="blog_home_post_items_img" src={article.thumbnail} />
																</a>

															</Link>
														</div>
														<div className="col-md-8 col-sm-7 p-0">
															<Link href={`/article/${article.slug}`} >
																<a rel={article.isIndex?"dofollow":"nofollow"}>
																	<h6 className="blog_home_right_post_item_h6">{textShort(article.title, 25)}</h6>
																	<p className="blog_home_right_post_item_p">{textShort(article.description, 80)}
																		<Link href={`/article/${article.slug}`} >
																			<a className="blog_home_right_post_item_a">
																				Read More <i className="fas fa-angle-double-right"></i>
																			</a>

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
							</div>
						</div>
					</section>
					{/* <!-- <<<<<<<<<<<<<< BLOG = (ENDS) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< --> */}
					{/* <!-- >>>>>>>>>>>>>>> POPULAR = (START) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> --> */}
					<section style={{ marginTop: "20px" }} id="" className="blog_home_popular_part blog_home_ptb">
						<div className="container">
							<h4 style={{ marginTop: "10px" }} className="blog_home_popular_part_h4">Most Popular</h4>
							<div className="row">
								{
									popularArticles.length > 0 ? popularArticles.map((popular, index) => {
										return (
											<div key={index} className="col-md-3 col-sm-6">
												<div href="#" className="blog_home_popular_item">
													<Link href={`/article/${popular.slug}`}>
														<a rel={popular.isIndex?"dofollow":"nofollow"}>
															<img className="blog_home_popular_item_img" src={popular.thumbnail} alt="" />
															<div style={{ height: "70px" }}>
																<h6 className="blog_home_popular_item_h6">{textShort(popular.title, 85)}</h6>
															</div>


															<p className="blog_home_popular_item_p d-flex justify-content-between px-2">By- {popular.creator?.first}
																<a className="blog_post_articles_item_a" href="#"><i className="fas fa-eye"></i> {popular.views}</a>
																<span className="blog_home_popular_item_span">{moment(popular.createdAt).format("D MMM")}</span>

															</p>
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
					</section>
					{/* <!-- <<<<<<<<<<<<<< POPULAR = (ENDS) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< --> */}
				</div>

			</div>
		</>
	)
}


export async function getServerSideProps(context) {
	//console.log(encodeURI(context.params.slug));
	try {
		const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/single/${encodeURI(context.params.slug)}`)

		return {
			props: { blogsserver: res.data.blog }, // will be passed to the page component as props
		}
	} catch (error) {
		return {
			props: { blogsserver: null }
		}
	}


}

export default BlogHome
