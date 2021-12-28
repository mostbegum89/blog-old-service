import React, { useState } from 'react'

function Hospital({ hospital, setHospotal }) {


    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...hospital];
        list[index][name] = value;
        setHospotal(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...hospital];
        list.splice(index, 1);
        setHospotal(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setHospotal([...hospital, { hospitalName: "", hospitalAddress: "", call: "", from: "", fromFormat: "", to: "", toFormat: "" }]);
    };


    return (
        <>

            {/* <!-- hospital MEDIA --> */}
            <div className="g-info edu">
                <h1>Hospital or chamber *</h1>

                {hospital.map((x, i) => (
                    <>
                        <div className="multi_sector first_start">
                            {i !== 0 &&
                                <i className="fas fa-times-circle last_remove" id="remove-btn" onClick={() => handleRemoveClick(i)}></i>
                            }

                            <div className="g-inout full-width">
                                <label>Hospital or Chamber Name *</label>
                                <input value={hospital[i].hospitalName} name='hospitalName' onChange={e => handleInputChange(e, i)} type="text" data-skip-name="true" placeholder="Hospital or Chamber Name"
                                    data-name="h_name[]" />
                            </div>

                            <div className="g-inout full-width">
                                <label>Hospital or Chamber Address *</label>
                                <input value={hospital[i].hospitalAddress} name='hospitalAddress' onChange={e => handleInputChange(e, i)} type="address" placeholder="Hospital or Chamber Address" data-skip-name="true"
                                    placeholder="Academy Name" data-name="h_address[]" />
                            </div>

                            <div className="g-inout">
                                <label>Call for appointment</label>
                                <input value={hospital[i].call} name='call' onChange={e => handleInputChange(e, i)} type="text" placeholder="Call for appointment" placeholder="Call for appointment" />
                            </div>
                            <div className="g-inout time">
                                <label>Visiting Hours *</label>
                                <div className="time_flex">
                                    <select value={hospital[i].from} name='from' onChange={e => handleInputChange(e, i)} data-skip-name="true">
                                    <option value="01">01</option>
                                        <option value="02">02</option>
                                        <option value="03">03</option>
                                        <option value="04">04</option>
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                        <option value="08">08</option>
                                        <option value="09">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                    <select value={hospital[i].fromFormat} name='fromFormat' onChange={e => handleInputChange(e, i)} data-skip-name="true">
                                    <option value="pm">PM</option>
                                        <option value="am">AM</option>
                                    </select>
                                    <span>To</span>
                                    <select value={hospital[i].to} name='to' onChange={e => handleInputChange(e, i)} data-skip-name="true">
                                        <option value="01">01</option>
                                        <option value="02">02</option>
                                        <option value="03">03</option>
                                        <option value="04">04</option>
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                        <option value="08">08</option>
                                        <option value="09">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                    <select value={hospital[i].toFormat} name='toFormat' onChange={e => handleInputChange(e, i)} data-skip-name="true">
                                        <option value="pm">PM</option>
                                        <option value="am">AM</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div id="repeater5">
                            <div className="clearfix"></div>
                            <div className="repeater-heading">

                                {hospital.length - 1 === i && <p className="add_more repeater-add-btn last" onClick={handleAddClick}><i className="fas fa-plus-square"></i> Add New</p>}


                            </div>

                        </div>
                    </>
                ))}
            </div>



        </>
    )
}

export default Hospital
