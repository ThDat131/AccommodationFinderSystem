import cookie from 'react-cookies'

type State = {
    user: any
}

type action = | {type: "login"; payload: State["user"]} | {type: "logout"} | {type: "update_user"; payload: State["user"]}

const MyUserReducer = (state: State, action: action) => {
    switch(action.type){
        case "login":
            return action.payload
        case "logout": 
            cookie.remove("token")
            cookie.remove("user")
            return null
        case "update_user":
            return action.payload
    }
}
export default MyUserReducer