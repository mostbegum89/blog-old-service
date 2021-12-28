import React, { useState } from 'react'

function Education({education,setEducation}) {
   

    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...education];
        list[index][name] = value;
        setEducation(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...education];
        list.splice(index, 1);
        setEducation(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setEducation([...education, { academyName: "", academyAddress: "",from:"",to:"" }]);
    };

   
    return (
        <>

            {/* <!-- education MEDIA --> */}
            <div className="g-info edu">
                <h1>Education</h1>

                {education.map((x, i) => (
                    <>
                        <div className="multi_sector first_start">
                            {i !== 0 &&
                                <i className="fas fa-times-circle last_remove" id="remove-btn" onClick={() => handleRemoveClick(i)}></i>
                            }
                            <div className="g-inout full-width">
                                        <label>Academy name</label>
                                        <input value={education[i].academyName} name='academyName' onChange={e => handleInputChange(e, i)} type="text" data-skip-name="true" placeholder="Academy name" data-name="a_name2[]" />
                                    </div>

                                    <div className="g-inout full-width">
                                        <label>Academy address</label>
                                        <input value={education[i].academyAddress} name='academyAddress' onChange={e => handleInputChange(e, i)} type="address" data-skip-name="true" placeholder="Academy address"
                                            data-name="a_address2[]" />
                                    </div>
                                    <div className="sector">
                                        <div className="g-inout edu">
                                            <label>Year</label>
                                            <select value={education[i].from} name='from' onChange={e => handleInputChange(e, i)} data-skip-name="true">
                                                <option value="">Select year</option>
                                                <option value="2021">2021</option>
                                                <option value="2020">2020</option>
                                                <option value="2019">2019</option>
                                                <option value="2018">2018</option>
                                                <option value="2017">2017</option>
                                                <option value="2016">2016</option>
                                                <option value="2015">2015</option>
                                                <option value="2014">2014</option>
                                                <option value="2013">2013</option>
                                                <option value="2012">2012</option>
                                                <option value="2011">2011</option>
                                                <option value="2010">2010</option>
                                                <option value="2009">2009</option>
                                                <option value="2008">2008</option>
                                                <option value="2007">2007</option>
                                                <option value="2006">2006</option>
                                                <option value="2005">2005</option>
                                                <option value="2004">2004</option>
                                                <option value="2003">2003</option>
                                                <option value="2002">2002</option>
                                                <option value="2001">2001</option>
                                                <option value="2000">2000</option>
                                                <option value="1999">1999</option>
                                                <option value="1998">1998</option>
                                                <option value="1997">1997</option>
                                                <option value="1996">1996</option>
                                                <option value="1995">1995</option>
                                                <option value="1994">1994</option>
                                                <option value="1993">1993</option>
                                                <option value="1992">1992</option>
                                                <option value="1991">1991</option>
                                                <option value="1990">1990</option>
                                                <option value="1989">1989</option>
                                                <option value="1988">1988</option>
                                                <option value="1987">1987</option>
                                                <option value="1986">1986</option>
                                                <option value="1985">1985</option>
                                                <option value="1984">1984</option>
                                                <option value="1983">1983</option>
                                                <option value="1982">1982</option>
                                                <option value="1981">1981</option>
                                                <option value="1980">1980</option>
                                                <option value="1979">1979</option>
                                                <option value="1978">1978</option>
                                                <option value="1977">1977</option>
                                                <option value="1976">1976</option>
                                                <option value="1975">1975</option>
                                                <option value="1974">1974</option>
                                                <option value="1973">1973</option>
                                                <option value="1972">1972</option>
                                                <option value="1971">1971</option>
                                                <option value="1970">1970</option>
                                            </select>
                                        </div>
                                        <span>To</span>
                                        <div className="g-inout edu">
                                            <label>Year</label>
                                            <select value={education[i].to} name='to' onChange={e => handleInputChange(e, i)} data-skip-name="true">
                                                <option value="">Select year</option>
                                                <option value="2021">2021</option>
                                                <option value="2020">2020</option>
                                                <option value="2019">2019</option>
                                                <option value="2018">2018</option>
                                                <option value="2017">2017</option>
                                                <option value="2016">2016</option>
                                                <option value="2015">2015</option>
                                                <option value="2014">2014</option>
                                                <option value="2013">2013</option>
                                                <option value="2012">2012</option>
                                                <option value="2011">2011</option>
                                                <option value="2010">2010</option>
                                                <option value="2009">2009</option>
                                                <option value="2008">2008</option>
                                                <option value="2007">2007</option>
                                                <option value="2006">2006</option>
                                                <option value="2005">2005</option>
                                                <option value="2004">2004</option>
                                                <option value="2003">2003</option>
                                                <option value="2002">2002</option>
                                                <option value="2001">2001</option>
                                                <option value="2000">2000</option>
                                                <option value="1999">1999</option>
                                                <option value="1998">1998</option>
                                                <option value="1997">1997</option>
                                                <option value="1996">1996</option>
                                                <option value="1995">1995</option>
                                                <option value="1994">1994</option>
                                                <option value="1993">1993</option>
                                                <option value="1992">1992</option>
                                                <option value="1991">1991</option>
                                                <option value="1990">1990</option>
                                                <option value="1989">1989</option>
                                                <option value="1988">1988</option>
                                                <option value="1987">1987</option>
                                                <option value="1986">1986</option>
                                                <option value="1985">1985</option>
                                                <option value="1984">1984</option>
                                                <option value="1983">1983</option>
                                                <option value="1982">1982</option>
                                                <option value="1981">1981</option>
                                                <option value="1980">1980</option>
                                                <option value="1979">1979</option>
                                                <option value="1978">1978</option>
                                                <option value="1977">1977</option>
                                                <option value="1976">1976</option>
                                                <option value="1975">1975</option>
                                                <option value="1974">1974</option>
                                                <option value="1973">1973</option>
                                                <option value="1972">1972</option>
                                                <option value="1971">1971</option>
                                                <option value="1970">1970</option>
                                            </select>
                                        </div>
                                    </div>
                        </div>

                        <div id="repeater5">
                            <div className="clearfix"></div>
                            <div className="repeater-heading">

                                {education.length - 1 === i && <p className="add_more repeater-add-btn last" onClick={handleAddClick}><i className="fas fa-plus-square"></i> Add New</p>}


                            </div>

                        </div>
                    </>
                ))}
            </div>



        </>
    )
}

export default Education
