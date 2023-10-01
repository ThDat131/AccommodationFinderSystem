import { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getAllUser } from "../../services/Apis";
import { MyUserContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";

const AdminUsers = () => {

    interface User {
        _id: string,
        email: string,
        avatar: string,
        role: string,
        active: boolean,
        fullName: string,
        phone: string
    }

    const [users, setUsers] = useState<Array<User>>([])
    const [user, _dispatch] = useContext(MyUserContext)
    const navigate = useNavigate();
    useEffect(() => {
        getAllUser().then(res => {
            console.log(res.data)
            setUsers(res.data)
        })
    }, [])

    useEffect(() => {
        if (!user || user.role !== "ROLE_ADMIN") return navigate("/forbidden");
    })
    return (
      <>
        <div className="container px-5 pt-2">
          <div className="row justify-content-center align-items-center">
            <div className="col-12">
              <h1 className="text-center text-primary">List user</h1>
              <Table striped hover variant="light">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Active</th>
                    <th>Avatar</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    return (
                      <tr key={index}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.role}</td>
                        <td>
                          {user.role ? (
                            <i className="fa-solid fa-check"></i>
                          ) : (
                            ""
                          )}
                        </td>
                        <td>
                          <img
                            src={user.avatar}
                            alt=""
                            width={50}
                            height={50}
                          />
                        </td>

                        <td>
                          <Link to={`/admin/update-user/${user._id}`}>
                            <button type="button" className="btn btn-primary">
                              Update
                            </button>
                          </Link>
                        </td>
                        <td>
                          <button type="button" className="btn btn-primary">
                            Reset Password
                          </button>
                        </td>
                        <td>
                          <button type="button" className="btn btn-danger">
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </>
    );
}
export default AdminUsers