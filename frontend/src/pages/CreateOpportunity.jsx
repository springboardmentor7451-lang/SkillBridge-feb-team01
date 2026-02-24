import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateOpportunity.css';

const initialFormData = {
  title: '',
  description: '',
  location: '',
  date: '',
};

const validateField = (name, value) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'This field is required.';
  }

  if (name === 'title' && trimmed.length < 3) {
    return 'Title must be at least 3 characters.';
  }

  if (name === 'description' && trimmed.length < 20) {
    return 'Description must be at least 20 characters.';
  }

  return '';
};

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const redirectRef = useRef(null);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isFormValid = useMemo(() => {
    const requiredValid = Object.entries(formData).every(([, value]) => value.trim() !== '');
    const hasErrors = Object.values(errors).some(Boolean);
    return requiredValid && !hasErrors;
  }, [formData, errors]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (redirectRef.current) clearTimeout(redirectRef.current);
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateAll = () => {
    const nextErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      nextErrors[name] = validateField(name, value);
    });
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateAll();
    setErrors(nextErrors);
    setTouched({
      title: true,
      description: true,
      location: true,
      date: true,
    });

    const hasValidationErrors = Object.values(nextErrors).some(Boolean);
    if (hasValidationErrors) return;

    setIsSubmitting(true);
    setSuccessMessage('');

    timeoutRef.current = setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Opportunity created successfully. Redirecting...');

      redirectRef.current = setTimeout(() => {
        navigate('/manage-opportunities');
      }, 900);
    }, 1300);
  };

  return (
    <div className="create-opportunity-page">
      <div className="create-opportunity-card">
        <h1>Create Opportunity</h1>
        <p className="create-opportunity-subtitle">
          Add a new volunteering opportunity for skilled contributors.
        </p>

        {successMessage && <div className="co-alert co-alert-success">{successMessage}</div>}

        <form className="create-opportunity-form" onSubmit={handleSubmit} noValidate>
          <div className="co-form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Example: Weekend Math Mentor"
              className={touched.title && errors.title ? 'has-error' : ''}
            />
            {touched.title && errors.title && <p className="co-error">{errors.title}</p>}
          </div>

          <div className="co-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describe responsibilities, required skills, and impact..."
              className={touched.description && errors.description ? 'has-error' : ''}
              rows={5}
            />
            {touched.description && errors.description && <p className="co-error">{errors.description}</p>}
          </div>

          <div className="co-form-row">
            <div className="co-form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="City or Remote"
                className={touched.location && errors.location ? 'has-error' : ''}
              />
              {touched.location && errors.location && <p className="co-error">{errors.location}</p>}
            </div>

            <div className="co-form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.date && errors.date ? 'has-error' : ''}
              />
              {touched.date && errors.date && <p className="co-error">{errors.date}</p>}
            </div>
          </div>

          <button type="submit" className="co-submit-btn" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? 'Creating Opportunity...' : 'Create Opportunity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunity;
