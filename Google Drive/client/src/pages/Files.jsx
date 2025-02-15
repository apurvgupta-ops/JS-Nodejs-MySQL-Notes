import React, { useEffect, useState } from "react";
import Button from "../components/common/Button";

const Files = () => {
  const baseUrl = "http://192.168.1.2";
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newFileName, setNewFileName] = useState("");

  const handleData = async () => {
    const res = await fetch("http://192.168.1.2");
    const data = await res.json();
    setData(data);
    // console.log({ data });
  };

  const uploadData = async (file) => {
    // using xhr , becuase it has upload progress and download progress funtionality
    const xhr = new XMLHttpRequest();
    xhr.open("POST", baseUrl, true); // true for async req
    xhr.setRequestHeader("filename", file.name);
    xhr.addEventListener("load", () => {
      handleData();
    });
    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = (e.loaded / e.total) * 100;
      setProgress(totalProgress.toFixed());
    });
    xhr.send(file);
  };

  const handleDelete = async (file) => {
    const res = await fetch("http://192.168.1.2", {
      method: "DELETE",
      body: file,
    });
    const data = await res.text();
    console.log(data);
    handleData();
  };

  const handleRename = async (oldFileName) => {
    console.log({ oldFileName, newFileName });
    const res = await fetch("http://192.168.1.2", {
      method: "PATCH",
      body: JSON.stringify({ oldFileName, newFileName }),
    });
    const data = await res.text();
    console.log(data);
    setNewFileName("");
    handleData();
  };

  useEffect(() => {
    handleData();
  }, []);
  return (
    <div>
      <h1 className="text-xl mb-10">My Files</h1>
      <input
        type="text"
        onChange={(e) => setNewFileName(e.target.value)}
        value={newFileName}
        placeholder="Enter new file name"
        className="border"
      />
      {data.map((file, index) => (
        <div key={index} className="flex gap-5">
          {file}
          <Button
            title={"OPEN"}
            path={`${baseUrl}/${file}?action=open`}
            color="red"
          />
          <Button
            title={"DOWNLOAD"}
            path={`${baseUrl}/${file}?action=download`}
            color="red"
          />
          <button onClick={(e) => handleDelete(file)}>DELETE</button>
          {/* {newFileName === file ? (
            <button onClick={(e) => handleRename(file)}>SAVE</button>
          ) : (
            <button onClick={(e) => setNewFileName(file)}>RENAME</button>
          )} */}
          <button onClick={(e) => setNewFileName(file)}>RENAME</button>

          <button onClick={(e) => handleRename(file)}>SAVE</button>
        </div>
      ))}
      <input
        type="file"
        className="mt-10"
        onChange={(e) => uploadData(e.target.files[0])}
      />
      Progress : {progress}%
    </div>
  );
};

export default Files;
