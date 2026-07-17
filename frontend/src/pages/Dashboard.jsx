import UploadBox from "../components/dashboard/UploadBox";

function Dashboard() {
  const handleUploadSuccess = () => {
    console.log("Upload successful");
  };

  return (
    <div className="dashboard">
      <h1>AI Research Assistant</h1>

      <UploadBox onUploadSuccess={handleUploadSuccess} />
    </div>
  );
}

export default Dashboard;