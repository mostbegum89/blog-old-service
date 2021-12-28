import React from 'react'
import AllArticles from './AllArticles'

function PendingArticles() {
    return (
        <div>
            <AllArticles isApproved={false} />
        </div>
    )
}

export default PendingArticles
