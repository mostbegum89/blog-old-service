import React, { useEffect, useState } from 'react'
// import dynamic from 'next/dynamic'
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { useRouter } from 'next/router'
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react'
import { setToast } from '../../components/ToastMsg'
//const { Editor } = dynamic(()=>import ("@tinymce/tinymce-react"),{ssr:false})
import Navbar from '../../components/NavbarComp'
import protectedRoute from '../../helper/protectedRoute'
import {resizeFile,dataURIToBlob} from '../../helper/imageResize'



function CreateBlogPost() {
	const [backdrop, setBackdrop] = useState(false)
	let Router = useRouter()
	

	const [categories, setCategories] = useState([])
	const [subCategories, setSubCategories] = useState([])

	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [article, setArticle] = useState("")
	const [category, setCategory] = useState("")
	const [subCategory, setSubCategory] = useState("")
	const [tags, setTags] = useState("")
	const [thumbnail, setThumbnail] = useState("")
	const [link1, setLink1] = useState("")
	const [link2, setLink2] = useState("")
	const [link3, setLink3] = useState("")

	const [blogId, setBlogId] = useState("")
	const [checked, setChecked] = useState(false)


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
		//console.log(category);
		if(category && category !== 'option'){
			let filtered = categories.filter(cat=>cat._id === category)
			setSubCategories(filtered[0].children)
		}else if(category === 'option'){
			setSubCategories([])
		}
	}, [category])


	useEffect(() => {
		//console.log(window.location.search.split('=')[1])
		if (window.location.search.split('=')[1]) {
			setBlogId(window.location.search.split('=')[1]);
		} else if (window.location.search.split('=')[1] === undefined) {
			setBlogId('')
		}
	}, [Router])

	const handleEditorChange = (content, editor) => {
		setArticle(content)
	}

	const handleSave = async() => {
		if (title.length < 10) {
			return alert("title should be more then 10 words")
		}
		if (description.length < 32) {
			return alert("description should be more then 32 words")
		}
		if (category == '' || category == 'option') {
			return alert("please select a category")
		}
		if (thumbnail == '') {
			return alert("Thumbnail is required")
		}
		if (article == '') {
			return alert("article is required")
		}

		//console.log(category, subCategory);

		setBackdrop(true)
		const imageConverted = await resizeFile(thumbnail);
		let formData = new FormData()
		formData.append("title", title)
		formData.append("description", description)
		formData.append("thumbnail",  dataURIToBlob(imageConverted))
		formData.append("body", article)
		formData.append("category", category)
		if(subCategory !== ''  && subCategory !== 'option'){
			formData.append("subCategory", subCategory)
		}
		
		formData.append("article1", link1)
		formData.append("article2", link2)
		formData.append("article3", link3)
		formData.append("tags", tags)
		formData.append("blog", blogId)
		axios.post("/article/create", formData)
			.then(res => {
				//console.log(res.data.blog.blog)
				setTitle("")
				setDescription("")
				setArticle("")
				setCategory("")
				setThumbnail("")
				setLink1("")
				setLink2("")
				setLink3("")
				setTags("")
				setBackdrop(false)
				setToast("Thank you for submitting your post", "success")
				setTimeout(() => {
					if (blogId !== '') {
						Router.push(`/b/${res.data.blog.blog.slug}`)
					} else {
						Router.push(`/articles`)
					}
				}, 5000);
			})
			.catch(err => {
				setBackdrop(false)
				err && err.response && alert(err.response.data.error)
			})
	}


	return (
        <>
        <Navbar />
		<div id="create_blog_container">
			<Backdrop style={{ zIndex: "99999" }} open={backdrop}>
				<CircularProgress color="primary" />
			</Backdrop>
			<div style={{ paddingBottom: "50px" }} className="create_blog_main_body shadow-sm">
				{/* <!-- >>>>>>>>>>>>>>> ARTICAL = (START) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> --> */}
				<section id="" className="create_blog_artical_part">
					<div className="container">
						<div className="row">
							<div className="col-12">
								<h4 className="create_blog_artical_part_h4">Create a new Artical</h4>
							</div>
							<div className="col-md-7">
								<div className="create_blog_artical_left">
									<h6 className="create_blog_artical_left_h6">Title</h6>
									<input
										type="text"
										className="form-control create_blog_artical_left_input"
										placeholder="Title should more than 10 characters"
										onChange={(e) => setTitle(e.target.value)}
										value={title}
									/>
									<h6 className="create_blog_artical_left_h6">Description</h6>
									<textarea
										type="text"
										className="form-control create_blog_artical_left_input"
										placeholder="Description should be more than 32 characters"
										onChange={(e) => setDescription(e.target.value)}
										value={description}
										style={{ height: "100px" }}
									/>

									{/* <textarea className="create_blog_article_left_textbox_textarea" name="textarea" placeholder="Write your Artical"></textarea> */}


								</div>

							</div>
							<div className="col-md-5">
								<div className="create_blog_artical_right">
									<h6 className="create_blog_artical_right_h6">Thumbnail</h6>
									<div style={thumbnail ? { backgroundImage: `url(${URL.createObjectURL(thumbnail)})` } : null} className="create_blog_artical_right_file">
										<input
											className="create_blog_artical_right_file_input"
											accept="image/*"
											type="file"
											name="file"
											onChange={(e) => setThumbnail(e.target.files[0])}
											id="" />
										<label className="create_blog_artical_right_file_label" htmlFor="file"><i className="fas fa-upload"></i> Upload Your Image</label>
									</div>

								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-12'>
								<div className="create_blog_article_left_textbox">
									<Editor
										initialValue="<p></p>"
										apiKey="91als7opdgzbord7g1svxmwnzu364m2bj3nc5n1wzrzj0hnr"
										init={{
											height: 500,
											menubar: true,
											plugins: [
												'advlist autolink lists link image charmap print preview anchor',
												'searchreplace visualblocks code fullscreen',
												'insertdatetime media table paste code imagetools wordcount'
											],
											toolbar:
												'undo redo | formatselect | bold italic backcolor | link image media \
										alignleft aligncenter alignright alignjustify | \
										bullist numlist outdent indent | removeformat |',
											automatic_uploads: true,
											relative_urls: false,
											images_upload_url: "/article/articleimages",
											images_upload_handler: function (blobinfo, success, failure) {
												let headers = new Headers()
												headers.append('Accept', 'Application/JSON')

												let formData = new FormData()
												formData.append("articleimages", blobinfo.blob(), blobinfo.filename())

												axios.post('/article/articleimages', formData)
													.then(res => {
														success(res.data.imgUrl)
													})
													.catch(() => failure('http error'))
											}
										}}
										onEditorChange={handleEditorChange}
										value={article}
									/>
								</div>
							</div>

						</div>


						<div className='row'>
							<div className='col-md-7 col-sm-12'>
								{/* <h6 className="create_blog_artical_left_h6 my-2">Related Article (Options)</h6>
								<input type="text" className="form-control" placeholder="https://yoursitename.com/your_artical_link" />
								<h6 className="create_blog_artical_left_h6 my-2">Related Article (Options)</h6>
								<input type="text" className="form-control" placeholder="https://yoursitename.com/your_artical_link" />
								<h6 className="create_blog_artical_left_h6 my-2">Related Article (Options)</h6>
								<input type="text" className="form-control" placeholder="https://yoursitename.com/your_artical_link" /> */}


								<h6 className="create_blog_artical_right_h6 my-2">Category</h6>
								<select
									className="create_blog_artical_right_select"
									onChange={(e) => setCategory(e.target.value)}
									value={category}
									placeholder='select a category'
									name="selectoptions">
									

									 <option className="create_blog_artical_right_select_option" value='option' >Select a category</option> 

									{
										categories && categories.map((cat, index) => {
											return (
												<option
													key={index}
													value={cat._id}
													className="create_blog_artical_right_select_option" >{cat.name}
												</option>
											)
										})
									}

								</select>
								{/* <p className="create_blog_artical_right_p my-2">or <a className="create_blog_artical_right_p_a my-2" href="#"> <i className="fas fa-plus"></i> Add New Category</a></p> */}


								<h6 className="create_blog_artical_right_h6 my-2">Sub Category</h6>
								<select
									className="create_blog_artical_right_select"
									onChange={(e) => setSubCategory(e.target.value)}
									value={subCategory}
									name="selectoptions">

									<option className="create_blog_artical_right_select_option" value="option">Select a sub category</option>

									{
										subCategories && subCategories.map((cat, index) => {
											return (
												<option
													key={index}
													value={cat._id}
													className="create_blog_artical_right_select_option" >{cat.name}
												</option>
											)
										})
									}

								</select>
							</div>
							
							<div className='col-md-5 col-sm-12'>

								<h6 style={{marginTop:"10px"}}>Tags</h6>
								<input
									onChange={(e) => setTags(e.target.value)}
									value={tags}
									type="text"
									className="form-control my-2 create_blog_artical_right_p_input" placeholder="tags1, tags2, tags3..." />
								<p className='my-3'>
									<input
										type="checkbox"
										name="checkbox"
										checked={checked}
										onChange={(e) => setChecked(!checked)}
									/> Agree to terms and conditions</p>
								<button disabled={!checked} onClick={() => handleSave()} className="btn create_post_article_right_btn">Submit to Review</button>
							</div>
						</div>

					</div>
				</section>
				{/* <!-- <<<<<<<<<<<<<< ARTICAL = (ENDS) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< --> */}
			</div>
		</div>
        </>
	)
}

export default protectedRoute(CreateBlogPost)
