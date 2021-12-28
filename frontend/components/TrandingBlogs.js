import React, { useEffect, useState } from "react";
import axios from "axios";
//import groupholder from '../public/groupholder.png'
import { useSelector } from "react-redux";
import { setToast } from "../components/ToastMsg";
import { useRouter } from "next/router";
import Link from "next/link";

function TrendingBlogs() {
  const [trendingBlogs, setTrendingBlogs] = useState([]);

  let Router = useRouter();
  const { user, authenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    axios.get("/blog/trendingblog").then((res) => {
        setTrendingBlogs(res.data.blog);
      //console.log(res.data.groups);
    });
  }, []);

  

  return (
    <div className='trending_group'>
      <h6>Trending Blogs</h6>

      {trendingBlogs.length > 0 ? (
        trendingBlogs.map((b, index) => {
          return (
            <div key={index} className="groups aligh-items-center">
              <img
                src={b.blogImage ? b.blogImage : "/groupholder.png"}
                alt=""
                className="img-fluid"
              />
              <Link href={`/b/${b.slug}`}>
                <a>
                  <p>
                    {b.name} <br></br> 
                  </p>
                </a>
              </Link>
             <Link href={`/b/${b.slug}`}>
             <a
                  style={{ background: "#2684d4", color: "white" }}
                  onClick={() => handleJoin(g._id)}
                  className="btn"
                >
                  view <i className="fas fa-sign-in-alt"></i>
                </a>
             </Link>
              
            </div>
          );
        })
      ) : (
        <p>No groups found</p>
      )}
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <button className="moreBtn" onClick={() => Router.push("/blogs")}>
          More
          <i
            style={{ marginLeft: "5px" }}
            className="fas fa-angle-double-right"
          ></i>
        </button>
      </div>
    </div>
  );
}

export default TrendingBlogs;
