import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
    // Refresh statistics every 5 seconds
    const interval = setInterval(fetchStatistics, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/votes/statistics/');
      setStatistics(response.data);
    } catch (err) {
      setError('Failed to load statistics. Please try again.');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading analytics...</div>
      </>
    );
  }

  if (error || !statistics) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-message">{error || 'No statistics available'}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Voting Analytics Dashboard</h1>

        <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Total Votes</h3>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#007bff' }}>
              {statistics.total_votes}
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Last 24 Hours</h3>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#28a745' }}>
              {statistics.recent_votes.last_24_hours}
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '10px', color: '#333' }}>Last 7 Days</h3>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ffc107' }}>
              {statistics.recent_votes.last_7_days}
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Vote Distribution by Candidate</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={statistics.candidate_statistics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="candidate_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vote_count" fill="#007bff" name="Votes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Vote Percentage by Candidate</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={statistics.candidate_statistics}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ candidate_name, percentage }) => `${candidate_name}: ${percentage}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="vote_count"
              >
                {statistics.candidate_statistics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Detailed Statistics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            {statistics.candidate_statistics.map((stat, index) => (
              <div key={stat.candidate_id} style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '10px', color: '#333' }}>{stat.candidate_name}</h4>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS[index % COLORS.length] }}>
                  {stat.vote_count} votes
                </div>
                <div style={{ color: '#666', marginTop: '5px' }}>
                  {stat.percentage}% of total
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;

