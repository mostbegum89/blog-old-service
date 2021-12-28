import React,{useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Modal } from 'react-bootstrap'


function CreateGroup({show, handleClose}) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [privacy, setPrivacy] = useState('public')

    const [backdrop, setBackdrop] = useState(false);

    const Router = useRouter()

   

    let handleGroup = () => {
        setBackdrop(true)
        let newGroup = {
            name,
            description,
            privacy
        }
        axios.post('/group/create', newGroup)
            .then(res => {
                setBackdrop(false)
               window.location.pathname = `/g/${res.data.group.slug}`

            })
            .catch(err => {
                setBackdrop(false)
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
                        <Modal.Title>Create new group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className=" mb-3">
                            <h6>Group Name: </h6>
                            <input className='form-control' value={name} onChange={(e) => setName(e.target.value)} type="text" name="textfield" placeholder="Enter group name..." />
                        </div>
                        <div className=" mb-3">
                            <h6>Discription:</h6>
                            <input className='form-control' value={description} onChange={(e) => setDescription(e.target.value)} type="text" name="textfield" placeholder="Enter descriptin.." />
                        </div>
                        <div>
                            <h6 for="exampleFormControlSelect1">Select privacy</h6>
                            <select value={privacy} onChange={(e) => setPrivacy(e.target.value)} className="form-control" id="exampleFormControlSelect1">
                                <option value='public'>Public</option>
                                <option value='private'>Private</option>
                            </select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn' variant="secondary" onClick={handleClose}>
                            Close
                    </button>

                    <button onClick={() => handleGroup()} className="btn float-right"> Create</button>

                    </Modal.Footer>
                </Modal>
                </>
    )
}

export default CreateGroup
