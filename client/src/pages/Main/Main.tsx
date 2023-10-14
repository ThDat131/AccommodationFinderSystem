import { useEffect, useState } from "react";
import { getPosts } from "../../services/Apis";
import { Button, Form, Spinner } from "react-bootstrap";
import LocationBox from "../../components/LocationBox/LocationBox";
import DNPic from "../../assets/img/location_dn.jpg";
import HCMPic from "../../assets/img/location_hcm.jpg";
import HNPic from "../../assets/img/location_hn.jpg";
import PostBox from "../../components/PostBox/PostBox";
import FilterPricePost from "../../components/FilterPricePost/FilterPricePost";
import FilterAcreagePost from "../../components/FilterAcreagePost/FilterAcreagePost";
import { Post } from "../../interface/Post";
import FilterAll from "../../components/FilterAll/FilterAll";

const Main = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [params, getParams] = useState({});

  useEffect(() => {
    setIsLoading(true);
    getPosts(params).then((res) => {
      if (res.status === 200) {
        setPosts(res.data.posts);
        setIsLoading(false);
      }
    });
  }, [params]);
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
            Hệ thống tìm kiếm nhà trọ số 1 Việt Nam
          </h3>
          <FilterAll getParams={getParams} />
          <div className="d-flex align-items-center justify-content-center gap-4 my-3">
            <LocationBox
              category={null}
              image={HCMPic}
              locationName={"Hồ Chí Minh"}
            />
            <LocationBox
              category={null}
              image={HNPic}
              locationName={"Hà Nội"}
            />
            <LocationBox
              category={null}
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
export default Main;
