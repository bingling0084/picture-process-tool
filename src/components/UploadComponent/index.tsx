import React, { useState, useMemo } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { GetProp, UploadProps, UploadFile } from "antd";
import { Button, Image, Upload, Input, Select } from "antd";
import { compressBase64Image } from "./process";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const { Option } = Select;
const { Dragger } = Upload;

type SelectProps = {
  value: "KB" | "MB";
  onChange: (val: "KB" | "MB") => void;
};
const SelectSize = (props: SelectProps) => {
  const { value, onChange } = props;
  return (
    <Select defaultValue="KB" value={value} onChange={onChange}>
      <Option value="KB">KB</Option>
      <Option value="MB">MB</Option>
    </Select>
  );
};

const UploadComponent: React.FC = () => {
  const [fileList, setFileList] = useState<any>([]);
  const [inputCompressNum, setInputCompressNum] = useState<number>();
  const [unit, setUnit] = useState<"KB" | "MB">("KB");
  const [previewImage, setPreviewImage] = useState("");
  const [downloadFile, setDownloadFile] = useState();

  const realTargetSize = useMemo(() => {
    if (unit === "KB") {
      return (inputCompressNum || 0) * 1024;
    }

    return (inputCompressNum || 0) * 1024 * 1024;
  }, [inputCompressNum, unit]);

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
      compressBase64Image(previewUrl, realTargetSize).then((file: any) => {
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
      <div style={{ width: "300px" }}>
        <Input
          type="number"
          addonAfter={<SelectSize value={unit} onChange={setUnit} />}
          value={inputCompressNum}
          onChange={(e) => setInputCompressNum(Number(e.target.value))}
        ></Input>
        <Button onClick={handleCompress} disabled={fileList?.length}>
          压缩
        </Button>
      </div>

      {/* <Button onClick={handleDownload}>下载</Button> */}
    </>
  );
};

export default UploadComponent;

/**
 * 邮件模板
 * 预览、导入、导出
 * str api
 */
