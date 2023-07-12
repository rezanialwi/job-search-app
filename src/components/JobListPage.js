import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Github Jobs</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <button type="button" className="btn btn-danger ml-auto" onClick={handleLogout} style={{ marginLeft: '983px' }}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

const JobDetailPage = ({ match }) => {
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJob(match.params.id);
  }, [match.params.id]);

  const fetchJob = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  return (
    <div className="container mt-4">
      {job ? (
        <div>
          <h2>{job.title}</h2>
          <p>{job.company} - {job.type}</p>
          <p style={{ color: '#888', fontSize: '12px' }}>{formatDistanceToNow(new Date(job.created_at))} ago</p>
          <div dangerouslySetInnerHTML={{ __html: job.description }}></div>
          <a href={job.url} target="_blank" rel="noopener noreferrer">Apply Now</a>
        </div>
      ) : (
        <p>Loading job details...</p>
      )}
    </div>
  );
};

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
        params: {
          description: description.trim(),
          location: location.trim(),
          full_time: fullTime,
          page
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching job list:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (description.trim() !== '' || location.trim() !== '' || fullTime) {
      setPage(1);
      fetchJobs();
    }
  };

  const handleReset = () => {
    setDescription('');
    setLocation('');
    setFullTime(false);
    setPage(1);
    fetchJobs();
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <div>
      <Header onLogout={onLogout} />

      <div className="container mt-4">
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

    {jobs && jobs.length > 0 ? (
      <>
        <h3 className="mt-4">Jobs List</h3>
        <ul className="list-group">
          {jobs.map((job) =>
            job ? (
              <li key={job.id} className="list-group-item">
                <div className="row">
                  <div className="col-md-10">
                    <Link to={`/jobs/${job.id}`} style={{ color: '#000' }}>
                      <h4>{job.title}</h4>
                    </Link>
                    <p style={{ color: '#888', fontSize: '12px' }}>
                      {job.company} - {job.type}
                    </p>
                  </div>
                  <div className="col-md-2">
                    <p style={{ color: '#888', fontSize: '18px' }}>{job.location}</p>
                    <p style={{ color: '#888', fontSize: '12px' }}>
                      {formatDistanceToNow(new Date(job.created_at))} ago
                    </p>
                  </div>
                </div>
              </li>
            ) : null
          )}
        </ul>
         {/* Pagination */}
         <div className="d-flex justify-content-center mt-4">
              <button
                type="button"
                className="btn btn-primary mr-2"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNextPage}
              >
                Next
              </button>
            </div>
      </>
    ) : (
      <p>No jobs found</p>
    )}

      </div>
    </div>
  );
};

export default JobListPage;
