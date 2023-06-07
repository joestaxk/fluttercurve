
export default function userDataReducer(state:any, action:{type: any, payload: any}) {
    switch (action.type) {
        case 'addData':
            return {...action.payload}
    }
}