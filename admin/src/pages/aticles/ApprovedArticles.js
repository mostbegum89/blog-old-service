import React from 'react'
import AllArticles from './AllArticles'

function ApprovedArticles() {
    return (
        <div>
            <AllArticles isApproved={true} />
        </div>
    )
}

export default ApprovedArticles
