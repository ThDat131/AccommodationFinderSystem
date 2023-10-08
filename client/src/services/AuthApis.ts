import axios from "axios";
import cookie from "react-cookies"

const BASE_URL = "http://localhost:8085"

export const createCategory = async (data) => {
    try {
        const res = await axios.post(`${BASE_URL}/api/categories/create/`, data, {
            headers: {
                Authorization: cookie.load("token")
            }
        })
        return res
    } catch(err) {
        console.error(err)
    }
}
export const getCategories = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/api/categories/`, {
            headers: {
                Authorization: cookie.load("token")
            }
        })
        return res
    } catch (err) {
        console.error(err)
    }
}

export const createPost = async (data: any) => {
    try {
        const res = await axios.post(`${BASE_URL}/api/posts/create/`, data, {
            headers: {
                Authorization: cookie.load("token")
            }
        })
        return res
    } catch (err) {
        console.error(err)
    }
}

export const createLandlord = async (data: any) => {
    try {
        const res = await axios.post(`${BASE_URL}/api/landlords/create`, data, {
            headers: {
                Authorization: cookie.load("token")
            }
        })
        return res
    } catch (err) {
        return err
    }
}

export const createComment = async(data: any) => {
    try {
        const res = await axios.post(`${BASE_URL}/api/comments`, data, {
            headers: {
                Authorization: cookie.load("token")
            }
        })
        return res
    } catch (err) {
        return err
    }
}