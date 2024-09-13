export function compressBase64Image(base64Image: string, targetSize?: number) {
  const img = new Image();
  img.src = base64Image;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      let quality = 0.9;
      let compressedDataURL;
      if (!targetSize) {
        compressedDataURL = canvas.toDataURL("image/jpeg", 0.8);
        return resolve(compressedDataURL);
      }
      while (true) {
        compressedDataURL = canvas.toDataURL("image/jpeg", quality);
        if (atob(compressedDataURL.split(",")[1]).length <= targetSize * 1024) {
          break;
        }
        quality -= 0.1;
      }
      resolve(compressedDataURL);
    };
    img.onerror = (error) => reject(error);
  });
}
