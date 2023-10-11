import axios from "axios";
import cookie from "react-cookies";

const BASE_URL = "http://localhost:8085";

// export const getStatsPost = async(data)

export const createCategory = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/categories/create/`, data, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    console.error(err);
  }
};
export const getCategories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/categories/`, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const createPost = async (data: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/posts/create/`, data, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const createLandlord = async (data: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/landlords/create`, data, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const createComment = async (data: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/comments`, data, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const replyComment = async (id: string, data: any) => {
  try {
    const res = await axios.put(`${BASE_URL}/api/comments/${id}/reply`, data, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const editComment = async (commentId: string, data: any) => {
  try {
    const res = await axios.put(`${BASE_URL}/api/comments/${commentId}`, data, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const deleteComment = async (id: string, data: any) => {
  try {
    const res = await axios.delete(`${BASE_URL}/api/comments/${id}`, {
      headers: {
        Authorization: cookie.load("token"),
      },
      data: data,
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const deleteReplyComment = async (
  id: string,
  replyId: string,
  data: any
) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/api/comments/${id}/replies/${replyId} `,
      {
        headers: {
          Authorization: cookie.load("token"),
        },
        data: data,
      }
    );
    return res;
  } catch (err) {
    return err;
  }
};

export const editReplyComment = async (
  commentId: string,
  replyId: string,
  data: any
) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/api/comments/${commentId}/replies/${replyId}`,
      data,
      {
        headers: {
          Authorization: cookie.load("token"),
        },
      }
    );
    return res;
  } catch (err) {
    return err;
  }
};

export const createUserByAdmin = async (data: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/createUser`, data, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await axios.delete(`${BASE_URL}/api/users/${id}`, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const res = await axios.delete(`${BASE_URL}/api/categories/${id}`, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const getLandlords = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/landlords/`, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const approveLandlord = async (id: string, data: any) => {
  try {
    const res = await axios.put(`${BASE_URL}/api/landlords/${id}/update/`, data, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const follow = async (data: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/follows/`, data, {
      headers: {
        Authorization: cookie.load("token"),
      },
    });
    return res;
  } catch (err) {
    return err;
  }
}

export const unFollow = async (data: any) => {
  try {
    console.log(data)
    const res = await axios.delete(`${BASE_URL}/api/follows/?follower=${data.follower}&following=${data.following}`, {
      headers: {
        Authorization: cookie.load("token"),
        data: data
      },
    });
    return res;
  } catch (err) {
    return err;
  }
}

export const getListFollowing = async (id: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/follows/user/follower/${id}`, {
      headers: {
        Authorization: cookie.load("token"),
      }
    });
    return res;
  } catch (err) {
    return err;
  }
}