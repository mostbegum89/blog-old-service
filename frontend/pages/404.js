import React,{useEffect} from 'react'
import {useRouter} from 'next/router'

function Error() {
    let Router = useRouter()
    useEffect(() => {
        Router.push('/')
    }, [])
    return (
        <div>
            
        </div>
    )
}

export default Error
