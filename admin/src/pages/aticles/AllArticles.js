import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { useHistory } from 'react-router-dom'
import { Card, Button, Table, Space, Input, Modal, Popconfirm ,Switch} from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined,QuestionCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import parse from 'html-react-parser';
import EditArticle from './EditArticle'
const Search = Input.Search;







function Articles({isApproved}) {
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [articles, setArticles] = useState([])
    const [records, setRecords] = useState([])
    const [page, setPage] = useState(1);

    const [preview, setPreview] = useState(null)
    const [selected, setSelected] = useState(null)

    //Editor
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [body, setBody] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [selectedThumbnail, setSelectedThumbnail] = useState(null)
    const [tags, setTags] = useState('')
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [subCategory, setSubCategory] = useState('')
    const [status, setStatus] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const showModal = (article) => {
        setIsModalVisible(true);
        setPreview(article)
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setPreview(null)
    };
    const handleEditorChange = (content, editor) => {
        setBody(content)
    }

    const onEditClick = (article) => {
        setSelected(article)
        setTitle(article.title)
        setDescription(article.description)
        setBody(article.body)
        setThumbnail(article.thumbnail)
        setTags(article.tags)
        setCategory(article.category._id)
        setSubCategory(article.subCategory?._id || null)
        setStatus(article.isApproved ? 'approve' : 'pending')
    }

    const handleClean = () => {
        setSelected(null)
        setTitle("")
        setThumbnail("")
        setDescription("")
        setBody("")
        setTags("")
        setCategory("")
        setSubCategory(null)
    }

    const updateArticle = (id) => {
        if (!title || !description || !status || !category) {
            return alert("Title, description, category, status are required")
        }
        setIsSaving(true)
        let formData = new FormData()
        formData.append('title', selected.title === title ? null : title)
        formData.append('description', description)
        formData.append('category', category)
        formData.append('subCategory', subCategory)
        formData.append('status', status)
        formData.append('body', body)
        formData.append('thumbnailedit', selectedThumbnail ? selectedThumbnail : null)
        formData.append('tags', tags)


        axios.patch('/admin/editarticle/' + id, formData)
            .then(res => {
                if (res.data.success) {
                    let temp = [...records]
                    let index = temp.findIndex(article => article._id === id)
                    temp[index] = res.data.article
                    setIsSaving(false)
                    setArticles(temp)
                    setRecords(temp)
                    alert('Updated successfully')
                    handleClean()
                }
            })
            .catch(err => {
                setIsSaving(false)
                err && err.response && alert(err.response.data.error)
            })
    }

    const deleteArticle = (id) => {
        axios.delete('/admin/deletearticle/' + id)
            .then(res => {
                if (res.data.success) {
                    let temp = [...records]
                    let index = temp.findIndex(article => article._id === id)
                    temp.splice(index, 1)
                    setRecords(temp)
                    setArticles(temp)
                }
            })
            .catch(err => {
                err && err.response && alert(err.response.data.error)
            })
    }


    useEffect(() => {
        setIsLoading(true)
        axios.get(`/admin/allarticles?isApproved=${isApproved}`)
            .then(res => {
                setArticles(res.data.articles);
                setRecords(res.data.articles);
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }, [])


    const handleSearch = val => {

        if (val == "")
            setArticles(records);
        else
            setArticles(records.filter(x => x.title.includes(val)))

    }


    useEffect(() => {
        axios.get('/blogcategory/getcategory')
            .then(res => {
                if (res.data.success) {
                    setCategories(res.data.blogCategory)
                }
            })
            .catch(err => {
                err && err.response && alert(err.response.data.error)
            })
    }, [])

    useEffect(() => {
        if (category) {
            let filter = categories.filter(cat => cat._id === category)
            setSubCategories(filter[0]?.children)
        } else {
            setSubCategories([])
        }
    }, [category])

    const handleIndex=(val,id)=>{
        console.log(val,id);
        axios.patch(`/admin/index/${id}`,{isIndex:val})
        .then(res=>{
            if (res.data.success) {
                let temp = [...articles]
                let index = temp.findIndex(article=>article._id === id)
                temp[index] = res.data.article
                setArticles(temp)
            }
        })
        .catch(err => {
            err && err.response && alert(err.response.data.error)
        })
        
    }

    const columns = [
        {
            title: 'Index',
            key: 'sno',
            render: (text, object, index) => (page - 1) * 10 + index + 1

        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: cat => cat.name
        },
        {
            title: 'Blog',
            dataIndex: 'blog',
            key: 'blog',
            render: blog => blog ? blog.name : "N/A"
        },
        {
            title: 'Author',
            dataIndex: 'creator',
            key: 'creator',
            render: creator => (
                <span style={{textTransform:"capitalize"}}>{creator.first} {creator.last}</span>
            )
        },
        {
            title: 'Views',
            dataIndex: 'views',
            key: 'views',
            sorter: (a, b) => a.views - b.views,
            render: views =>
                <span>{views}</span>
        },
        {
            title: 'Status',
            key: 'isApproved',
            dataIndex: 'isApproved',
            render: isApproved => isApproved ? "Approved" : "Pending",
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: createdAt =>
                <span>{moment(createdAt).fromNow()}</span>
        },
        {
            title: 'Index',
            dataIndex: 'isIndex',
            key: 'isIndex',
            render: (isIndex,article) =>
            <Switch checked={isIndex} onChange={(val)=>handleIndex(val,article._id)} />
        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)} className='d-center' type='primary' icon={<EyeOutlined />}></Button>
                    <Button onClick={() => onEditClick(record)} className='d-center' type='primary' icon={<EditOutlined />}></Button>
                    <Popconfirm onConfirm={() => deleteArticle(record._id)} title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                        <Button className='d-center' icon={<DeleteOutlined />} danger></Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    const AllAtricles = () => (
        <Card title="All Articles">
            <Modal
                title={preview && preview.title}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="submit" type="primary" onClick={() => handleCancel()}>
                        Ok
                    </Button>,
                ]}
            >
                <section style={{ textAlign: "center" }}>
                    <img style={{ maxHeight: "200px", objectFit: "contain" }} src={preview && preview.thumbnail}></img>
                </section>
                <section>
                    <span>{preview && preview.description}</span>
                </section>
                <section>
                    {preview && parse(preview.body)}
                </section>
            </Modal>


            <Search
                placeholder="Enter title"
                onSearch={handleSearch}
                style={{ width: 200 }}
            />
            <Table
                rowKey="_id"
                //rowSelection={rowSelection}
                loading={isLoading}
                columns={columns}
                dataSource={articles}
                pagination={{ defaultPageSize: 10,current:page ,showSizeChanger: true, pageSizeOptions: ['10', '20', '30'], showQuickJumper: true, onChange: page => setPage(page) }}
            />
        </Card>
    )

    return (
        <div>
            {
                selected ?
                    <>
                        <EditArticle
                            title={title}
                            setTitle={(e) => setTitle(e.target.value)}
                            description={description}
                            setDescription={(e) => setDescription(e.target.value)}
                            category={category}
                            setCategory={(e) => setCategory(e.target.value)}
                            categories={categories}
                            subCategory={subCategory}
                            setSubCategory={(e) => setSubCategory(e.target.value)}
                            subCategories={subCategories}
                            selectedThumbnail={selectedThumbnail}
                            thumbnail={thumbnail}
                            setSelectedThumbnail={(e) => setSelectedThumbnail(e.target.files[0])}
                            status={status}
                            setStatus={(e) => setStatus(e.target.value)}
                            body={body}
                            handleEditorChange={handleEditorChange}
                            tags={tags}
                            setTags={(e) => setTags(e.target.value)}

                        />
                        <div style={{ margin: "20px 0", display: "flex", justifyContent: "flex-end" }}>
                            <Button onClick={() => handleClean()} variant="contained" style={{ background: "red", color: "white", marginRight: "10px" }}>
                                Cancle
                            </Button>
                            <Button loading={isSaving} onClick={() => updateArticle(selected._id)} variant="contained" color="secondary">
                                Save
                            </Button>

                        </div>
                    </>
                    :
                    <AllAtricles />
            }
        </div>
    )
}

export default Articles
