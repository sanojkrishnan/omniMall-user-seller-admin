import imageCompression from "browser-image-compression";

export const handleImage = async (file, type = "product") => {
  try {
    const image = new Image();
    const imageURL = URL.createObjectURL(file);
    image.src = imageURL;

    await new Promise((resolve) => (image.onload = resolve));
    URL.revokeObjectURL(imageURL);

    // aspect ratio based on type
    let aspectRatio;
    if (type === "profile") {
      aspectRatio = 1 / 1; // square
    } else {
      aspectRatio = 4 / 3; // landscape
    }

    let cropWidth = image.width;
    let cropHeight = image.width / aspectRatio;

    if (cropHeight > image.height) {
      cropHeight = image.height;
      cropWidth = image.height * aspectRatio;
    }

    const cropX = (image.width - cropWidth) / 2;
    const cropY = (image.height - cropHeight) / 2;

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

    const croppedFile = await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.9,
      );
    });

    const compressed = await imageCompression(croppedFile, {
      maxSizeMB: 2,
      maxWidthOrHeight: type === "profile" ? 512 : 1024, // smaller for profile
      useWebWorker: true,
    });

    return compressed;
  } catch (error) {
    console.error("Image compression failed:", error);
    return file;
  }
};
