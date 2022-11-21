const actions = {
   init: "INIT",
}

const initialState = {
   provider: null,
   account: null,
   networkID: null,
}

const reducer = (state, action) => {
   const { type, data } = action
   switch (type) {
      case actions.init:
         return { ...state, ...data }
      default:
         throw new Error("Undefined reducer action type")
   }
}

export { actions, initialState, reducer }
