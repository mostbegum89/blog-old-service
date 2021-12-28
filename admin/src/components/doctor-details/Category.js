import React, { useState } from 'react'

function Category({ category, setCategory, departments }) {


    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...category];
        list[index] = value;
        setCategory(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...category];
        list.splice(index, 1);
        setCategory(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setCategory([...category, '']);
    };


    return (
        <>

            {/* <!-- category MEDIA --> */}
            <div className="g-info edu">
                <h1>specialist *</h1>

                {category.map((x, i) => (
                    <>
                        <div className="sector first_start">
                            {i !== 0 &&
                                <i className="fas fa-times-circle last_remove" id="remove-btn" onClick={() => handleRemoveClick(i)}></i>
                            }
                            <div className="g-inout full-width">
                                <select value={category[i]} name='socialName' onChange={e => handleInputChange(e, i)} data-skip-name="true" required>
                                    <option value="">Please Select</option>
                                    {
                                        departments.length > 0 && departments.map(department => (
                                            <option key={department._id} value={department._id}>{department.name}</option>
                                        ))
                                    }

                                    {/* <option value="Cardiology">Cardiology</option>
                                            <option value="Cardiology">Urology</option>
                                            <option value="Radiology">Radiology</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Medicine">Medicine</option>
                                            <option value="Therapy">Therapy</option>
                                            <option value="Colorectal Surgery">Colorectal Surgery</option>
                                            <option value="Genetics">Genetics </option> */}
                                </select>
                            </div>

                        </div>

                        <div id="repeater5">
                            <div className="clearfix"></div>
                            <div className="repeater-heading">

                                {category.length - 1 === i && <p className="add_more repeater-add-btn last" onClick={handleAddClick}><i className="fas fa-plus-square"></i> Add New</p>}


                            </div>

                        </div>
                    </>
                ))}
            </div>



        </>
    )
}

export default Category
