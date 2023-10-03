import { useContext } from "react"
import { MyUserContext } from "../App"


const MyChatUserReducer = (state, action) => {

    switch (action.type) {
        case "ChangeUser":
            const { user, currentUser } = action.payload
            return {
                user: user,
                channelId: currentUser._id > user._id
                    ? currentUser._id + user._id
                    : user._id + currentUser._id
            }
        default:
            return state
    }
}
export default MyChatUserReducer