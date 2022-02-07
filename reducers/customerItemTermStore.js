import moment from 'moment';

//날짜세팅
const now = new Date();
const beforeWeek = new Date(now);
beforeWeek.setDate(now.getDate() - 7);

const initialState = {
    searchWord: {
        baseDateFrom: moment(beforeWeek),   //moment값
        baseDateTo: moment(now),            //moment값
        customerId: null,
    }, 
	customerItemTerms: [],			//거래처품목별통계목록
	isListLoadingBar: false,		//목록 로딩바
};


//Action creator

//거래처품목별통계목록 출력
export const queryCustomerItemTerms = (data) => {
    return {
        type: 'QUERY_CUSTOMER_ITEM_TERMS',
        data
    };
};

//거래처품목별통계목록 출력
export const setCustomerItemTerms = (data) => {
    return {
        type: 'SET_CUSTOMER_ITEM_TERMS',
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



export const customerItemTermStore = (state = initialState, action) => {
    switch (action.type) {
        case 'QUERY_CUSTOMER_ITEM_TERMS': {
            return {
                ...state,
                searchWord: {
                    baseDateFrom : action.data.baseDateFrom,
                    baseDateTo : action.data.baseDateTo,
                    customerId: action.data.customerId,
                }
            }
        }
		case 'SET_CUSTOMER_ITEM_TERMS': {
            return {
                ...state,
                customerItemTerms: [...action.data],
            }
        }
		case 'SET_LIST_LOADING_BAR': {
			return {
                ...state,
                isListLoadingBar: action.data,
            }
		}
        default: {
            return {
                ...state,
            }
        }
    }
};

export default customerItemTermStore;