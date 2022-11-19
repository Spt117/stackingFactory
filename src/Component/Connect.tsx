import { FunctionComponent, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    start?: number
}>

export const Connect: FunctionComponent<Props> =  ({start = 0, children}) => {
    const[n, setN] = useState(start)
    useEffect(() => {
        // if(window.ethereum) {
            
        // }
    })

    return(
        <div>
            {children}
        </div>
    )
}