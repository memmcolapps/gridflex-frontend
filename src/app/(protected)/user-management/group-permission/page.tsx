"use client"

import { Footer } from "@/components/footer"
import GroupPermissionManagement from "@/components/group-permission/grouppermissionmgt"

export default function GrouppermissionPagePage(){

    return(
        <div className="overflow-y-hidden">
            <GroupPermissionManagement/>
            <Footer />
        </div>
    )
}