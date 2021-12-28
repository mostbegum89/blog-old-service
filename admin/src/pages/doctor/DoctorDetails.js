import React, { useState, useEffect, useRef } from 'react'
import Social from '../../components/doctor-details/Social';
import Language from '../../components/doctor-details/Language';
import Category from '../../components/doctor-details/Category';
import Experience from '../../components/doctor-details/Experience';
import Hospital from '../../components/doctor-details/Hospital';
import Education from '../../components/doctor-details/Education';
import About from '../../components/doctor-details/About';
import GeneralInformation from '../../components/doctor-details/GeneralInformation';

import { useParams } from 'react-router-dom'

import axios from 'axios'
import { message, Spin, Card } from 'antd';

function Details() {
    let params = useParams()
    let id = params.id

    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [social, setSocial] = useState([{ socialLink: "", socialName: "" }]);
    const [language, setLanguage] = useState(['']);
    const [category, setCategory] = useState(['']);
    const [experience, setExperience] = useState([{ academyName: "", academyAddress: "", from: "01", to: "01" }]);
    const [hospital, setHospital] = useState([{ hospitalName: "", hospitalAddress: "", call: "", from: "01", fromFormat: "pm", to: "01", toFormat: "pm" }]);
    const [education, setEducation] = useState([{ academyName: "", academyAddress: "", from: "", to: "" }]);
    const [about, setAbout] = useState('')
    const [general, setGeneral] = useState({ name: "", title: "", gender: "", age: "", country: "", city: "", address: "", zip: "", phone: "", website: "", newPatient: null, teleHealth: null })
    const [profileImage, setProfileImage] = useState('')
    const [isApproved, setIsApproved] = useState(false)
    const [isUploading, setIsUplaoding] = useState(false)


    const [countries, setCountries] = useState([])
    const [departments, setDepartments] = useState([])


    useEffect(() => {
        if (!id) return

        (async function () {
            setIsLoading(true)
            try {
                let initres = await axios.get(`/doctor/initialdata`)
                setCountries(initres.data.countries)
                setDepartments(initres.data.departments)

                let userres = await axios.get(`/doctor/single/${id}`)
                let {
                    general,
                    about,
                    education,
                    hospital,
                    experience,
                    language,
                    social,
                    category,
                    profileImage,
                    isApproved
                } = userres.data.doctor

                setGeneral(prev => ({ ...prev, ...general }))
                setAbout(about)
                setEducation(education)
                setHospital(hospital)
                setExperience(experience)
                setLanguage(language)
                setSocial(social)
                setCategory(category)
                setProfileImage(profileImage)
                setIsApproved(isApproved)

                setIsLoading(false)
            } catch (e) {
                setIsLoading(false)
                console.error(e);
            }
        })();

    }, [id])

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSaving(true)
        let data = {
            general,
            about,
            education,
            hospital,
            experience,
            language,
            social,
            category,
            profileImage,
            isApproved
        }



        axios.patch(`/doctor/update/${id}`, data)
            .then(res => {
                console.log(res.data);
                message.success("Updated successfully")
                setIsSaving(false)
            })
            .catch(err => {
                console.log(err);
                setIsSaving(false)
                err && err.response && message.error(err.response.data?.error)
            })
    }



    let imageRef = useRef()


    const handleUpload = (files) => {
        if (files) {
            setIsUplaoding(true)
            let formData = new FormData()
            formData.append("image", files)
            axios.post(`/general/image`, formData)
                .then(res => {
                    setProfileImage(res.data.image)

                    setIsUplaoding(false)

                })
                .catch(err => {
                    imageRef.current.value = null
                    setIsUplaoding(false)
                    console.log(err);
                    message.error("Upload failed")
                })
        }
    }
    return (
        <>
            <Card loading={isLoading}>
                <div className='data-collection'>


                    {/* <!-- all information --> */}
                    <div className="section">

                        <div className="img_upload">
                            <div>
                                <input ref={imageRef} accept="image/*" onChange={(e) => handleUpload(e.target.files[0])} type="file" name="" hidden id="logo" />
                                <label htmlFor='logo' style={profileImage ? { backgroundImage: `url(${profileImage})`, backgroundSize: "cover" } : { background: "white" }} className="logo">
                                    <div className="drag-area" id="here">

                                        <div className="icon">
                                            {
                                                isUploading ?
                                                    <Spin size='large' /> :
                                                    <>
                                                        <i className="fas fa-cloud-upload-alt"></i>
                                                        <span style={{ display: "block", textAlign: "center" }}>Upload Image</span>
                                                    </>
                                            }

                                        </div>
                                        {/* <h5>Drag & Drop</h5>
                                        <p>OR</p> */}
                                        {/* <button>Upload Image</button> */}
                                        {/* <input  accept="image/*" onChange={(e) => handleUpload(e.target.files[0])} type="file" hidden name="logo" className="logo" /> */}

                                    </div>
                                </label>
                            </div>
                        </div>


                        <div className="all_info">
                            <form onSubmit={e => handleSubmit(e)} >
                                {/* <!-- General Information --> */}
                                <GeneralInformation countries={countries} general={general} setGeneral={val => setGeneral(val)} />


                                {/* <!-- about doctor --> */}
                                <About about={about} setAbout={val => setAbout(val)} />




                                {/* <!-- EDUCATION  --> */}
                                <Education education={education} setEducation={val => setEducation(val)} />




                                {/* <!-- hospital or chamber --> */}
                                <Hospital hospital={hospital} setHospotal={val => setHospital(val)} />
                                {/* <!-- work and experience --> */}


                                <Experience experience={experience} setExperience={val => setExperience(val)} />
                                <Category departments={departments} category={category} setCategory={val => setCategory(val)} />
                                <Language language={language} setLanguage={val => setLanguage(val)} />
                                {/* <!-- SOCIAL MEDIA --> */}
                                <Social social={social} setSocial={(val => setSocial(val))} />
                                <div className="g-info edu">
                                    <h1>Status *</h1>

                                    <div className="g-inout full-width">
                                        <select value={isApproved} name='socialName' onChange={e => setIsApproved(e.target.value)} data-skip-name="true">

                                            <option value={true}>Approved</option>
                                            <option value={false}>Pending</option>

                                        </select>
                                    </div>
                                </div>

                                {/* <!-- submit button --> */}
                                <input disabled={isSaving} type="submit" className="submit-data" value={isSaving ? "Updating" : "Update this information"} />
                            </form>
                        </div>
                    </div>

                </div>
            </Card>
        </>
    )
}

export default Details
