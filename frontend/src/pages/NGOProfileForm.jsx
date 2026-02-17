import { useState } from 'react';
import './NGOProfileForm.css';

function NGOProfileForm() {
  const [formData, setFormData] = useState({
    organizationName: '',
    description: '',
    websiteUrl: '',
    location: '',
    shortBio: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Organization Name validation
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    } else if (formData.organizationName.trim().length < 3) {
      newErrors.organizationName = 'Organization name must be at least 3 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    // Website URL validation
    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required';
    } else {
      try {
        const url = new URL(formData.websiteUrl);
        // Ensure it has http/https protocol
        if (!url.protocol.startsWith('http')) {
          newErrors.websiteUrl = 'Please enter a valid URL';
        }
      } catch {
        newErrors.websiteUrl = 'Please enter a valid URL';
      }
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Success - log data and clear form
    console.log('NGO Profile Form Submitted:', formData);
    
    setFormData({
      organizationName: '',
      description: '',
      websiteUrl: '',
      location: '',
      shortBio: ''
    });
    setErrors({});
  };

  return (
    <div className="page-wrapper">
      <div className="ngo-profile-form-container">
        <h1 className="form-heading">NGO Profile Registration</h1>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="organizationName" className="form-label">
            Organization Name
          </label>
          <input
            type="text"
            id="organizationName"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleInputChange}
            className="form-input"
          />
          {errors.organizationName && (
            <div className="error-message">{errors.organizationName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Organization Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-textarea"
            rows="4"
          />
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="websiteUrl" className="form-label">
            Website URL
          </label>
          <input
            type="text"
            id="websiteUrl"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleInputChange}
            className="form-input"
          />
          {errors.websiteUrl && (
            <div className="error-message">{errors.websiteUrl}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="form-input"
          />
          {errors.location && (
            <div className="error-message">{errors.location}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="shortBio" className="form-label">
            Short Bio
          </label>
          <textarea
            id="shortBio"
            name="shortBio"
            value={formData.shortBio}
            onChange={handleInputChange}
            className="form-textarea"
            rows="3"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Profile
        </button>
      </form>
    </div>
    </div>
  );
}

export default NGOProfileForm;
