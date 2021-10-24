const initialState = {
    searchWord: {
        name: null,
        deptRate: null,
        epsRate: null,
        roeRate: null,
    }
};


//Action creator
export const searchScreener = (data) => {
    return {
        type: 'SEARCH_SCREENER',
        data
    };
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SEARCH_SCREENER': {
            return {
                ...state,
                searchWord: {
                    name: action.data.name,
                    deptRate: action.data.deptRate,
                    epsRate: action.data.epsRate,
                    roeRate: action.data.roeRate
                }
            }
        }
        default: {
            return {
                ...state,
            }
        }
    }
};

export default rootReducer;