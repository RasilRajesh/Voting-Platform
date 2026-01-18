import React, { useState, useEffect } from 'react';

const CandidateModal = ({ isOpen, onClose, onSave, candidate = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    team_id: '',
    description: '',
    linkedin_url: '',
    photo: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        team_id: candidate.team_id || '',
        description: candidate.description || '',
        linkedin_url: candidate.linkedin_url || '',
        photo: candidate.photo || ''
      });
    } else {
      setFormData({
        name: '',
        team_id: '',
        description: '',
        linkedin_url: '',
        photo: ''
      });
    }
    setErrors({});
  }, [candidate, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.team_id) newErrors.team_id = 'Team ID is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving candidate:', error);
      setErrors({ submit: 'Failed to save candidate. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
          {candidate ? 'Edit Candidate' : 'Add New Candidate'}
        </h2>

        {errors.submit && (
          <div style={{
            background: '#fee',
            color: '#c00',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter candidate name"
              style={{ borderColor: errors.name ? '#dc3545' : '#dee2e6' }}
            />
            {errors.name && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="team_id">Team ID *</label>
            <input
              type="number"
              id="team_id"
              name="team_id"
              value={formData.team_id}
              onChange={handleChange}
              placeholder="Enter team ID (e.g., 1, 2, 3)"
              style={{ borderColor: errors.team_id ? '#dc3545' : '#dee2e6' }}
            />
            {errors.team_id && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.team_id}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter candidate description"
              rows="4"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin_url">LinkedIn URL</label>
            <input
              type="url"
              id="linkedin_url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="photo">Photo URL</label>
            <input
              type="url"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Enter a direct image URL
            </small>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'flex-end',
            marginTop: '30px' 
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn"
              style={{ background: '#6c757d', color: 'white' }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (candidate ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateModal;
