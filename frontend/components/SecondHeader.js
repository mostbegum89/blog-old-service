import React, { useEffect, useState } from 'react'
import Avatar from "@material-ui/core/Avatar";
import { useParams, useHistory, Link } from 'react-router-dom'
function SecondHeader({ blog, setSharePopup,img}) {

    const [scrolled, setScrolled] = React.useState(false);
    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 250) {
            setScrolled(true);
        }
        else {
            setScrolled(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
    })

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    let navbarClasses = ['navbar2'];
    if (scrolled) {
        navbarClasses.push('scrolled');
    }
    return (
        <header className={navbarClasses.join(" ")}>
            <div className="container header">
                <div onClick={()=>scrollToTop()} className="header_name d-flex align-items-center">
                    <a  href="#"><Avatar src={img}/></a>
                    <h5><a href="#">{blog}</a></h5>
                </div>
                <nav className="navigation">
                    <ul>
                        <li style={{ cursor: "pointer",color:"#25AAE1" }}>
                            <span onClick={setSharePopup}>Share <i className="fas fa-share-alt"></i></span>

                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default SecondHeader
