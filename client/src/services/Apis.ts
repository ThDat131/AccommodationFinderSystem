import axios from "axios";
import cookie from "react-cookies"

const BASE_URL = "http://localhost:8085"

const userSignUp = async (data) => {
    try {
        const res = await axios.post(`${BASE_URL}/api/signup`, data)
          console.log(res);

        return res
        

    } catch(err) {
        return err.response.data
    }
}

const sendConfirmCode = async (data) => {
    try {
        const res = await axios.post(`${BASE_URL}/api/confirmCode`, data)
        
        return res

    } catch (err) {
        return err
    }
}

const userSignIn = async (data) => {
    try {
        const res = await axios.post(`${BASE_URL}/api/signin`, data)
        return res
    } catch (err) {
        return err
    }
}  

const getCurrentUser = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/api/getCurrentUser`, {headers: {
            Authorization: cookie.load("token")
        }})
        return res
    } catch (err) {
        return(err)
    }
}

export {
    userSignUp, 
    sendConfirmCode, 
    userSignIn, 
    getCurrentUser
}
