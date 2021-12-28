import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Card, Button, Table, Space, Image, Switch, Popconfirm, Select,Input } from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined,SearchOutlined } from '@ant-design/icons'
import moment from 'moment'
import {useHistory} from 'react-router-dom'
const Search = Input.Search;



function ApprovedDoctor() {
    let history = useHistory()
    const [isLoading, setIsLoading] = useState(false)
    const [doctors, setDoctors] = useState([])
    

    const [query, setQuery] = useState('')

    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const fetchDoctor=(options)=>{
        setIsLoading(true)
        axios.post('/doctor/getall/approved',options)
        .then(res=>{
            setDoctors(res.data.doctors)
            setTotal(res.data.count)
            setCurrentPage(options.page)
          setIsLoading(false)
        })
        .catch(err=>{
          setIsLoading(false)
          err && err.response && alert(err.response.data.error)
        })
    }

    useEffect(()=>{
        fetchDoctor({ page: 1, limit: 30, sort_by: "newest" })
      },[])

      const deleteDoctor=(id)=>{
        axios.delete('/doctor/deletedoctor/'+id)
        .then(res=>{
            if(res.data.success){
                let temp = [...doctors]
                let index = temp.findIndex(doc=>doc._id === id)
                temp.splice(index,1)
                setDoctors(temp)
                
            }
        })
        .catch(err=>{
          err && err.response && alert(err.response.data.error)
        })
      }

   

      
  const columns = [
    {
        title: 'Index',
        key: 'sno',
        render: (text, object, index) => (currentPage - 1) * 30 + index + 1

    },
    {
        title: 'Image',
        key: 'profileImage',
        dataIndex: 'profileImage',
        render: (profileImage) => <Image width={100} src={profileImage} fallback={'https://www.peregrine-bryant.co.uk/img/uploadsfiles/2018/05/placeholder-test.png'} />

    },
    {
        title: 'Name',
        dataIndex: 'general',
        key: 'name',
        render: general => <span>{general.name}</span>
    },
    {
        title: 'Title',
        dataIndex: 'general',
        key: 'title',
        render: general => <span>{general.title}</span>
    },
    {
        title: 'Gender',
        dataIndex: 'general',
        key: 'gender',
        render: general => <span>{general.gender||"N/A"}</span>
    },

    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <Button className='d-center' onClick={()=>history.push(`/doctor/details/${record._id}`)} icon={<EditOutlined/>}></Button>
                <Popconfirm onConfirm={() => deleteDoctor(record._id)} title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                    <Button className='d-center' icon={<DeleteOutlined />} danger></Button>
                </Popconfirm>
            </Space>
        ),
    },
];

    return (
        <Card title={"Approved Doctor"}>
             <div>
                <Input style={{ width: "300px" }} size='large' onChange={(e) => setQuery(e.target.value)} value={query} placeholder='Enter doctor name' />
                <Button
                    onClick={() => fetchDoctor({ page: 1, limit: 30, sort_by: "newest",  query })}
                    size='large'
                    type='primary'
                    icon={<SearchOutlined />} />
            </div>
            <Table
                rowKey="_id"
                //rowSelection={rowSelection}
                loading={isLoading}
                columns={columns}
                dataSource={doctors}
                pagination={{current:currentPage, defaultPageSize: 30, showSizeChanger: false, showQuickJumper: false, total: total, onChange: (val) => { fetchDoctor({ page: val, limit: 30, sort_by: "newest", query }) } }}
            />
        </Card>
    )
}

export default ApprovedDoctor
