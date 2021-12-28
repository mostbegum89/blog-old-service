import { Button, makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  hidden: {
    display: "-webkit-box",
    display: "-moz-box",
    WebkitLineClamp: 3,
    overflow: "hidden",
    WebkitBoxOrient: "vertical"
  }
}));
function ShowMore({ post }) {
  const classes = useStyles();
  const [isHidden, setIsHidden] = useState(true);
  const [text, setText] = useState('');


  useEffect(() => {
    setText(post)
  }, [post])

  return (
    <>

      <div className={isHidden ? 'hidden' : null}>
        <div style={{ padding: "10px 10px 0 10px" }} dangerouslySetInnerHTML={{ __html: text }}></div>
      </div>

      {
        text && text.length > 300 && <span style={{ padding: "10px", color: "#1478BF", cursor: "pointer" }} size="small" onClick={() => setIsHidden(!isHidden)}>
          {isHidden ? "Show more" : "Show less"}
        </span>
      }
    </>
  );
}

export default ShowMore