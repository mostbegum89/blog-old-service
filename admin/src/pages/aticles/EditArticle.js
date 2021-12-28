import React from 'react';
import {
  Button,
  Toolbar,
  Paper,
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
  TextField,
  IconButton
} from '@material-ui/core';
import { Editor } from '@tinymce/tinymce-react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import { Box, Container, makeStyles } from '@material-ui/core';
import {Card} from 'antd'

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

function EditArticle({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  categories,
  subCategories,
  subCategory,
  setSubCategory,
  selectedThumbnail,
  thumbnail,
  setSelectedThumbnail,
  status,
  setStatus,
  body,
  handleEditorChange,
  tags,
  setTags
}) {

  const classes = useStyles();
  return (
    <Card title="Update">
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
            onChange={setTitle}
            fullWidth
            id="standard-basic"
            variant="outlined"
            label="Enter title"
          />
          <TextField
            style={{ marginTop: '10px' }}
            value={description}
            onChange={setDescription}
            fullWidth
            id="standard-basic"
            variant="outlined"
            label="Enter description"
          />
          <InputLabel
            style={{ marginTop: '15px' }}
            id="demo-simple-select-label"
          >
            Select category
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category}
            onChange={setCategory}
            fullWidth
            variant="outlined"
            style={{ marginTop: '5px' }}
          >
            {categories &&
              categories.map(cat => {
                return (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                );
              })}
          </Select>

            
          <InputLabel
            style={{ marginTop: '15px' }}
            id="demo-simple-select-label"
          >
            Select sub category
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={subCategory}
            onChange={setSubCategory}
            fullWidth
            variant="outlined"
            style={{ marginTop: '5px' }}
          >
            {subCategories &&
              subCategories.map(cat => {
                return (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                );
              })}
          </Select>



        </div>
        <div style={{ width: '30%' }}>
          <div
            className={classes.thumbnail}
            style={
              selectedThumbnail
                ? {
                    backgroundImage: `url(${URL.createObjectURL(
                      selectedThumbnail
                    )})`
                  }
                : thumbnail
                ? { backgroundImage: `url(${thumbnail})` }
                : null
            }
          >
            <input
              hidden
              accept="image/*"
              type="file"
              name="file"
              onChange={setSelectedThumbnail}
              id="file"
            />
            <label htmlFor="file">
              <i className="fas fa-upload"></i> Upload Your Image
            </label>
          </div>
          <div style={{ marginTop: '5px', marginLeft: '10px' }}>
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
          </div>
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
          images_upload_handler: function(blobinfo, success, failure) {
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
        onChange={setTags}
      />
    </Card>
  );
}

export default EditArticle;
