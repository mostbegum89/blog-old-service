import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../../components/NavbarComp'
import axios from 'axios'
import { useSelector,useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import moment from 'moment'
import { socket } from '../../helper/auth'
import { Spin } from 'antd';





function Message() {
    const { profile } = useSelector(state => state.auth)
    const { chats } = useSelector(state => state.chat)
    const dispatch = useDispatch()
    //console.log(chats);
    const Router = useRouter()
    //const [myChats, setMyChats] = useState([])

    const [messages, setMessages] = useState([])
    const [chat, setChat] = useState(null)
    const [text, setText] = useState("")
    const [isTyping, setisTyping] = useState(false)

    const [isSendingImage, setIsSendingImage] = useState(false)


    useEffect(() => {
        if (socket) {
            socket.on("receive", data => {
                setMessages(prev => [...prev, data.message])
                //console.log(data);
            })
            socket.on("istyping", data => {
                setisTyping(data.istyping)
            })
            // socket.on("newmessage", data => {
            //    console.log(data);
            // })
        }


    }, [socket])


    var typing = false;
    var timeout = undefined;

    function timeoutFunction() {
        typing = false;
        socket.emit("typing", { to: chat._id, istyping: false });
        //console.log('typing stopped');
    }

    let handleKey = (e) => {

        if (e.keyCode === 13) {
            sendMessage()
        } else {
            if (typing == false) {
                typing = true
                //console.log('typing started');
                socket.emit("typing", { to: chat._id, istyping: true });
                timeout = setTimeout(timeoutFunction, 5000);
            } else {
                clearTimeout(timeout);
                timeout = setTimeout(timeoutFunction, 5000);
            }
        }
    }




    // useEffect(() => {
    //     axios.get('/chat/mychats')
    //         .then(res => {
    //             setMyChats(res.data.chats);
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })
    // }, [])

    useEffect(() => {
        if (Router.query.chatid) {
            axios.get(`/chat/${Router.query.chatid}/messages`)
                .then(res => {
                    setChat(res.data.chat)
                    setMessages(res.data.messages)
                    dispatch({
                        type:"MARK_READ",
                        payload: res.data.chat._id
                    })
                    socket.emit("joinchat", { id: res.data.chat._id })
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [Router])

    const findUser = (users) => {
        let otherUser = users.filter(u => u._id !== profile._id)[0]
        return otherUser
    }

    const clearFields = () => {
        setText("")
    }

    const dispatchLatest=(latestMessage)=>{
        dispatch({
            type:"UPDATE_LATEST_MESSAGE",
            payload:{chatId:chat._id,latestMessage}
        })
    }
    const sendMessage = () => {
        if(!text){
            return alert("Write something")
        }
        let data = {
            type: "text",
            content: text
        }
        axios.put(`/chat/sendmessage/${chat._id}`, data)
            .then(res => {
                setMessages(prev => [...prev, res.data.message])
                dispatchLatest( res.data.message)
                socket.emit("sendmessage", { message: res.data.message, chatid: chat._id })
                clearFields()

            })
            .catch(err => {
                console.log(err);
            })
    }


      //send image using api
  let handleImage = (img) => {
    //setimgsending(true)
    if (img) {
       setIsSendingImage(true)
      let formData = new FormData()
      formData.append('chatimage', img)
      axios.put('chat/sendimage/' + chat._id, formData)
        .then(res => {
            setMessages(prev => [...prev, res.data.message])
            dispatchLatest( res.data.message)
            socket.emit("sendmessage", { message: res.data.message, chatid: chat._id })
            clearFields()
            setIsSendingImage(false)
        })
        .catch(err=>{
            setIsSendingImage(false)
            console.log(err);
        })
    }

  }



    //scroll to last message automatically
    let lastmsgref = useRef()

    useEffect(() => {
        if (lastmsgref.current) {
            lastmsgref.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                //inline: "start"
            })
        }
    })

    return (
        <>
            <Navbar />
            <div id="chat_container">




                <div id="container">
                    <aside>
                        <header>
                            <input type="text" placeholder="search" />
                        </header>
                        <ul>
                            {
                                chats.length > 0 &&
                                chats.map((chat, index) => (
                                    <li className={Router.query.chatid === chat._id ? "active" : ""} onClick={() => Router.push(`/chat/${chat._id}`)} key={index}>
                                        <img src={findUser(chat.users).profileimg||"/profile.png"} alt="" />
                                        <div>
                                            <h2>{findUser(chat.users).first} {findUser(chat.users).last}</h2>
                                            <h3>
                                                {
                                                    ! chat.latestMessage ?<>New chat</>:
                                                    chat.latestMessage?.type === 'image'?
                                                    <>
                                                            {chat.latestMessage.sender.first}: Image
                                                        </>
                                                        
                                                    :
                                                        <>
                                                            {chat.latestMessage.sender.first}: {chat.latestMessage.content}
                                                        </>
                                                        
                                                        
                                                }
                                            </h3>
                                        </div>
                                    </li>
                                ))
                            }

                        </ul>
                    </aside>
                    <main>
                        <header>
                            <img src={chat && findUser(chat.users).profileimg||"/profile.png"} alt="" />
                            <div>
                                <h2>Chat with {chat && <>{findUser(chat.users).first} {findUser(chat.users).last}</>}</h2>
                                <h3>{isTyping && "Typing..."}</h3>
                            </div>
                        </header>
                        <ul id="chat">



                            {
                                messages.length > 0 &&
                                messages.map((message, index) => {
                                    const lastmessage = messages.length - 1 === index
                                    return (
                                        <li ref={lastmessage ? lastmsgref : null} key={index} className={message.sender._id === profile._id ? "me" : "you"}>
                                            <div className="entete">
                                                <h2>{message.sender.first} {message.sender.last}</h2>

                                                {/* <span className="status blue"></span> */}
                                            </div>
                                            <div className="triangle"></div>
                                            <div className="message">

                                            {
                                                message.type === "text" ?
                                                message.content:
                                                message.type === "image" ?
                                                <img style={{height:"100px"}} src={message.content}></img>:
                                                ""
                                            }
                                                
                                                <h3>{moment(message.createdAt).fromNow()}</h3>
                                            </div>

                                        </li>
                                    )

                                }
                                )
                            }
                        </ul>


                        <footer>
                            <input onChange={(e) => handleImage(e.target.files[0])} style={{ display: "none" }} accept="image/*" id="icon-button-file" type="file" />
                            <label style={{ margin: "0" }} htmlFor="icon-button-file">
                                {
                                    isSendingImage ? <Spin></Spin>:
                                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_picture.png" alt="" />
                                }
                               
                            </label>

                            <textarea onKeyDown={(e) => { handleKey(e) }} value={text} onChange={e => setText(e.target.value)} placeholder="Type your message"></textarea>
                            <button onClick={() => sendMessage()}>Send</button>
                        </footer>
                    </main>
                </div>


            </div>
        </>
    )
}

export default Message
