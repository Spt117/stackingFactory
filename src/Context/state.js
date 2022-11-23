const actions = {
    init: "INIT",
}

const initialState = {
    provider: null,
    signer: null,
    account: null,
    networkID: null,
    createPool: null,
    stackingAbi: null,
    IERC20Abi: null,
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
