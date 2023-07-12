import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobListPage = ({ onLogout }) => {
  const [jobs, setJobs] = useState([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [fullTime, setFullTime] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [description, location, fullTime, page]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/jobs', {
        params: { description, location, full_time: fullTime, page },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setJobs(response.data || []); // Handle null response
    } catch (error) {
      console.error('Error fetching job list:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleReset = () => {
    setDescription('');
    setLocation('');
    setFullTime(false);
    setPage(1);
    fetchJobs();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <div className="container">
  <h2>Job List</h2>
  <button type="button" className="btn btn-danger mt-3" onClick={handleLogout}>
    Logout
  </button>

  <div className="row mt-4">
    <div className="col-md-12">
      <form onSubmit={handleSearch} className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              className="form-control"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-2 mt-4">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="fullTime"
              checked={fullTime}
              onChange={(e) => setFullTime(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="fullTime">
              Full-time only
            </label>
          </div>
        </div>
        <div className="col-md-2 mt-4">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" className="btn btn-secondary ml-2" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  </div>

  {jobs && jobs.length > 0 ? (
  <>
    <h3 className="mt-4">Jobs:</h3>
    <ul className="list-group">
      {jobs.map((job) => (
        <li key={job.id} className="list-group-item">
          <div className="row">
            <div className="col-md-10">
              <h4>{job.title}</h4>
              <p>{job.company} {job.type}</p>
            </div>
            <div className="col-md-2">
              <p>{job.location}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </>
) : (
  <p>No jobs found</p>
)}

</div>
  );
};

export default JobListPage;
