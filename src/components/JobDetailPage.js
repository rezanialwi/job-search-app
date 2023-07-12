import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Link, useParams } from 'react-router-dom';

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

const JobDetailPage = ({ match, onLogout }) => {
  const [job, setJob] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchJob(id);
  }, [id]);

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
    <div>
    <Header onLogout={onLogout} />
    <div className="container mt-4">
    <Link to="/jobs" className="btn btn-primary mb-4">Back</Link>
      {job ? (
        <div className="row">
          <div className="col-md-8">
            <h2>{job.title}</h2>
            <p>{job.company} - {job.type}</p>
            <p style={{ color: '#888', fontSize: '12px' }}>{formatDistanceToNow(new Date(job.created_at))} ago</p>
            <hr></hr>
            <div dangerouslySetInnerHTML={{ __html: job.description }}></div>
          </div>
          <div className="col-md-4">
            {job.company_logo && (
              <img src={job.company_logo} alt={job.company} className="img-fluid" />
            )}
            <br></br>
             <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn btn-success float-right">Apply Now</a>
          </div>
        </div>
      ) : (
        <p>Loading job details...</p>
      )}
    </div>
    </div>
  );
};


export default JobDetailPage;
