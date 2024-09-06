import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { GetProp, UploadProps, UploadFile } from "antd";
import { Button, Image, Upload } from "antd";
import { compressBase64Image } from "./process";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const { Dragger } = Upload;

const UploadComponent: React.FC = () => {
  const [fileList, setFileList] = useState<any>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [downloadFile, setDownloadFile] = useState();

  const handleChange: UploadProps["onChange"] = (info) => {
    console.log(info);
    setFileList(info.fileList);
  };

  const props: UploadProps = {
    name: "file",
    // action: '',
    onChange: handleChange,
    multiple: false,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleCompress = async () => {
    fileList.forEach(async (file: any) => {
      const previewUrl = await getBase64(file.originFileObj as FileType);
      compressBase64Image(previewUrl).then((file: any) => {
        // const blob = new Blob([file], { type: "image/jpeg" });
        // const link = document.createElement("a");
        // link.href = URL.createObjectURL(blob);
        // link.download = blob.name;
        // link.click();
        // URL.revokeObjectURL(link.href);
        const a = document.createElement("a");
        a.href = file;
        a.setAttribute("download", "chart-download");
        a.click();
      });
    });
  };

  const handleDownload = () => {
    fileList.forEach(async (file: any) => {
      // const blob = new Blob([file.originFileObj], { type: file.type });
      // const link = document.createElement("a");
      // link.href = URL.createObjectURL(blob);
      // link.download = file.name;
      // link.click();
      // URL.revokeObjectURL(link.href);
    });
  };

  return (
    <>
      <Dragger {...props} fileList={fileList} listType="picture-circle">
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
      <Button onClick={handleCompress}>压缩</Button>
      {/* <Button onClick={handleDownload}>下载</Button> */}
    </>
  );
};

export default UploadComponent;
