import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Card, Button, Table, Space, Image, Switch, Popconfirm, Select,Input } from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
const Search = Input.Search;



function BlogList() {
    const [isLoading, setIsLoading] = useState(false)
    const [blogs, setBlogs] = useState([])
    const [records, setRecords] = useState([])
    const [page, setPage] = useState(1);

    useEffect(()=>{
        setIsLoading(true)
        axios.get('/blog/allblogs')
        .then(res=>{
          setRecords(res.data.blog)
          setBlogs(res.data.blog)
          setIsLoading(false)
        })
        .catch(err=>{
          setIsLoading(false)
          err && err.response && alert(err.response.data.error)
        })
      },[])

      const deleteBlog=(id)=>{
        axios.delete('/admin/deleteblog/'+id)
        .then(res=>{
            if(res.data.success){
                let temp = [...records]
                let index = temp.findIndex(blog=>blog._id === id)
                temp.splice(index,1)
                setRecords(temp)
                setBlogs(temp)
            }
        })
        .catch(err=>{
          err && err.response && alert(err.response.data.error)
        })
      }

      const handleSearch = val => {

        if (val == "")
            setBlogs(records);
        else
            setBlogs(records.filter(x => x.name.includes(val)))

    }

      
  const columns = [
    {
        title: 'Index',
        key: 'sno',
        render: (text, object, index) => (page - 1) * 10 + index + 1

    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Author',
        dataIndex: 'creator',
        key: 'category',
        render: creator => <span>{creator.first}  {creator.last}</span>
    },
    {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: createdAt => moment(createdAt).fromNow()
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <Popconfirm onConfirm={() => deleteBlog(record._id)} title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                    <Button className='d-center' icon={<DeleteOutlined />} danger></Button>
                </Popconfirm>
            </Space>
        ),
    },
];

    return (
        <Card title={"Blogs"}>
             <Search
                placeholder="Enter blog name"
                onSearch={handleSearch}
                style={{ width: 200 }}
            />
            <Table
                rowKey="_id"
                //rowSelection={rowSelection}
                loading={isLoading}
                columns={columns}
                dataSource={blogs}
                pagination={{ defaultPageSize: 10,current:page ,showSizeChanger: true, pageSizeOptions: ['10', '20', '30'], showQuickJumper: true, onChange: page => setPage(page) }}
            />
        </Card>
    )
}

export default BlogList
