const initialState = {
    searchWord: {
        name: null,
    }, 
	isDetailModalVisible: false,	//상세 Modal창 출력여부
	customers: [],					//고객목록
	detailCustomer: {},				//고객상세데이터
	isListLoadingBar: false,		//목록 로딩바
	isDetailLoadingBar: false,		//상세 로딩바
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

//목록 로딩바 출력
export const setListLoadingBar = (data) => {
    return {
        type: 'SET_LIST_LOADING_BAR',
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

//상세팝업 로딩바 출력
export const setDetailLoadingBar = (data) => {
    return {
        type: 'SET_DETAIL_LOADING_BAR',
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
                }
            }
        }
		case 'SET_CUSTOMERS': {
            return {
                ...state,
                customers: [...action.data],
            }
        }
		case 'SET_LIST_LOADING_BAR': {
			return {
                ...state,
                isListLoadingBar: action.data,
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
		case 'SET_DETAIL_LOADING_BAR': {
			return {
                ...state,
                isDetailLoadingBar: action.data,
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