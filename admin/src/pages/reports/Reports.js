import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { useHistory } from 'react-router-dom'
import { Card, Button, Table, Space, Input, Switch, Popconfirm, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, QuestionCircleOutlined, RetweetOutlined, SafetyOutlined } from '@ant-design/icons'
const Search = Input.Search;







function Reports() {
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(false)

    const [page, setPage] = useState(1)

    const [reports, setReports] = useState([])


    const markSafe = (id) => {
        axios.delete(`/report/${id}`)
            .then(res => {
                if (res.data.success) {
                    setReports(prev => (prev.filter(report => report._id !== id)))
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const loadAllReports=()=>{
        setIsLoading(true)
        axios.get("/report/allreports")
            .then(res => {
                setReports(res.data.reports);
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }


    useEffect(() => {
        loadAllReports()
    }, [])


    const deleteContent = (id) => {
        axios.delete(`/report/deletecontent/${id}`)
            .then(res => {
                loadAllReports()
            })
            .catch(err => {
                console.log(err);
            })
    }




    const columns = [
        {
            title: 'Index',
            key: 'sno',
            render: (text, object, index) => (page - 1) * 10 + index + 1

        },
        {
            title: 'Reported By',
            dataIndex: 'reportedBy',
            key: 'reportedBy',
            render: reportedBy =>
                <>
                    <span>{reportedBy.first}</span> <span>{reportedBy.last}</span>
                </>
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: type =>
                <>
                    <span>{type}</span>
                </>,
            filters: [
                { text: 'Adult Content', value: "Adult Content" },
                { text: 'Nudity', value: "Nudity" },
                { text: 'Fake Name', value: "Fake Name" },
                { text: 'Fake Account', value: "Fake Account" },
                { text: 'Fake News', value: "Fake News" },
                { text: 'Spam', value: "Spam" },
                { text: 'Harassment', value: "Harassment" },
                { text: 'Something Else', value: "Something Else" },
            ],
            onFilter: (value, record) => record.type == value
        },
        {
            title: 'View',
            dataIndex: 'post',
            key: 'post',
            render: post =>
                post ? <a href={`${process.env.REACT_APP_CLIENT}/post/${post.slug}`} target="_blank">
                    <Button className='d-center' type='primary' size='small' icon={<EyeOutlined />}>View</Button>
                </a> : "Post not found"


        },
        {
            title: 'Mark as safe',
            key: 'safe',
            render: (text, record) =>
                <Popconfirm onConfirm={() => markSafe(record._id)} title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                    <Button className='d-center' type='primary' size='middle' icon={<SafetyOutlined />}></Button>
                </Popconfirm>

        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm onConfirm={() => deleteContent(record.post._id)} title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                        <Button className='d-center' icon={<DeleteOutlined />} danger>Delete content</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card title="All Reports">

                <Table
                    rowKey="_id"
                    //rowSelection={rowSelection}
                    loading={isLoading}
                    columns={columns}
                    dataSource={reports}
                    pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'], showQuickJumper: true, onChange: page => setPage(page) }}
                />
            </Card>
        </div>
    )
}

export default Reports
