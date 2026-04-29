import imageCompression from "browser-image-compression";

export const handleImage = async (file) => {
  try {
    //  load image
    const image = new Image();
    const imageURL = URL.createObjectURL(file);
    image.src = imageURL;

    await new Promise((resolve) => (image.onload = resolve));

    //  define rectangle ratio (example: 4:3)
    const aspectRatio = 1 / 1;

    let cropWidth = image.width;
    let cropHeight = image.width / aspectRatio;

    // if height is smaller, adjust
    if (cropHeight > image.height) {
      cropHeight = image.height;
      cropWidth = image.height * aspectRatio;
    }

    // center crop
    const cropX = (image.width - cropWidth) / 2;
    const cropY = (image.height - cropHeight) / 2;

    //  draw on canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    //  convert to file
    const croppedFile = await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.9,
      );
    });

    // compress (max 2MB)
    const compressed = await imageCompression(croppedFile, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });

    return compressed;
  } catch (error) {
    console.error("Image compression failed:", error);
    return file;
  }
};
