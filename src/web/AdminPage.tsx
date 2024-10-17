import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface FunnelDataEntry {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  lowerBound: number;
  upperBound: number;
  dueDate: string;
  specificDate: string;
  uploadedImages: string[];
  timestamp: string;
}

const AdminPage: React.FC = () => {
  const [funnelData, setFunnelData] = useState<FunnelDataEntry[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('funnelData') || '[]');
    const sortedData = savedData.sort((a: FunnelDataEntry, b: FunnelDataEntry) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setFunnelData(sortedData);
  }, []);

  const handleLogin = () => {
    if (password === 'admin123') { // Replace with a secure authentication method in a real application
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const openImageModal = (images: string[]) => {
    setSelectedImages(images);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImages([]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate('/')}>Back to Home</button>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Budget Range</th>
            <th>Due Date</th>
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {funnelData.map((entry) => (
            <tr key={entry.id}>
              <td>{formatDate(entry.timestamp)}</td>
              <td>{`${entry.firstName} ${entry.lastName}`}</td>
              <td>{entry.phoneNumber}</td>
              <td>{`₪${entry.lowerBound} - ₪${entry.upperBound}`}</td>
              <td>{entry.dueDate === 'specific' ? entry.specificDate : entry.dueDate}</td>
              <td>
                <button onClick={() => openImageModal(entry.uploadedImages)}>
                  View {entry.uploadedImages.length} image(s)
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showImageModal && (
        <div className="image-modal">
          <div className="modal-content">
            <span className="close" onClick={closeImageModal}>&times;</span>
            {selectedImages.map((image, index) => (
              <img key={index} src={image} alt={`Uploaded ${index + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;