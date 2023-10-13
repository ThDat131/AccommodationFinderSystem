import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryById, getPosts } from "../../services/Apis";
import { Category } from "../../interface/Category";
import { Spinner } from "react-bootstrap";
import LocationBox from "../../components/LocationBox/LocationBox";
import DNPic from "../../assets/img/location_dn.jpg"
import HCMPic from "../../assets/img/location_hcm.jpg";
import HNPic from "../../assets/img/location_hn.jpg";
import PostBox from "../../components/PostBox/PostBox";
import FilterPricePost from "../../components/FilterPricePost/FilterPricePost";
import FilterAcreagePost from "../../components/FilterAcreagePost/FilterAcreagePost";
import { Post } from "../../interface/Post";

const PostByCategory = () => {
  const [category, setCategory] = useState<Category>(null);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [params, getParams] = useState({});

  useEffect(() => {
    setIsLoading(true);
    getPosts(Object.assign({ categoryId: id }, params)).then((res) => {
      if (res.status === 200) {
        setPosts(res.data.posts);
        setIsLoading(false);
      }
    });
  }, [id, params]);
  useEffect(() => {
    setIsLoading(true);
    getCategoryById(id).then((res) => {
      if (res.status === 200) {
        setCategory(res.data);
        setIsLoading(false);
      }
    });
  }, [id]);
  if (isLoading)
    return (
      <div className="d-flex align-items-center justify-content-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="container">
        <div className="row">
          <h3 className="text-dark my-4 fw-bold">
            Cho Thuê {category.name} Giá Rẻ, Mới Nhất 2023
          </h3>

          <div className="d-flex align-items-center justify-content-center gap-4 my-3">
            <LocationBox
              category={category}
              image={HCMPic}
              locationName={"Hồ Chí Minh"}
            />
            <LocationBox
              category={category}
              image={HNPic}
              locationName={"Hà Nội"}
            />
            <LocationBox
              category={category}
              image={DNPic}
              locationName={"Đà Nẵng"}
            />
          </div>

          <div className="col-8 rounded my-3 p-3">
            <div className="p-3" style={{ backgroundColor: "#f5f5f5" }}>
              <h4 className="text-dark">Tổng {posts.length} Kết quả</h4>
              {posts.map((post: Post) => {
                return <PostBox key={post._id} data={post} />;
              })}
            </div>
          </div>
          <div className="col-4 rounded my-3 p-3">
            <FilterPricePost getParams={getParams} />
            <FilterAcreagePost getParams={getParams} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostByCategory;
