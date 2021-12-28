import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import GroupLayout from '../../../components/GroupLayout'
import axios from 'axios'
import {useRouter} from 'next/router'
import CreateGroupPost from '../../../components/CreateGroupPost'
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import SkeletonComp from '../../../components/SketetonComp'
import PostCard from '../../../components/postcard/PostCard'
import { setToast } from '../../../components/ToastMsg'

import ShortProfileSidebar from '../../../components/ShortProfileSidebar'
import Head from "next/head";

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);





function GroupTimeline({groupserver}) {
    const [group, setGroup] = useState({})
    const [groupPost, setGroupPost] = useState([])
    const [rules, setRules] = useState([])
    const [postfetch, setPostfetch] = useState(false)
    const [backdrop, setBackdrop] = useState(false)

    const [access, setaccess] = useState(false)
  

    const [expanded, setExpanded] = useState('panel0');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const { profile, user,authenticated } = useSelector(state => state.auth)

    let Router = useRouter()
    //console.log(Router);
    useEffect(() => {
        if(!Router || !user)return
        setBackdrop(true)
        axios.get('/group/' + Router.query.slug)
            .then(res => {
               
                if (res.data.group.privacy === 'private') {
                    if (!res.data.group.members.includes(user._id)) {
                        setaccess(false)
                    } else if (res.data.group.members.includes(user._id)) {
                        setaccess(true)
                    }
                } else {
                    setaccess(true)
                }
                setGroup(res.data.group)
                setRules(res.data.group.rules)
                setBackdrop(false)
            })
            .catch(err => {
                err.response && Router.push('/')
                setBackdrop(false)

            })
    }, [Router,user])


    useEffect(() => {
        if (!group._id) return
        setPostfetch(true)
        axios.get('/post/grouppost/' + group._id)
            .then(res => {
                setGroupPost(res.data.post)
                setPostfetch(false)

            })
    }, [group])


    let getpost = (val) => {
        setGroupPost([val, ...groupPost])

    }

    let deletePost = (id) => {
        axios.patch(`/post/delete/${id}`)
            .then(res => {
                if (res.data.success) {
                    let postarray = [...groupPost]
                    let index = postarray.findIndex(post => post._id === id)
                    postarray.splice(index, 1)
                    setGroupPost(postarray)
                    setToast("Post Deleted", "error")
                }
            })
    }


    let catChange = (cat) => {
        setBackdrop(true)
        axios.get(`/post/grouppost/${group._id}?category=${cat}`)
            .then(res => {
                setGroupPost(res.data.post)
                setPostfetch(false)
                setBackdrop(false)
            })
    }
    return (
        <GroupLayout group={group && group} catChange={catChange}>
            <Backdrop style={{ zIndex: "99999" }} open={backdrop}>
                <CircularProgress color="primary" />
            </Backdrop>
            
            <Head>
			
                 <title>{`${groupserver ? groupserver.name:group?group.name:""} | Flikhs`}</title>
                <meta property="og:title" content={groupserver ? groupserver.name:group?group.name:""} key="title" />
                <meta property="og:description" content={groupserver ? groupserver.description:group?group.description:""} />
                <meta property="og:image" content={groupserver ? groupserver.groupimg:group?group.groupimg:""} />

                 {/* Twitter Meta Tags */}
                
<meta property="twitter:card" content="summary_large_image" />
{/* <meta property="twitter:url" content="https://flikhs-nextjs.vercel.app/g/my-group" /> */}
<meta property="twitter:title" content={groupserver ? groupserver.name:group?group.name:""} />
<meta property="twitter:description" content={groupserver ? groupserver.description:group?group.description:""} />
<meta property="twitter:image" content={groupserver ? groupserver.groupimg:group?group.groupimg:""} />
			</Head>
		

            {access && <section className="group_posts">

                <div>
                    <div className="row">
                        <div className="col-md-8">
                            {
                                group.members && group.members.includes(user._id) ? <CreateGroupPost group={group && group} getpost={getpost} /> : null
                            }

                            {/* <div className="best_box shadow-sm rounded">
                                <a href=""> <i className="fas fa-rocket"></i> Best</a>
                                <a href=""> <i className="fab fa-hotjar"></i> Hot</a>
                                <a href=""> <i className="fas fa-certificate"></i> New</a>
                                <a href=""> <i className="fas fa-sort-amount-up-alt"></i> Top</a>
                                <span className="float-right"> <a href=""><i className="fas fa-ellipsis-h "></i></a> </span>
                            </div> */}


                            {
                                postfetch ? <><SkeletonComp /> <SkeletonComp /></> :
                                    groupPost.length < 1 ? <p style={{ textAlign: "center" }}>No posts found</p> :
                                        groupPost.map((post, index) => {
                                            return <PostCard group={group && group} from='group' deletePost={deletePost} index={index} post={post} key={index} />
                                        })
                            }


                        </div>
                        {/* <!-- ---------------POST SIDE BAR (START)--------------- --> */}
                        <div className="col-md-4">
                            <div className="post_name shadow-sm rounded">
                                {/* <div className="sidevar-profile">
                                    <img style={{ height: "110px" }} src={profile && profile.coverimg ? profile.coverimg : "https://onlymevip.com/postuploads/profilepictures/default_cover.jpg"} className="coverpic" alt="" />
                                    <Link to="/profile"><img style={{backgroundColor:"white"}}  src={profile && profile.profileimg ? profile.profileimg : profileImage} className="profilepic" alt="" /></Link>
                                    <div className="username">
                                        <Link to="/profile">
                                            <h5>{profile.first} {profile.last}</h5>
                                        </Link>

                                    </div>
                                </div> */}
                                {
                                    authenticated &&  <ShortProfileSidebar />
                                }
                               
                            </div>
                            <div className="group_rules shadow-sm rounded">
                                <h5>R/Group Rules</h5>

                                <div>

                                    {
                                        rules && rules.map((rule, index) => {
                                            return <Accordion key={index} square expanded={expanded == "panel" + index} onChange={handleChange("panel" + index)}>
                                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                                    <Typography>{rule.title}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography>
                                                        {rule.description}
                                                    </Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                        })
                                    }
                                    {/* <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                            <Typography>Collapsible Group Item #1</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                                sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                                                elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>


                                    <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                                            <Typography>Collapsible Group Item #2</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                                sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                                                elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                            <Typography>Collapsible Group Item #3</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                                sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                                                elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion> */}
                                </div>
                            </div>
                        </div>
                        {/* <!-- ---------------POST SIDE BAR (END)--------------- --> */}
                    </div>
                </div>
            </section>}

            {
                !access && <section>
                    <p className='p-5 mt-5 text-center'>You don't have permision to view this group</p>
                </section>
            }
        </GroupLayout>
    )
}




export async function getServerSideProps(context) {

	try {
		const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/group/${context.params.slug}`)

		return {
			props: { groupserver: res.data.group }, // will be passed to the page component as props
		}	
	} catch (error) {
		return{
			props: { groupserver:null }
		}
	}

    
}

export default GroupTimeline
