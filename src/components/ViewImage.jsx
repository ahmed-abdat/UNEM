import { MdClose } from "react-icons/md";
import { useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FiDownload } from "react-icons/fi";
import { saveAs } from "file-saver";
import "./styles/ViewFullImage.css";
import "./styles/Swiper.css";

export default function ViewFullImage({
  selectedImage,
  setIsImageSelected,
  images,
}) {
  // handel Back
  const handelBack = () => {
    setIsImageSelected(false);
  };

  const selectedImageIndex = images.findIndex(
    (image) => image.src === selectedImage.src
  );

  // track the inedx of the selected image
  const [imageIndex, setImageIndex] = useState(selectedImageIndex);
  const [isLastIndex, setIsLastIndex] = useState(false);
  const [isFirstIndex, setIsFirstIndex] = useState(false);
  const [isArrowShow, setIsArrowShow] = useState(true);

  // handel next image
  const handelPrevImage = () => {
    if (imageIndex === images.length - 1) return;
    setImageIndex((prevImageIndex) => prevImageIndex + 1);
  };

  // handel prev image
  const handelNextImage = () => {
    if (imageIndex === 0) return;
    setImageIndex((prevImageIndex) => prevImageIndex - 1);
  };

  //   check if the current image index is the first index or the last index
  useEffect(() => {
    if (imageIndex === 0) {
      setIsLastIndex(true);
    } else {
      setIsLastIndex(false);
    }
    if (imageIndex === images.length - 1) {
      setIsFirstIndex(true);
    } else {
      setIsFirstIndex(false);
    }
  }, [imageIndex, images.length]);

  // handel download image
  const downloadImage = () => {
    const imageURL = images[imageIndex].url;
    const imageName = imageURL?.split("?")[0].split("/")[7];
    saveAs(imageURL, imageName);
  };

  return (
    <div className="viewFullPage">
      <div className="header">
        <div className="icon" onClick={handelBack}>
          <MdClose />
        </div>
        <div className="icon">
          <FiDownload onClick={downloadImage} />
        </div>
      </div>
      <div className="image d-f">
        <div className="swiper--container">
          {/* render the current image and add a cursor to navigate between images */}
          <div
            className={`swiper--wrapper`}
            style={{ transform: `translateX(-${imageIndex * 100}%)` }}
          >
            {images.map((image) => (
              <div key={image.url} className="swiper--image">
                <LazyLoadImage
                  alt="image"
                  height={"100%"}
                  src={image.url}
                  onClick={() => setIsArrowShow((prev) => !prev)}
                  width={"100%"}
                  effect="blur"
                />

                {isArrowShow && (
                  <div
                    className={`arrow--container next ${
                      isLastIndex ? "disabeled" : ""
                    }`}
                    onClick={handelNextImage}
                  >
                    <div className="swiper--next d-f">
                      <BiChevronLeft />
                    </div>
                  </div>
                )}
                {isArrowShow && (
                  <div
                    className={`arrow--container prev ${
                      isFirstIndex ? "disabeled" : ""
                    }`}
                    onClick={handelPrevImage}
                  >
                    <div className="swiper--prev d-f">
                      <BiChevronRight />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
