import React, { useState } from 'react'

function Language({ language, setLanguage }) {


    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...language];
        list[index] = value;
        setLanguage(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...language];
        list.splice(index, 1);
        setLanguage(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setLanguage([...language,'']);
    };

    

    return (
        <>

            {/* <!-- SOCIAL MEDIA --> */}
            <div className="g-info edu">
                <h1>language *</h1>

                {language.map((x, i) => (
                    <>
                        <div className="sector first_start">
                            {i !== 0 &&
                                <i className="fas fa-times-circle last_remove" id="remove-btn" onClick={() => handleRemoveClick(i)}></i>
                            }

                            <div className="g-inout full-width">
                                <label>Select Language *</label>
                                <select value={language[i]} name='language' onChange={e => handleInputChange(e, i)} data-skip-name="true" required>
                                    <option value="">Select Language</option>
                                    <option value="Bengali">Bengali</option>
                                    <option value="English">English </option>
                                    <option value="Spanish">Spanish </option>
                                    <option value="Arabic">Arabic </option>
                                </select>

                            </div>
                        </div>

                        <div id="repeater5">
                            <div className="clearfix"></div>
                            <div className="repeater-heading">

                                {language.length - 1 === i && <p className="add_more repeater-add-btn last" onClick={handleAddClick}><i className="fas fa-plus-square"></i> Add New</p>}


                            </div>

                        </div>
                    </>
                ))}
            </div>



        </>
    )
}

export default Language
