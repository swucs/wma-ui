import moment from 'moment';

//날짜세팅
const now = new Date();
const beforeWeek = new Date(now);
beforeWeek.setDate(now.getDate() - 7);


const initialState = {
    searchWord: {
        baseDateFrom: moment(beforeWeek),   //moment값
        baseDateTo: moment(now),            //moment값
        customerName: null,
        itemName: null,
        warehousingTypeText: null,
    }, 
	isDetailModalVisible: false,	//상세 Modal창 출력여부
	warehousings: [],					//거래처목록
	detailWarehousing: {},				//거래처상세데이터
	isListLoadingBar: false,		//목록 로딩바
	isDetailLoadingBar: false,		//상세 로딩바
};


//Action creator
export const queryWarehousings = (data) => {
    return {
        type: 'QUERY_WAREHOUSINGS',
        data
    };
};

//목록 출력
export const setWarehousings = (data) => {
    return {
        type: 'SET_WAREHOUSINGS',
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

//상세 거래처정보 세팅
export const setDetailWarehousing = (data) => {
    return {
        type: 'SET_DETAIL_WAREHOUSING',
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


export const warehousingStore = (state = initialState, action) => {
    switch (action.type) {
        case 'QUERY_WAREHOUSINGS': {
            return {
                ...state,
                searchWord: {
                    baseDateFrom: action.data.baseDateFrom,
                    baseDateTo: action.data.baseDateTo,
                    customerName: action.data.customerName,
                    itemName: action.data.itemName,
                    warehousingTypeText: action.data.warehousingTypeText,
                }
            }
        }
		case 'SET_WAREHOUSINGS': {
            return {
                ...state,
                warehousings: [...action.data],
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
		case 'SET_DETAIL_WAREHOUSING': {
            return {
                ...state,
                detailWarehousing: {...action.data},
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

export default warehousingStore;