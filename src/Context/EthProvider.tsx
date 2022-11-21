import EthContext from "./EthContext"
import { useReducer } from "react";


export default function EthProvider({children}) {
  const [state, dispatch] = useReducer()

    return (
      <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
    )
}