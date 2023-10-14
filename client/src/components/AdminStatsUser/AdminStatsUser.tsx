import React, { useContext, useEffect, useState } from "react";
import ChartStats from "../ChartStats/ChartStats";
import axios from "axios";
import { MyUserContext } from "../../App";
import cookie from "react-cookies";
import { Container, Form } from "react-bootstrap";

const AdminStatsUser = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filter, setFilter] = useState({
    year: "",
    month: "",
    quarter: "",
  });
  const change = (evt, field) => {
    const value = evt.target.value;
    setFilter((current) => {
      return { ...current, [field]: value };
    });
  };
  const [data, setData] = useState([]);

  useEffect(() => {
    const process = async () => {
      await axios
        .get("http://127.0.0.1:8085/api/admin/users/stats?", {
          headers: {
            Authorization: cookie.load("token"),
          },
          params: filter,
        })
        .then((res) => {
          const sortedData = res?.data[0]?.months.sort(
            (a, b) => a.month - b.month
          );
          setOriginalData(sortedData);
          setData(res.data);
        })
        .catch((err) => console.log(err));
    };
    process();
  }, [filter]);
  return (
    <>
      <Container>
        <div>
          <h1 className="text-center mt-3">THỐNG KÊ SỐ LƯỢNG NGƯỜI DÙNG</h1>
          <div className="">
            <Form className="d-flex justify-content-between">
              <Form.Group className="w-25">
                <Form.Label>Nhập năm:</Form.Label>
                <Form.Control
                  placeholder="Nhập năm"
                  onChange={(e) => change(e, "year")}
                />
              </Form.Group>

              <Form.Group className="w-25">
                <Form.Label>Chọn quý:</Form.Label>
                <Form.Select
                  onChange={(e) => change(e, "quarter")}
                  disabled={!filter.year || filter.month !== ""}
                >
                  <option value="">--- Chọn quý ---</option>
                  <option value="1">Quý 1</option>
                  <option value="2">Quý 2</option>
                  <option value="3">Quý 3</option>
                  <option value="4">Quý 4</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="w-25">
                <Form.Label>Chọn tháng:</Form.Label>
                <Form.Select
                  onChange={(e) => change(e, "month")}
                  disabled={!filter.year || filter.quarter !== ""}
                >
                  <option value="">--- Chọn tháng ---</option>
                  <option value="1">Tháng 1</option>
                  <option value="2">Tháng 2</option>
                  <option value="3">Tháng 3</option>
                  <option value="4">Tháng 4</option>
                  <option value="5">Tháng 5</option>
                  <option value="6">Tháng 6</option>
                  <option value="7">Tháng 7</option>
                  <option value="8">Tháng 8</option>
                  <option value="9">Tháng 9</option>
                  <option value="10">Tháng 10</option>
                  <option value="11">Tháng 11</option>
                  <option value="12">Tháng 12</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </div>
          <ChartStats
            statsName="Thống kê số lượng người đăng ký"
            statsLable="Số lượng"
            stats={data}
          />
        </div>
      </Container>
    </>
  );
};

export default AdminStatsUser;
