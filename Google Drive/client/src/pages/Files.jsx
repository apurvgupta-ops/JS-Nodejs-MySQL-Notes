import React, { useEffect, useState } from "react";
import Button from "../components/common/Button";

const Files = () => {
  const baseUrl = "http://192.168.1.2";
  const [data, setData] = useState([]);
  const [file, setFile] = useState();
  const handleData = async () => {
    const res = await fetch("http://192.168.1.2");
    const data = await res.json();
    setData(data);
    // console.log({ data });
  };

  const uploadData = async (file) => {
    const data = await fetch(baseUrl, {
      method: "POST",
      body: file,
      headers: {
        filename: file.name,
      },
    });

    const res = await data.json();
    console.log(res);
  };

  useEffect(() => {
    handleData();
  }, []);
  return (
    <div>
      <h1 className="text-xl mb-10">My Files</h1>
      {data.map((file, index) => (
        <div key={index} className="flex gap-5">
          {file}
          <Button
            title={"OPEN"}
            path={`${baseUrl}/${file}?action=open`}
            color="green"
          />
          <Button
            title={"DOWNLOAD"}
            path={`${baseUrl}/${file}?action=download`}
            color="red"
          />
        </div>
      ))}

      <input
        type="file"
        className="mt-10"
        onChange={(e) => uploadData(e.target.files[0])}
      />
    </div>
  );
};

export default Files;
