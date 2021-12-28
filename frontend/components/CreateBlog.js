import React,{useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Modal } from 'react-bootstrap'
function CreateBlog({show, handleClose}) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const [backdrop, setBackdrop] = useState(false);

    const Router = useRouter()

    let handleBlog = () => {
        setBackdrop(true)
        let newBlog = {
            name,
            description,
        }
        axios.post('/blog/create', newBlog)
            .then(res => {
                setBackdrop(false)
                handleClose()
                window.location.pathname = `/b/${res.data.blog.slug}`
                //Router.push(`/b/${res.data.blog.slug}`)

            })
            .catch(err => {
                setBackdrop(true)
                alert("something went wrong")
            })
    }



    return (
        <>
         <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
                    <CircularProgress color="primary" />
                </Backdrop>
        <Modal style={{ marginTop: "20vh" }} show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create new blog</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className=" mb-3">
                            <h6>Blog name:</h6>
                            <input className='form-control' value={name} onChange={(e) => setName(e.target.value)} type="text" name="textfield" placeholder="Enter title.." />
                        </div>
                        <div>
                            <h6>Discription:</h6>
                            <input className='form-control' value={description} onChange={(e) => setDescription(e.target.value)} type="text" name="textfield" placeholder="Enter descriptin.." />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn' variant="secondary" onClick={handleClose}>
                            Close
                    </button>

                        <button onClick={() => handleBlog()} className="btn float-right"> Create</button>

                    </Modal.Footer>
                </Modal>
                </>
    )
}

export default CreateBlog
