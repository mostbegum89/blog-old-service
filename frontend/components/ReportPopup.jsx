import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'antd';
import { setToast } from './ToastMsg';
import axios from 'axios'
function ReportPopup({ visible, handleCancel ,post}) {
    const [selectedReport, setSelectedReport] = useState(null)
    const reports = [
        "Adult Content", "Nudity", "Fake Name", "Fake Account", "Fake News", "Spam", "Harassment", "Something Else"
    ]
    const handleOk = () => {
        if(!selectedReport){
            return setToast("Please select a category","warning")
        }

        
        axios.post(`/report/submit/${post}`,{type:selectedReport})
        .then(res=>{
            if(res.data.success){
                handleCancel()
                setToast("report submitted","success")
            }
        })
        .catch(err=>{
            setToast("Something went wrong","error")
        })
        
    }
    return (
        <div>
            <Modal
                visible={visible}
                title="Report this post"
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancle
                    </Button>,
                    <Button disabled={!selectedReport} key="submit" type="primary" onClick={()=>handleOk()}>
                        Submit
                    </Button>,
                ]}
            >
                <section className="report_box">

                    {
                        reports.map((report, index) => {
                            return (

                                <span 
                                className={selectedReport === report && "report_box_active"} 
                                style={{ textTransform: "capitalize" }} 
                                key={index}
                                onClick={()=>setSelectedReport(report)}
                                >{report}
                                </span>

                            )
                        })
                    }

                </section>
            </Modal>
        </div>
    )
}

export default ReportPopup
