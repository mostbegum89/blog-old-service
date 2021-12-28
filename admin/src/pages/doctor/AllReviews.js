import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { useHistory } from 'react-router-dom'
import { Card, Button, Table, Space, Input, Switch, Popconfirm, Modal ,Rate} from 'antd';
import { EditFilled, DeleteOutlined, QuestionCircleOutlined, RetweetOutlined } from '@ant-design/icons'
const Search = Input.Search;







function AllReviews() {
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(false)
    const [isReviewUpdating, setIsReviewUpdating] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)

    const [reviews, setReviews] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])

    const [selectedReview, setSelectedReview] = useState(null)
    const [selectedComment, setSelectedComment] = useState('')
    const [selectedRating, setSelectedRating] = useState(0)


    const handleCancel = () => {
        setIsModalVisible(false)
        setSelectedReview(null)
        setSelectedComment("")
        setSelectedRating(0)
    }
    const showModal = (review) => {
        setSelectedReview(review._id)
        setSelectedComment(review.comment||"")
        setSelectedRating(review.rating||0)
        setIsModalVisible(true)
    }

    const handleUpdate = () => {
        if(!selectedReview){
            return alert("Please select a review")
        }
        setIsReviewUpdating(true)

        let data={
            rating:selectedRating,
            comment:selectedComment
        }
    
        axios.patch(`/doctor/review/update/${selectedReview}`, data)
            .then(res => {
                let array = [...reviews]
                let index = array.findIndex(r => r._id === res.data.review._id)
                array[index] = res.data.review
                setReviews(array)
                setIsReviewUpdating(false)
                handleCancel()
            })
            .catch(err => {
                setIsReviewUpdating(false)
                console.log(err);
            })
    }

    const deleteReview = (id) => {
        axios.delete(`/doctor/review/delete/${id}`)
        .then(res=>{
            if(res.data.success){
                setReviews(prev=>(
                    prev.filter(review=>review._id !== id)
                ))
            }
        })
        .catch(err => {
            console.log(err);
        })
    }


    useEffect(() => {
        setIsLoading(true)
        axios.get("/doctor/allreview")
            .then(res => {
                setReviews(res.data.reviews);
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }, [])

    

    const handleTogglePublish = (val, id) => {
        setIsLoading(true)
        axios.put(`/review/togglepublish/${id}`, { isPublished: val })
            .then(res => {
                let array = [...reviews]
                let index = array.findIndex(r => r._id === res.data.review._id)
                array[index] = res.data.review
                setReviews(array)
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err);
            })
        //togglepublish
    }


    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {

            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows)
        },
    };


    const columns = [
        {
            title: 'Review By',
            dataIndex: 'name',
            key: 'name',
            render: name =>
                <span>{name||"N/A"}</span>
        },
        {
            title: 'Doctor',
            dataIndex: 'doctor',
            key: 'doctor',
            render: doctor =>
                <>
                    <span>{doctor?.general?.name}</span>
                </>
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'raging',
            sorter: (a, b) => a.rating - b.rating,
            render: rating =>
                <span>{rating}</span>

        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'raging',
            render: comment =>
                <span>{comment}</span>

        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm onConfirm={() => deleteReview(record._id)} title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                        <Button className='d-center' icon={<DeleteOutlined />} danger></Button>
                    </Popconfirm>
                    <Button onClick={() => showModal(record)} className='d-center' type='primary' icon={<EditFilled />}>Edit</Button>

                </Space>
            ),
        },
    ];

    return (
        <div>
            <Modal
                title="Review"
                zIndex={1111}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={() => handleCancel()}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={isReviewUpdating} onClick={() => handleUpdate()}>
                        Update
                    </Button>,
                ]}
            >
                <Rate value={selectedRating} onChange={val => setSelectedRating(val)} />
                <p>Comment</p>
                <Input.TextArea
                    placeholder="Write your comment here"
                    value={selectedComment}
                    onChange={e => setSelectedComment(e.target.value)}
                />
                
               
            </Modal>
            <Card title="Product Reviews">

                <Table
                    rowKey="_id"
                    //rowSelection={rowSelection}
                    loading={isLoading}
                    columns={columns}
                    dataSource={reviews}
                    pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'], showQuickJumper: true }}
                />
            </Card>
        </div>
    )
}

export default AllReviews
