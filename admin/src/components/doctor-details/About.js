import React from 'react'

import ReactQuill from 'react-quill'

function About({ about, setAbout }) {
    const handleChange = (value) => {
        setAbout(value)
    }
    return (

        <div className="g-info a-doc">
            <h1>About Doctor *</h1>
            <div className="text-editor">
                <ReactQuill value={about}
                    onChange={handleChange} />
            </div>
        </div>
    )
}

export default About
