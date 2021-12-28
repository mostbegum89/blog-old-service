import React, { useState } from 'react'

function Social({social,setSocial}) {
   

    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...social];
        list[index][name] = value;
        setSocial(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...social];
        list.splice(index, 1);
        setSocial(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setSocial([...social, { socialLink: "", socialName: "" }]);
    };

   
    return (
        <>

            {/* <!-- SOCIAL MEDIA --> */}
            <div className="g-info edu">
                <h1>SOCIAL MEDIA</h1>

                {social.map((x, i) => (
                    <>
                        <div className="sector first_start">
                            {i !== 0 &&
                                <i className="fas fa-times-circle last_remove" id="remove-btn" onClick={() => handleRemoveClick(i)}></i>
                            }
                            <div className="social">
                                <select value={social[i].socialName} name='socialName' onChange={e => handleInputChange(e, i)} data-skip-name="true">
                                    <option value="">Select</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="Google-plus">Google-plus</option>
                                    <option value="Youtube">Youtube</option>
                                    <option value="Linkedin">Linkedin</option>
                                </select>
                            </div>
                            <div className="g-inout social">
                                <input value={social[i].socialLink} name='socialLink' onChange={e => handleInputChange(e, i)} type="url" data-skip-name="true" placeholder="Place Link"  />
                            </div>
                        </div>

                        <div id="repeater5">
                            <div className="clearfix"></div>
                            <div className="repeater-heading">

                                {social.length - 1 === i && <p className="add_more repeater-add-btn last" onClick={handleAddClick}><i className="fas fa-plus-square"></i> Add New</p>}


                            </div>

                        </div>
                    </>
                ))}
            </div>



        </>
    )
}

export default Social
