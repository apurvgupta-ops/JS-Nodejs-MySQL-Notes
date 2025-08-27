import "./App.css";

function App() {
  const handleFileUpload = async (e) => {
    await fetch(
      "https://procodrr-storage-app.s3.ap-south-1.amazonaws.com/hello-world-2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWMFUPOZ3I2EEYSWN%2F20250814%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250814T155916Z&X-Amz-Expires=3600&X-Amz-Signature=a6211e09f3473c41b442d422811c77550b837c61a45676fa33857b4f332ce993&X-Amz-SignedHeaders=content-type%3Bhost&x-amz-checksum-crc32=AAAAAA%3D%3D&x-amz-sdk-checksum-algorithm=CRC32&x-id=PutObject",
      {
        method: "PUT",
        body: e.target.files[0],
      }
    );
    console.log("File uploaded");
  };
  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}

export default App;
