import { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { approveLandlord, getLandlords } from "../../services/AuthApis";
import { ILandlord } from "../../interface/ILandlord";
import { toast } from "react-toastify";

const AdminLandlords = () => {
  const [landlords, setLandlords] = useState<Array<ILandlord>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleApproveLandlord = (id: string) => {
    setIsLoading(true)
    approveLandlord(id, { active: true }).then((res: any) => {
      if (res.status === 200) {
        setLandlords(() => {
          return landlords.map((landlord) =>
            landlord._id === id ? res.data : landlord
          );
        });
        toast.success("Duyệt thành công");
        setIsLoading(false)
      }
    });
  };

  useEffect(() => {
    getLandlords().then((res: any) => {
      if (res.status === 200) {
        setLandlords(res.data);
        setIsLoading(false);
      }
    });
  }, []);
  if (isLoading)
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner />
      </div>
    );

  return (
    <div className="container px-5 pt-2">
      <div className="row justify-content-center align-items-center">
        <div className="col-12">
          <h1 className="text-center text-primary">
            Danh sách duyệt tài khoản chủ trọ
          </h1>
          <Table className="text-center">
            <thead>
              <tr>
                <th>CMND</th>
                <th>Địa chỉ</th>
                <th>Hình ảnh</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {landlords.map((landlord, index) => {
                return (
                  <tr key={index}>
                    <td>{landlord.personalId}</td>
                    <td>{landlord.address}</td>
                    <td className="d-flex justify-content-center align-items-center gap-3">
                      {landlord.images.map((image, index) => {
                        return (
                          <img src={image} width="60" height="50" key={index} />
                        );
                      })}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleApproveLandlord(landlord._id)}
                        disabled={landlord.active}
                      >
                        Duyệt
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
  );
};
export default AdminLandlords;
