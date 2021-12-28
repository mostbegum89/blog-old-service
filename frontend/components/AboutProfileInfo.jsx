import React, { useEffect, useState } from 'react'


import moment from "moment";
import ShowMoreText from "react-show-more-text";

function AboutProfileInfo({ profile }) {
    const [dateandmonth, setDateAndMonth] = useState({ date: '', month: '', privacy: '' })
    const [yearofbirth, setYearOfBirth] = useState({ year: '', privacy: '' })


    useEffect(() => {
        if (profile.dateofbirth && profile.dateofbirth.dateandmonth) {
            setDateAndMonth({ ...profile.dateofbirth.dateandmonth })
            setYearOfBirth({ ...profile.dateofbirth.birthyear })
        }
    }, [profile])
    return (
        <>
            <div className="col-md-4 col-sm-4 p-0 about_side">
                <div className="about_sidebar  shadow-sm  rounded">
                    <h4>About</h4>
                    <p>
                        <i className="fas fa-circle" style={{ color: "#009d2a" }}></i>{" "}
                  Active Now{" "}
                    </p>
                    <p>
                        <i className="fas fa-map-marker-alt"></i> From{" "}
                        {profile && profile.city && profile.city},{" "}
                        {profile && profile.country ? profile.country : "N/A"}
                    </p>
                    <p className="text-capitalize">

                        {profile.gender === 'male' ? <><i className="fa fa-male" aria-hidden="true"></i> Male</> :
                            profile.gender === 'female' ? <><i className="fa fa-female" aria-hidden="true"></i> Female</> : <><i className="fas fa-male"></i> Gender</>}
                    </p>
                    <p>
                        <i className="fas fa-birthday-cake"></i>{" "}
                        {dateandmonth.privacy === 'public' && <>{dateandmonth.date}, {dateandmonth.month}</>}  {yearofbirth.privacy === 'public' && <>{yearofbirth.year}</>}
                        {(dateandmonth.privacy === 'onlyme' && yearofbirth.privacy === 'onlyme') ? "Date of birth" : null}
                    </p>
                    <p>
                        <i className="fas fa-book-open"></i>
                        <ShowMoreText
                            /* Default options */
                            lines={3}
                            more='Show more'
                            less='Show less'
                            className='content-css'
                            anchorClass='my-anchor-css-class'
                            expanded={false}
                            width={280}

                        >
                            {profile.bio ? <>  {profile.bio} </> : "Bio"}{" "}
                        </ShowMoreText>

                    </p>
                    {/* <h4>
                        More{" "}
                        <a href="/">
                            <i className="fas fa-angle-right"></i>
                        </a>
                    </h4> */}
                </div>
                {/* <h5 className="shadow-sm rounded">
                    Friends (0){" "}
                    <a href="/">
                        <i className="fas fa-angle-right"></i>
                    </a>
                </h5>
                <h5 className="shadow-sm rounded">
                    Followers (0){" "}
                    <a href="/">
                        <i className="fas fa-angle-right"></i>
                    </a>
                </h5>
                <h5 className="shadow-sm rounded">
                    Following (0){" "}
                    <a href="/">
                        <i className="fas fa-angle-right"></i>
                    </a>
                </h5> */}
            </div>
        </>
    )
}

export default AboutProfileInfo
