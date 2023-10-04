const ImagePreview = ({ sourceFile }) => {
  return (
    <>
      <div>
        <img
          style={{ width: "200px", height: "100px", objectFit: "cover" }}
          src={sourceFile}
          alt=""
        />
      </div>
    </>
  );
};

export default ImagePreview;
