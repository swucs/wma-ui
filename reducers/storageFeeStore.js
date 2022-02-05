const initialState = {
    searchWord: {
        name: null,
    }, 
	isDetailModalVisible: false,	//상세 Modal창 출력여부
	storageFees: [],				//보관료목록
	storageFeeItem: {},				//보관료상세데이터
	isListLoadingBar: false,		//목록 로딩바
	isDetailLoadingBar: false,		//상세 로딩바
};


//Action creator
export const queryStorageFees = (data) => {
    return {
        type: 'QUERY_STORAGE_FEES',
        data
    };
};

//보관료목록 출력
export const setStorageFees = (data) => {
    return {
        type: 'SET_STORAGE_FEES',
        data
    };
};

//상세 보관료정보 세팅
export const setStorageFeeItem = (data) => {
    return {
        type: 'SET_STORAGE_FEE_ITEM',
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

//상세팝업 로딩바 출력
export const setDetailLoadingBar = (data) => {
    return {
        type: 'SET_DETAIL_LOADING_BAR',
        data
    };
};


export const storageFeeStore = (state = initialState, action) => {
    switch (action.type) {
        case 'QUERY_STORAGE_FEES': {
            return {
                ...state,
                searchWord: {
                    name: action.data.name,
                }
            }
        }
		case 'SET_STORAGE_FEES': {
            return {
                ...state,
                storageFees: [...action.data],
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
		case 'SET_STORAGE_FEE_ITEM': {
            return {
                ...state,
                storageFeeItem: {...action.data},
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

export default storageFeeStore;