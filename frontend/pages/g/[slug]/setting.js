import React, { useEffect, useState } from 'react'
import GroupLayout from '../../../components/GroupLayout'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'


import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Modal } from 'react-bootstrap'
import { setToast } from '../../../components/ToastMsg'

import Button from '@material-ui/core/Button';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import protectedRoute from '../../../helper/protectedRoute'
import {resizeFile,dataURIToBlob} from '../../../helper/imageResize'


function GroupSetting() {
    const { user } = useSelector(state => state.auth)
    let Router = useRouter()



    const [group, setGroup] = useState({})
    const [rules, setRules] = useState([])
    const [openDialogue, setOpenDialogue] = useState(false);

    const [backdrop, setBackdrop] = useState(false)

    //General setting
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [privacy, setPrivacy] = useState('')
    const [postPermission, setPostPermission] = useState(true)
    const [memberApproval, setMemberApproval] = useState(false)
    const [postApproval, setPostApproval] = useState(false)
    const [postType, setPostType] = useState('general')
    const [showCategory, setShowCategory] = useState(false)

    //rules
    const [ruleTitle, setRuleTitle] = useState('')
    const [ruleDescription, setRuleDescription] = useState('')
    const [selectToEdit, setSelectToEdit] = useState(null)

    //category
    const [cateName, setCateName] = useState('')
    const [catList, setCatList] = useState([])

    //approvedlink
    const [apperror, setAppError] = useState(null)
    const [approvedLink, setApprovedLink] = useState('')
    const [approvedLinkList, setApprovedLinkList] = useState([])

    //blockedlink
    const [blockerror, setBlockError] = useState(null)
    const [blockedLink, setBlockedLink] = useState('')
    const [blockedLinkList, setBlockedLinkList] = useState([])

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setSelectToEdit(null)
        setRuleTitle('')
        setRuleDescription('')
        setShow(false)
    };
    const handleShow = () => setShow(true);

    let  slug  = Router.query.slug

    //fetch all setting
    useEffect(() => {
        if(!slug || !user._id) return
        setBackdrop(true)
        axios.get('/group/' + slug)
            .then(res => {
                if (res.data.group.creator == user._id) {
                    setGroup(res.data.group)
                    setName(res.data.group.name)
                    setUrl(res.data.group.slug)
                    setDescription(res.data.group.description)
                    setPrivacy(res.data.group.privacy)
                    setPostPermission(res.data.group.postpermission)
                    setMemberApproval(res.data.group.memberapproval)
                    setPostApproval(res.data.group.postapproval)
                    setPostType(res.data.group.posttype)
                    setShowCategory(res.data.group.showcategory)
                    setRules(res.data.group.rules)
                    setCatList(res.data.group.category)
                    setApprovedLinkList(res.data.group.approvedlink)
                    setBlockedLinkList(res.data.group.blockedlink)
                    setBackdrop(false)
                } else {
                    setBackdrop(false)
                    window.location.pathname = `/g/${res.data.group.slug}`

                }
            })
            .catch(err => {
                setBackdrop(false)
                err.response && Router.push('/')

            })
    }, [slug,user])

    //save edited setting
    let handleSubmit = () => {
        setBackdrop(true)
        let edited = {
            name,
            slug: url,
            description,
            privacy,
            postpermission: postPermission,
            memberapproval: memberApproval,
            postapproval: postApproval,
            posttype: postType,
            showcategory: showCategory

        }
        axios.put('/group/edit/' + slug, edited)
            .then(res => {
                setGroup(res.data.group)
                setName(res.data.group.name)
                setUrl(res.data.group.slug)
                setDescription(res.data.group.description)
                setPrivacy(res.data.group.privacy)
                setPostPermission(res.data.group.postpermission)
                setMemberApproval(res.data.group.memberapproval)
                setPostApproval(res.data.group.postapproval)
                setPostType(res.data.group.posttype)
                setShowCategory(res.data.group.showcategory)
                setBackdrop(false)
                setToast("Updated successfully", "success")
                Router.push(`/g/${res.data.group.slug}/setting`)
            })
            .catch(err => {
                err.response && setToast("something went wrong", "error")
                Router.push('/')
            })
    }

    //create new rule
    let handleCreate = () => {
        let newRule = {
            title: ruleTitle,
            description: ruleDescription
        }
        axios.put('/group/addrule/' + slug, newRule)
            .then(res => {
                setRules(res.data.rules)
                setRuleTitle('')
                setRuleDescription('')
                setShow(false)

            })
    }

    //delete rule
    let handlRuleDelete = (id) => {
        axios.patch('/group/deleterule/' + slug, { ruleid: id })
            .then(res => {
                setRules(res.data.rules)
            })
    }

    //edit rule
    let handleEdit = (rule) => {
        setSelectToEdit(rule._id)
        setRuleTitle(rule.title)
        setRuleDescription(rule.description)
        setShow(true)
    }

    //save edited rule
    let saveEditedRule = () => {
        let newRule = {
            title: ruleTitle,
            description: ruleDescription,
            ruleid: selectToEdit
        }

        axios.patch('/group/editrule/' + slug, newRule)
            .then(res => {
                setRules(res.data.rules)
                setRuleTitle('')
                setRuleDescription('')
                setShow(false)
            })
    }


    //handle category

    let handleaddCat = () => {
        axios.put('/group/addcategory/' + slug, { name: cateName })
            .then(res => {
                setCatList(res.data.category)
                setCateName('')
            })
    }
    let deleteCat = (name) => {
        axios.put('/group/deletecategory/' + slug, { name })
            .then(res => {
                setCatList(res.data.category)

            })
    }

    //handle Approved link
    let handleAddApprove = () => {

        if (approvedLink.startsWith("http://")) {
            return setAppError("Invalid link")
        } else if (approvedLink.startsWith("https://")) {
            return setAppError("Invalid link")
        } else if (approvedLink.length < 5) {
            return setAppError("Invalid link")
        }
        else if (approvedLink.startsWith("www.")) {
            axios.put('/group/addapprovedlink/' + slug, { name: approvedLink })
                .then(res => {
                    setApprovedLinkList(res.data.approvedlink)
                    setApprovedLink('')
                    setAppError(null)

                })
        } else {
            return setAppError("Invalid link")
        }

    }
    let deleteApprove = (name) => {
        axios.put('/group/deleteapprovedlink/' + slug, { name })
            .then(res => {
                setApprovedLinkList(res.data.approvedlink)

            })
    }

    //handle Blocked Link
    let handleAddBlocked = () => {
        if (blockedLink.startsWith("http://")) {
            return setBlockError("Invalid link")
        } else if (blockedLink.startsWith("https://")) {
            return setBlockError("Invalid link")
        } else if (blockedLink.startsWith("www.")) {

            axios.put('/group/addblockedlink/' + slug, { name: blockedLink })
                .then(res => {
                    setBlockedLinkList(res.data.blockedlink)
                    setBlockedLink('')
                    setBlockError(null)
                })
        } else {
            return setBlockError("Invalid link")
        }

    }
    let deleteBlocked = (name) => {
        axios.put('/group/deleteblockedlink/' + slug, { name })
            .then(res => {
                setBlockedLinkList(res.data.blockedlink)

            })
    }


    //group image

    let handleGroupImg = async(img) => {
        setBackdrop(true)
        if (img) {
            const imageConverted = await resizeFile(img);
            let formData = new FormData()
            formData.append('groupimg', dataURIToBlob(imageConverted))
            axios.put('/group/groupimg/' + slug, formData)
                .then(res => {
                    setGroup(res.data.group)
                    setBackdrop(false)
                })
        }

    }

    //group cover image
    let handleCoverImg = async(img) => {
        setBackdrop(true)
        if (img) {
            const imageConverted = await resizeFile(img);
            let formData = new FormData()
            formData.append('groupcover', dataURIToBlob(imageConverted))
            axios.put('/group/groupcover/' + slug, formData)
                .then(res => {
                    setGroup(res.data.group)
                    setBackdrop(false)
                })
        }
    }


    //group delete dialogue
    const handleCloseDialogue = () => {
        setOpenDialogue(false);
    };

    const handleDeleteGroup = () => {
        setBackdrop(true)
        axios.patch('/group/delete/' + group._id)
            .then(res => {
                if (res.data.success) {

                    setToast("Deleted successfully", "info")
                    setOpenDialogue(false)
                    setBackdrop(false)
                    Router.push('/')
                }
            })
    }



    return (
        <GroupLayout group={group && group} setting={true}>
            <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
                <CircularProgress color="primary" />
            </Backdrop>

            {/* Delete dialogue */}
            <Dialog
                open={openDialogue}
                onClose={handleCloseDialogue}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Do you want to delete this group?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDialogue} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteGroup} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>


            <Modal style={{ marginTop: "20vh" }} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectToEdit ? "Edit Rule" : "Create New Rule"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="rules_part">
                        <div className="rules_input">

                            <h6>Title <span>50</span></h6>
                            <input value={ruleTitle} onChange={(e) => setRuleTitle(e.target.value)} type="text" name="textfield" placeholder="Write the rules.." />
                        </div>
                        <div className="rules_input">
                            <h6>Description <span>120</span></h6>
                            <textarea value={ruleDescription} onChange={(e) => setRuleDescription(e.target.value)} name="textarea" placeholder="Add details.."></textarea>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn' variant="secondary" onClick={handleClose}>
                        Close
                    </button>
                    <button className='btn' variant="primary" onClick={() => selectToEdit ? saveEditedRule() : handleCreate()}>
                        {selectToEdit ? "Edit" : "Create"}
                    </button>
                </Modal.Footer>
            </Modal>

            <div id='group_settings'>
            <div className="group_setting_main shadow-sm">
                {/* Change group img */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Group photo : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 group_url">
                        <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="contained-button-file19"
                            onChange={(e) => handleGroupImg(e.target.files[0])}
                            type="file"
                        />
                        <label htmlFor="contained-button-file19">
                            <Button startIcon={<PhotoCamera />} size="small" variant="contained" color="primary" component="span">
                                Upload
                            </Button>
                        </label>
                        {/* <form>
                            <div class="form-group">

                                <input onChange={(e) => handleGroupImg(e.target.files[0])} type="file" class="form-control-file" id="exampleFormControlFile1" />
                            </div>
                        </form> */}
                    </div>
                </div>


                {/* Change cover img */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Group cover photo : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 group_url">

                        <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="contained-button-file20"
                            onChange={(e) => handleCoverImg(e.target.files[0])}
                            type="file"
                        />
                        <label htmlFor="contained-button-file20">
                            <Button startIcon={<PhotoCamera />} size="small" variant="contained" color="primary" component="span">
                                Upload
                            </Button>
                        </label>


                        {/* <form>
                            <div class="form-group">

                                <input onChange={(e) => handleCoverImg(e.target.files[0])} type="file" class="form-control-file" id="exampleFormControlFile1" />
                            </div>
                        </form> */}
                    </div>
                </div>


                {/* <!-- ---------------------------------------------------------------- -->
                        <!-- >>>>>>>>> GROUP NAME = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Group Name : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8">
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="textfield" placeholder="Your Group Name" />
                    </div>
                </div>


                {/*<!-- >>>>>>>>> GROUP URL = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Group URL : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 group_url">
                        <p>https//www.yoursite.com/g.groupname</p> <input value={url} onChange={(e) => setUrl(e.target.value)} type="text" name="textfield" placeholder="Change Your URL" />
                    </div>
                </div>


                {/*-- >>>>>>>>> GROUP Descriptions   = (START) >>>>>>>>  */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Group Descriptions : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 group_descriptions">
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} name="textarea" placeholder="TextArea"></textarea>
                    </div>
                </div>


                {/* <!-- >>>>>>>>> PRIVACY   = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Privacy : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 permission">
                        <p>Public Group <span>(Anyone can see who's in the group and what they post)</span></p>
                        <RadioGroup aria-label="gender" name="gender1" value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                            <FormControlLabel value="public" control={<Radio size='small' />} label="Public" />
                            <FormControlLabel value="private" control={<Radio size='small' />} label="Private" />
                        </RadioGroup>

                    </div>
                </div>


                {/* <!-- >>>>>>>> Permissions  = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Posting Permissions : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 permission">
                        <RadioGroup aria-label="gender" name="gender1" value={postPermission} onChange={(e) => setPostPermission(e.target.value == 'true')}>
                            <FormControlLabel value={true} control={<Radio size='small' />} label="Anyone in the group" />
                            <FormControlLabel value={false} control={<Radio size='small' />} label="Only Admins" />
                        </RadioGroup>

                    </div>
                </div>



                {/* <!-- >>>>>>>> membership  = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Membership Approval : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 membership">
                        <RadioGroup aria-label="gender" name="gender1" value={memberApproval} onChange={(e) => setMemberApproval(e.target.value == 'true')}>
                            <FormControlLabel value={false} control={<Radio size='small' />} label="Automatic Member Approvals" />
                            <FormControlLabel value={true} control={<Radio size='small' />} label="Only admins and moderrators" />
                        </RadioGroup>

                    </div>
                </div>



                {/* <!-- >>>>>>>> Approval  = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Post Approval : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 approval">
                        <RadioGroup aria-label="gender" name="gender1" value={postApproval} onChange={(e) => setPostApproval(e.target.value == 'true')}>
                            <FormControlLabel value={false} control={<Radio size='small' />} label="All group posts autometic approved by without an admin or moderator" />
                            <FormControlLabel value={true} control={<Radio size='small' />} label="All group posts must be approved by an admin or a moderator" />
                        </RadioGroup>

                    </div>
                </div>



                {/* <!-- >>>>>>>> POST FIELD  = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Post Field : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 post_field">
                        <RadioGroup aria-label="gender" name="gender1" value={postType && postType} onChange={(e) => setPostType(e.target.value)}>
                            <FormControlLabel value="general" control={<Radio size='small' />} label="General" />
                            <FormControlLabel value="link" control={<Radio size='small' />} label="Only Link" />
                            <FormControlLabel value="picture" control={<Radio size='small' />} label="Only Picture" />
                        </RadioGroup>

                    </div>
                </div>



                {/* <!-- >>>>>>> GROUP RULES  = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Group Rules : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 group_rules">
                        <div className="card">
                            <div className="card-header  text-right">
                                <h6> Group rules </h6>
                                <Button variant="primary" onClick={handleShow}>Create</Button>
                            </div>
                            <div className="card-body">
                                {
                                    rules.length > 0 ? rules.map((rule, index) => {
                                        return <div key={index} className="rules row">
                                            <div className="col-1 p-0">
                                                <h4>{index + 1} <i className="fas fa-braille"></i></h4>
                                            </div>
                                            <div className="col-10 rules_text">
                                                <h5>{rule.title}</h5>
                                                <p>{rule.description}</p>
                                            </div>
                                            <div className="col-1 rules_dot">
                                                <a type="button" className="  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i className="fas fa-ellipsis-h"></i>
                                                </a>
                                                <div className="dropdown-menu" dropdownMenuLink>
                                                    <a onClick={() => handleEdit(rule)} className="dropdown-item" type="button"><i className="fas fa-edit"></i> Edit Rule</a>
                                                    <a onClick={() => handlRuleDelete(rule._id)} className="dropdown-item" type="button"><i className="fas fa-trash-alt"></i> Delete Rule</a>
                                                </div>
                                            </div>
                                        </div>
                                    }) :
                                        <p>No rules found</p>
                                }

                            </div>
                            <div className="card-footer text-right">
                                {/* <a href="all_group_rules.html" className="btn">Show More <i className="fas fa-angle-double-right"></i></a> */}
                            </div>
                        </div>
                    </div>
                </div>


                {/* <!-- >>>>>>>> APPROVE LINK  = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Only Approved This Web Link : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 approved_link">
                        <p style={{ fontSize: "15px" }}>www.example.com</p>
                        <input value={approvedLink} onChange={(e) => setApprovedLink(e.target.value)} type="text" name="textfield" placeholder="Enter your site link" />
                        <button onClick={() => handleAddApprove()} className="btn"> Add</button>
                        {apperror && <div className="alert alert-danger m-4" role="alert">
                            <strong>Error</strong> {apperror}

                        </div>}
                        <div className="site_link">
                            <h5>Site List</h5>
                            {
                                approvedLinkList && approvedLinkList.map((link, index) => {
                                    return <p key={index}>{link} <i onClick={() => deleteApprove(link)} className="fas fa-times"></i></p>
                                })
                            }
                            {/* <a href="" className="btn"> Show More <i className="fas fa-angle-double-right"></i></a> */}
                        </div>
                    </div>
                </div>



                {/* <!-- >>>>>>>> BLOCK LINK  = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Only Block This Web Link : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 approved_link">
                        <p style={{ fontSize: "15px" }}>www.example.com</p>
                        <input value={blockedLink} onChange={(e) => setBlockedLink(e.target.value)} type="text" name="textfield" placeholder="Enter your site link" />
                        <button onClick={() => handleAddBlocked()} className="btn"> Add</button>
                        {blockerror && <div className="alert alert-danger m-4" role="alert">
                            <strong>Error</strong> {blockerror}

                        </div>}
                        <div className="site_link">
                            <h5>Site List</h5>
                            {
                                blockedLinkList && blockedLinkList.map((link, index) => {
                                    return <p key={index}>{link} <i onClick={() => deleteBlocked(link)} className="fas fa-times"></i></p>
                                })
                            }
                            {/* <a href="" className="btn"> Show More <i className="fas fa-angle-double-right"></i></a> */}
                        </div>
                    </div>
                </div>



                {/* <!-- >>>>>>>> Cetagory FIELD  = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Category : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 post_field">
                        <RadioGroup aria-label="gender" name="gender1" value={showCategory} onChange={(e) => setShowCategory(e.target.value == 'true')}>
                            <FormControlLabel value={true} control={<Radio size='small' />} label="Show" />
                            <FormControlLabel value={false} control={<Radio size='small' />} label="Hide" />
                        </RadioGroup>

                    </div>
                </div>



                {/* <!-- >>>>>>>> ADD Cetagory  = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Add category : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 approved_link">
                        <input value={cateName} onChange={(e) => setCateName(e.target.value)} type="text" name="textfield" placeholder="Enter category name" /> <button onClick={() => handleaddCat()} className="btn"> Add</button>
                        <div className="site_link">
                            <h5>Category List</h5>
                            {
                                catList.map((cat, index) => {
                                    return <p key={index}>{cat} <i onClick={(e) => deleteCat(cat)} className="fas fa-times"></i></p>
                                })
                            }


                            {/* <a href="" className="btn"> Show More <i className="fas fa-angle-double-right"></i></a> */}
                        </div>
                    </div>
                </div>



                {/* <!-- >>>>>>>> ADD ADMIN  = (START) >>>>>>>> --> */}
                <div className="row group_name border-bottom">
                    <div className="col-md-4 col-sm-4">
                        <h6>Add a Admin or Modaretor : </h6>
                    </div>
                    <div className="col-md-8 col-sm-8 approved_link">
                        <p className="radio"><input type="radio" name="radio1" /> Admin</p>
                        <p className="radio"><input type="radio" name="radio1" /> Modaretor</p> <br></br>
                        <input type="text" name="textfield" placeholder="Enter username" /> <a href="#" className="btn"> Add </a>
                        <div className="site_link">
                            <h5> Admin or Modaretor List</h5>
                            <p>username <i className="fas fa-times"></i></p>
                            <p>username <i className="fas fa-times"></i></p>
                            <p>username <i className="fas fa-times"></i></p>
                            <a href="" className="btn"> Show More <i className="fas fa-angle-double-right"></i></a>
                        </div>
                    </div>
                </div>

                <div className="border-bottom text-center">
                    <Button onClick={() => setOpenDialogue(true)} startIcon={<DeleteIcon />} variant="contained" color="secondary" className='m-3'>Delete group</Button>
                </div>



                {/*<!-- >>>>>>>> Save  = (START) >>>>>>>> --> */}
                <div className=" save text-right">
                    <button onClick={() => handleSubmit()} className="btn"><i className="fas fa-save"></i> SAVE</button>
                </div>

            </div>
            </div>
        </GroupLayout>
    )
}

export default protectedRoute(GroupSetting)
