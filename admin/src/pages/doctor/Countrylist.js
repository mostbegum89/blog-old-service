import React, { useState, useEffect } from 'react';
import {

    IconButton,
} from '@material-ui/core';



import axios from 'axios'
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';



import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import AddIcon from '@material-ui/icons/Add';



import { Card, Button, Modal,Input } from 'antd'

const CountryList = () => {

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false)


    const [countries, setCountries] = useState([])
    const [name, setName] = useState("")
    const [edit, setEdit] = useState(null)
    const [parent, setParent] = useState(null)

    const fetchCountries = () => {
        setLoading(true)
        axios.get("/doctor/country/get")
            .then(res => {
                setLoading(false)
                setCountries(res.data.countries)
            })
    }

    useEffect(() => {
        fetchCountries()
    }, [])




    const handleClickOpen = (cat) => {

        setParent(cat || null)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEdit(null)
        setParent(null)
        setName('')
    };

    const handleEdit = (item) => {
        setEdit(item)
        setName(item.name)
        handleClickOpen()
    }

    const handleAdd = () => {
        let data = {
            name
        }
        if (parent) {
            data.parentId = parent._id
        }
        axios.post('/doctor/country/create', data)
            .then(res => {
                if (res.data.success) {
                    // setCategories([...categories, res.data.category])
                    fetchCountries()
                    handleClose()
                }
            })
            .catch(err => {
                err && err.response && alert(err.response.data.error)
            })
    }

    const handleSaveEdit = (cat) => {
        let data = {
            name
        }
        axios.post('/doctor/country/edit/' + cat._id, data)
            .then(res => {
                if (res.data.success) {
                    // let temp = [...categories]
                    // let index = temp.findIndex(c => c._id === cat._id)
                    // temp[index] = res.data.category
                    // setCategories(temp)
                    fetchCountries()
                    handleClose()
                }
            })
            .catch(err => {
                err && err.response && alert(err.response.data.error)
            })

    }

    const handleDelete = (cat) => {
        if (cat.children.length) {
            return alert("Plesae delete cities  first")
        }
        let consent = window.confirm('Are you sure')
        if (!consent) return
        axios.delete('/doctor/country/delete/' + cat._id)
            .then(res => {
                if (res.data.success) {
                    // let temp = [...categories]
                    // let index = temp.findIndex(c => c._id === id)
                    // temp.splice(index, 1)
                    // setCategories(temp)
                    fetchCountries()
                    handleClose()
                }
            })
            .catch(err => {
                err && err.response && alert(err.response.data.error)
            })
    }


    return (
        <>


                <Modal
                    title={parent ? "Add City" : "Add Country"}
                    visible={open}
                    onCancel={() => handleClose()}
                    footer={[
                        <Button onClick={handleClose} >
                            Cancle
                        </Button>,
                        edit ? <Button onClick={() => handleSaveEdit(edit)} type='primary'>
                            Edit
                        </Button> :
                            <Button onClick={() => handleAdd()} type='primary'>
                                Add
                            </Button>

                    ]}
                >
                    {
                        parent && <span><strong>Country: </strong>{parent.name}</span>
                    }

                    <label style={{display:"block",margin:"10px 0"}} htmlFor="name">Name</label>
                    <Input value={name} onChange={e=>setName(e.target.value)} />

                </Modal>
          








            <Card title={
                <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span>Countries/Cities</span>
                    <Button onClick={() => handleClickOpen()} type='primary'>Add Country</Button>
                </div>
            }
            loading={loading}
            >
        


                    <TreeView

                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                    >

                        {
                            countries.length > 0 ? countries.map((country, index) => {
                                return (

                                    <TreeItem
                                        key={index}
                                        nodeId={country._id}
                                        label={
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                {country.name}
                                                <div>
                                                    <IconButton onClick={() => handleClickOpen(country)}><AddIcon color='primary' /></IconButton>
                                                    <IconButton onClick={() => handleEdit(country)}><EditIcon /></IconButton>
                                                    <IconButton onClick={() => handleDelete(country)}><DeleteForeverIcon style={{ color: "red" }} /></IconButton>
                                                </div>
                                            </div>
                                        }>
                                        {
                                            country && country.children.length > 0 && country.children.map(child => {
                                                return (
                                                    <TreeItem
                                                        key={child._id}
                                                        nodeId={child._id}
                                                        label={
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                {child.name}
                                                                <div><IconButton onClick={() => handleEdit(child)}><EditIcon /></IconButton><IconButton onClick={() => handleDelete(child)}><DeleteForeverIcon style={{ color: "red" }} /></IconButton>
                                                                </div>
                                                            </div>
                                                        }

                                                    />
                                                )
                                            })
                                        }


                                    </TreeItem>

                                )
                            }) :
                                <p>No categories found</p>
                        }

                    </TreeView>




               
            </Card>
        </>
    );
};

export default CountryList;
