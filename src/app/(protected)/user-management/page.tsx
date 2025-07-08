"use client"


import UserManagement from "@/components/usermanagement/usermanagement"

export default function UserPage(){
    return(
        <div className="p-6 overflow-y-hidden h-screen w-full flex flex-col"> 
            <UserManagement/>
        </div>
    )
}
