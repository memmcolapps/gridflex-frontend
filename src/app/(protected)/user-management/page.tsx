"use client"

import { Footer } from "@/components/footer"
import UserManagement from "@/components/usermanagement/usermanagement"

export default function UserPage(){
    return(
        <div className="overflow-y-hidden"> 
            <UserManagement/>
            <Footer/>
        </div>
    )
}
