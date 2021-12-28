import React from 'react'
import { useSelector } from "react-redux";
import Link from 'next/link'

function ShortProfileSidebar() {
    let { authenticated, profile } = useSelector((state) => state.auth);
    return (
        <>
           <div className="about_profile shadow-sm">
                <img
                  style={{ height: "110px" }}
                  src={
                    profile && profile.coverimg
                      ? profile.coverimg
                      : "/cover.png"
                  }
                  className="coverpic"
                  alt=""
                />
                <Link href="/profile">
                <a>
                <img
                    src={
                      profile && profile.profileimg
                        ? profile.profileimg
                        : "/profile.png"
                    }
                    className="profilepic wow fadeIn"
                    alt=""
                  />
                </a>
                  
                </Link>
                <div className="username">
                  <Link href="/profile">
                    <a>
                    <h5 style={{color:"#2684d4"}}>
                      {profile.first} {profile.last}
                    </h5>
                    </a>
                    
                  </Link>
                </div>
              </div> 
        </>
    )
}

export default ShortProfileSidebar
