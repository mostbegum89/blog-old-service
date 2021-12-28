import React, { useState } from 'react';
import {
    Button,
    TextField,
} from '@material-ui/core';
import { Editor } from '@tinymce/tinymce-react';

import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import { Card } from 'antd'
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    },
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '50%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    },
    thumbnail: {
        height: '160px',
        width: '250px',
        border: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '20px',
        cursor: 'pointer',
        backgroundSize: 'cover'
    }
}));

function NewArticle() {
    let history = useHistory()
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [thumbnail, setThumbnail] = useState("")
    const [body, setBody] = useState("")
    const [tags, setTags] = useState('')


    const handleEditorChange = (content, editor) => {
        setBody(content)
    }

    const handleSave = async () => {
        if (title.length < 10) {
            return alert("title should be more then 10 words")
        }
        if (description.length < 32) {
            return alert("description should be more then 32 words")
        }

        if (thumbnail == '') {
            return alert("Thumbnail is required")
        }
        if (body == '') {
            return alert("Body is required")
        }

        //console.log(category, subCategory);

        setIsLoading(true)

        let formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("thumbnail", thumbnail)
        formData.append("body", body)

        formData.append("tags", tags)
        axios.post("/doctor/article/create", formData)
            .then(res => {
                //console.log(res.data.blog.blog)
                // setTitle("")
                // setDescription("")
                // setBody("")
                // setThumbnail("")
                // setTags("")
                alert("Saved Successfully")
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                err && err.response && alert(err.response.data.error)
            })
    }




    const classes = useStyles();
    return (
        <Card title="Add New Article">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '10px 0'
                }}
            >
                <div style={{ width: '70%' }}>
                    <TextField
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        fullWidth
                        id="standard-basic"
                        variant="outlined"
                        label="Enter title"
                    />
                    <TextField
                        style={{ marginTop: '10px' }}
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                        fullWidth
                        id="standard-basic"
                        variant="outlined"
                        label="Enter description"
                    />



                </div>
                <div style={{ width: '30%' }}>
                    <div
                        className={classes.thumbnail}
                        style={
                            thumbnail ? {
                                backgroundImage: `url(${URL.createObjectURL(
                                    thumbnail
                                )})`
                            } :
                                {
                                    background: 'white'
                                }
                        }
                    >
                        <input
                            hidden
                            accept="image/*"
                            type="file"
                            name="file"
                            onChange={(e) => setThumbnail(e.target.files[0])}
                            id="file"
                        />
                        <label htmlFor="file">
                            <i className="fas fa-upload"></i> Upload Your Image
                        </label>
                    </div>
                    {/* <div style={{ marginTop: '5px', marginLeft: '10px' }}>
            <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              onChange={setStatus}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="approve">Approve</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </div> */}
                </div>
            </div>

            <Editor
                value={body}
                apiKey="91als7opdgzbord7g1svxmwnzu364m2bj3nc5n1wzrzj0hnr"
                init={{
                    height: 500,
                    menubar: false,
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
                    images_upload_url: '/article/articleimages',
                    images_upload_handler: function (blobinfo, success, failure) {
                        let headers = new Headers();
                        headers.append('Accept', 'Application/JSON');

                        let formData = new FormData();
                        formData.append(
                            'articleimages',
                            blobinfo.blob(),
                            blobinfo.filename()
                        );

                        axios
                            .post('/article/articleimages', formData)
                            .then(res => {
                                success(res.data.imgUrl);
                            })
                            .catch(() => failure('http error'));
                    }
                }}
                onEditorChange={handleEditorChange}

            />

            <TextField
                style={{ marginTop: '10px' }}
                fullWidth
                id="standard-basic"
                variant="outlined"
                label="Enter tags"
                placeholder="tag1,tag2,tag3..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />


            <div style={{ margin: "20px 0", display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() =>history.push('/doctor/articles')} variant="contained" style={{  marginRight: "10px" }}>
                    Cancle
                </Button>
                <Button disabled={isLoading} onClick={() => handleSave()} variant="contained" color="secondary">
                    Save
                </Button>

            </div>
        </Card>
    );
}

export default NewArticle;
