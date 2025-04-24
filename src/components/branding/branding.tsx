interface BrandingProps{
    labelTitle: string 
    label: string   
}
export function Branding({labelTitle,label} :BrandingProps){
    return(
        <div className="w-1/2 text-black p-2 flex flex-col justify-between h-100">
        <div className="w-95 h-100 flex items-start">
            <img
            className="ml-4"
                src="/images/gridflexlogo.jpg"
                alt="Gridflex logo"
                width="220"
                height="320"
            />
        </div>
        <div className="w-95">
        <h1 className="text-2xl font-semibold ml-4 mt-2">{labelTitle}</h1>
        <p className="text-sm mt-4 ml-4 whitespace-pre-line text-gray-600">{label}</p>
        </div>
    </div>
    )

}