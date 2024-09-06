export function compressBase64Image(base64Image: string, quality = 0.8) {
  const img = new Image();
  img.src = base64Image;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const compressedDataURL = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataURL);
    };
    img.onerror = (error) => reject(error);
  });
}
