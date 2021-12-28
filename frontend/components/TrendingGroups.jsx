import React, { useEffect, useState } from "react";
import axios from "axios";
//import groupholder from '../public/groupholder.png'
import { useSelector } from "react-redux";
import { setToast } from "../components/ToastMsg";
import { useRouter } from "next/router";
import Link from "next/link";

function TrendingGroups() {
  const [trendingGroups, setTrendingGroups] = useState([]);

  let Router = useRouter();
  const { user, authenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    axios.get("/group/trendinggroup").then((res) => {
      setTrendingGroups(res.data.groups);
      //console.log(res.data.groups);
    });
  }, []);

  let handleJoin = (id) => {
    axios
      .put("/group/join/" + id)
      .then((res) => {
        let array = [...trendingGroups];
        let index = array.findIndex((g) => g._id === id);
        array[index] = res.data.group;
        setTrendingGroups(array);
      })
      .catch((err) => {
        err.response && setToast(err.response.data.error, "error");
      });
  };
  let handleLeave = (id) => {
    axios
      .put("/group/leave/" + id)
      .then((res) => {
        let array = [...trendingGroups];
        let index = array.findIndex((g) => g._id === id);
        array[index] = res.data.group;
        setTrendingGroups(array);
      })
      .catch((err) => {
        err.response && setToast(err.response.data.error, "error");
      });
  };

  return (
    <div className='trending_group'>
      <h6>Trending Groups</h6>

      {trendingGroups.length > 0 ? (
        trendingGroups.map((g, index) => {
          return (
            <div key={index} className="groups aligh-items-center">
              <img
                src={g.groupimg ? g.groupimg : "/groupholder.png"}
                alt=""
                className="img-fluid"
              />
              <Link href={`/g/${g.slug}`}>
                <a>
                  <p>
                    {g.name} <br></br> 
                  </p>
                </a>
              </Link>
              {/* <span>{g.members.length} members</span> */}
              {!authenticated ? (
                false
              ) : g.members.includes(user._id) ? (
                <button
                  onClick={() => handleLeave(g._id)}
                  style={{ background: "red", color: "white" }}
                  className="btn"
                  href=""
                >
                  Leave <i className="fas fa-sign-out-alt"></i>
                </button>
              ) : (
                <button
                  style={{ background: "#2684d4", color: "white" }}
                  onClick={() => handleJoin(g._id)}
                  className="btn"
                >
                  Join <i className="fas fa-sign-in-alt"></i>
                </button>
              )}
            </div>
          );
        })
      ) : (
        <p>No groups found</p>
      )}
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <button className="moreBtn" onClick={() => Router.push("/groups")}>
          More
          <i
            style={{ marginLeft: "5px" }}
            class="fas fa-angle-double-right"
          ></i>
        </button>
      </div>
    </div>
  );
}

export default TrendingGroups;
