const ImagePreview = ({ sourceFile }) => {
  return (
    <>
      <div>
        <img
          style={{ width: "280px", height: "200px", objectFit: "cover" }}
          src={sourceFile}
          alt=""
        />
      </div>
    </>
  );
};

export default ImagePreview;
