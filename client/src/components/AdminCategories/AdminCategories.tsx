import { useEffect, useState } from "react";
import {
  Button,
  FloatingLabel,
  Form,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { Category } from "../../interface/Category";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../../services/AuthApis";
import { toast } from "react-toastify";

const AdminCategories = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setNewCategory({
      name: "",
      active: false,
    });
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [newCategory, setNewCategory] = useState<Category>({
    name: "",
    active: false,
  });
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<any>({
    name: "",
  });

  useEffect(() => {
    getCategories().then((res) => {
      if (res.status === 200) {
        setCategories(res.data);
        setIsLoading(false);
      }
    });
  }, []);

  const validation = (msgError: any) => {
    if (!newCategory.name.trim()) {
      msgError.name = "Name is required!";
    }
  };

  const handleCreate = () => {
    const msgError: any = {};
    validation(msgError);
    if (Object.keys(msgError).length > 0) {
      setErrors(msgError);
      return;
    }

    createCategory(newCategory).then((res) => {
      if (res.status === 201) {
        setCategories([...categories, res.data]);
        setNewCategory({
          name: "",
          active: false,
        });
      }
    });
    handleClose();
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá danh mục này?")) {
      deleteCategory(id).then((res: any) => {
        if (res.status === 200) {
          toast.success("Xoá danh mục thành công");
          setCategories(categories.filter((category) => category._id !== id));
        }
      });
    }
  };

  if (isLoading)
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner />
      </div>
    );

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo danh mục mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel label="Name" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Category name"
              value={newCategory.name}
              onChange={(evt) => {
                setErrors((prevErrors: any) => ({
                  ...prevErrors,
                  name: "",
                }));
                setNewCategory((prevValue) => {
                  return {
                    ...prevValue,
                    name: evt.target.value,
                  };
                });
              }}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </FloatingLabel>
          <Form.Check
            type="checkbox"
            label="Active"
            className="mb-3"
            checked={newCategory.active}
            onChange={(evt) => {
              setNewCategory((prevValue) => {
                return {
                  ...prevValue,
                  active: evt.target.checked,
                };
              });
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Huỷ
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Tạo
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container px-5 pt-2">
        <div className="row justify-content-center align-items-center">
          <div className="col-12">
            <h1 className="text-center text-primary">Quản lý danh mục</h1>
            <button className="btn btn-primary my-3" onClick={handleShow}>
              Tạo danh mục
            </button>
            {categories.length > 0 ? (
              <Table striped hover variant="light">
                <thead>
                  <tr>
                    <th className="text-center">Tên danh mục</th>
                    <th className="text-center">Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category: Category, index: number) => {
                    return (
                      <tr key={index}>
                        <td className="text-center align-middle">{category.name}</td>
                        <td className="text-center align-middle">
                          {category.active ? (
                            <i className="fa-solid fa-check"></i>
                          ) : (
                            ""
                          )}
                        </td>
                        <td className="text-center align-middle">
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              handleDeleteCategory(category._id);
                            }}
                          >
                            Xoá
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center w-100"
                style={{ height: "500px" }}
              >
                <h4>Chưa có danh mục nào</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCategories;
