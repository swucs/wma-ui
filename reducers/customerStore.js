const initialState = {
    searchWord: {
        name: null,
        deptRate: null,
        epsRate: null,
        roeRate: null,
    }, 
	isDetailModalVisible: false,	//상세 Modal창 출력여부
	customers: [],					//고객목록
	detailCustomer: {}				//고객상세데이터
};


//Action creator
export const queryCustomers = (data) => {
    return {
        type: 'QUERY_CUSTOMERS',
        data
    };
};

//고객목록 출력
export const setCustomers = (data) => {
    return {
        type: 'SET_CUSTOMERS',
        data
    };
};

//상세 MODAL 출력여부
export const setDetailModalVisible = (data) => {
    return {
        type: 'SET_DETAIL_MODAL_VISIBLE',
        data
    };
};

//상세 고객정보 세팅
export const setDetailCustomer = (data) => {
    return {
        type: 'SET_DETAIL_CUSTOMER',
        data
    };
};


export const customerStore = (state = initialState, action) => {
    switch (action.type) {
        case 'QUERY_CUSTOMERS': {
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
		case 'SET_CUSTOMERS': {
            return {
                ...state,
                customers: [...action.data],
            }
        }
		case 'SET_DETAIL_MODAL_VISIBLE': {
            return {
                ...state,
                isDetailModalVisible: action.data,
            }
        }
		case 'SET_DETAIL_CUSTOMER': {
            return {
                ...state,
                detailCustomer: {...action.data},
            }
        }
        default: {
            return {
                ...state,
            }
        }
    }
};

export default customerStore;