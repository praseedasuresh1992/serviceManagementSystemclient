import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children,roles=[]}) {
    const raw=localStorage.getItem('user')
    const user=raw?JSON.parse(raw):null
    if(!user){
        return <Navigate to='/login'/>
    }
        // if(roles && !roles.includes(user.usertype))
        //    return  <Navigate to ="/common"/>    
  return  children
}

export default ProtectedRoute