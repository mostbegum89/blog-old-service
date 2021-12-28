import React, { useState, useEffect } from 'react'

function GeneralInformation({ general, setGeneral, countries: countryList }) {
    const [countries, setCountries] = useState([])
    const [cities, setCities] = useState([])

    // useEffect(() => {
    //     setCountries(countryList)
    // }, [countryList])

    useEffect(() => {
        setCountries(countryList)
        let filtered = countryList.filter(c=>c._id === general.country)[0]
                if(filtered){
                        setCities(filtered?.children||[])
                }
                console.log(general.country);
    }, [general.country,countryList])

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'country') {
            setGeneral({ ...general, [name]: value ,city:""});
                let filtered = countries.filter(c=>c._id === value)[0]
                if(filtered){
                        setCities(filtered?.children||[])
                }
        } else {
            setGeneral({ ...general, [name]: value });
        }

    };

    return (
        <div className="g-info">
            <h1>General Information</h1>
            {/* <!-- doctor name --> */}
            <div className="g-inout full-width">
                <label>Doctor Name *</label>
                <input value={general.name} onChange={(e) => handleInputChange(e)} type="name" name="name" placeholder="Type your doctor name" required />
            </div>
            <div className="g-inout full-width">
                <label>Doctor Title *</label>
                <input value={general.title} onChange={(e) => handleInputChange(e)} type="title" name="title" placeholder="Type your doctor title. Like: MBBS, FCPS, MD, DR " required />
            </div>
            <div className="sector">
                <div className="g-inout">
                    <label>Gender *</label>
                    <select value={general.gender} onChange={(e) => handleInputChange(e)} name="gender" required>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="g-inout">
                    <label>Age</label>
                    <select value={general.age} onChange={(e) => handleInputChange(e)} name="age">
                        <option value="">Select Age</option>
                        <option value="25 - 30">25 - 30</option>
                        <option value="30 - 35">30 - 35</option>
                        <option value="35 - 40">35 - 40</option>
                        <option value="40 - 45">40 - 45</option>
                        <option value="45 - 50">45 - 50</option>
                        <option value="50 - 55">50 - 55</option>
                        <option value="55 - 60">55 - 60</option>
                        <option value="60 - 65">60 - 65</option>
                        <option value="65 - 70">65 - 70</option>
                        <option value="70 - 75">70 - 75</option>
                        <option value="75 - 80">75 - 80</option>
                        <option value="80+">80+</option>
                    </select>
                </div>
            </div>
            <div className="sector">
                <div className="g-inout">
                    <label>Country *</label>
                    <select value={general.country} onChange={(e) => handleInputChange(e)} name="country" required>
                        <option value="">Select Country</option>
                        {
                            countries.length > 0 && countries.map(country => (
                                <option key={country._id} value={country._id}>{country.name}</option>
                            ))
                        }



                    </select>
                </div>
                <div className="g-inout">
                    <label>State or City *</label>
                    <select value={general.city} onChange={(e) => handleInputChange(e)} name="city" required>
                        <option value="">Select State</option>
                        {
                            cities.length>0 && cities.map(city=>(
                                <option key={city._id} value={city._id}>{city.name}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            <div className="address1">
                <label>Address *</label>
                <input value={general.address} onChange={(e) => handleInputChange(e)} type="address" name="address" placeholder="Type doctor full address" required />
            </div>
            <div className=" zipcode">
                <label>Zip Code </label>
                <input value={general.zip} onChange={(e) => handleInputChange(e)} name="zip" placeholder="Zip Code" />
            </div>
            <div className="sector">
                <div className="g-inout">
                    <label>Phone Number</label>
                    <input value={general.phone} onChange={(e) => handleInputChange(e)} type="address" name="phone" placeholder="Type phone number"  />
                </div>
                <div className="g-inout">
                    <label>Website</label>
                    <input value={general.website} onChange={(e) => handleInputChange(e)} type="address" name="website" placeholder="https://yourwebsite.com"  />
                </div>
            </div>
            <div className="sector">
                <div className="g-inout">
                    <label>Accepting new patients</label>
                    <select value={general.newPatient} onChange={(e) => handleInputChange(e)} name="newPatient">
                        <option >Please Select</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                </div>
                <div className="g-inout">
                    <label>Telehealth services available</label>
                    <select value={general.teleHealth} onChange={(e) => handleInputChange(e)} name="teleHealth">
                        <option >Please Select</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default GeneralInformation
