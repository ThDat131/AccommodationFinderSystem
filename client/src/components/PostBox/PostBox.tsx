import { decodeHtmlEntities } from "../../utils/Utils";

const PostBox = ({ data }) => {
  return (
    <>
      <div
        className="d-flex border-bottom border-secondary overflow-hidden my-3"
        style={{
          maxHeight: "250px",
        }}
      >
        <div className="col-4 p-3">
          <img
            className="w-100 h-100 rounded"
            src={data.images[0]}
            alt=""
            style={{
              objectFit: "cover",
            }}
          />
        </div>
        <div className="col-8 p-3">
          <h5 className="my-2">{data.name}</h5>
          <div className="d-flex gap-2 my-2">
            <p className="price text-success m-0">{data.price} triệu/tháng</p>
            <p className="acreage m-0">
              {data.acreage} m<sup>2</sup>
            </p>
            <p className="location m-0">Thành Phố Biên Hòa, Đồng Nai</p>
          </div>
          <div className="my-2">
            <p>{decodeHtmlEntities(data.content)}</p>
          </div>
          <div className="d-flex gap-2 align-items-center my-2">
            <img
              className="rounded rounded-circle"
              src="https://phongtro123.com/images/default-user.png"
              alt=""
              width={40}
              height={40}
            />
            <p className="m-0 text-secondary">Thái ngọc thịnh</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostBox;
