import axios from "axios";

const BASE_URL = "http://localhost:8085"

const userSignIn = async (data) => {
    try {
        const res = await axios.post(`${BASE_URL}/api/signup`, data)
        return res

    } catch(err) {
        return err.response.data
    }
}

export {userSignIn}
