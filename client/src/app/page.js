"use client";

import { useState } from "react";

const CATEGORIES = ["Bug", "Feature Request", "Improvement", "Other"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function FeedbackForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Bug",
    submitterName: "",
    submitterEmail: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message: '' }
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.length > 120) {
      newErrors.title = "Title cannot exceed 120 characters";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (form.submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitterEmail)) {
      newErrors.submitterEmail = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus({
        type: "success",
        message: "Thank you! Your feedback has been submitted successfully.",
      });

      // Reset form
      setForm({
        title: "",
        description: "",
        category: "Bug",
        submitterName: "",
        submitterEmail: "",
      });
      setErrors({});
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to submit feedback. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCounterClass = (length, max) => {
    if (length >= max) return "form__counter form__counter--limit";
    if (length >= max * 0.8) return "form__counter form__counter--warning";
    return "form__counter";
  };

  return (
    <div className="page">
      <header className="page__header">
        <span className="page__badge">FeedPulse</span>
        <h1 className="page__title">Share Your Feedback</h1>
        <p className="page__subtitle">
          Help us improve — report bugs, request features, or suggest improvements.
        </p>
      </header>

      <div className="card">
        {status && (
          <div className={`alert alert--${status.type}`}>
            <span className="alert__icon">
              {status.type === "success" ? "✓" : "✕"}
            </span>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form__group">
            <label className="form__label form__label--required" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className={`form__input ${errors.title ? "form__input--error" : ""}`}
              placeholder="Brief summary of your feedback"
              value={form.title}
              onChange={handleChange}
              maxLength={120}
            />
            <div className="form__meta">
              <span className="form__error">{errors.title || ""}</span>
              <span className={getCounterClass(form.title.length, 120)}>
                {form.title.length}/120
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="form__group">
            <label className="form__label form__label--required" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={`form__textarea ${errors.description ? "form__textarea--error" : ""}`}
              placeholder="Describe your feedback in detail (min 20 characters)..."
              value={form.description}
              onChange={handleChange}
              rows={5}
            />
            <div className="form__meta">
              <span className="form__error">{errors.description || ""}</span>
              <span className={form.description.length < 20 && form.description.length > 0
                ? "form__counter form__counter--warning"
                : "form__counter"
              }>
                {form.description.length}
                {form.description.length < 20 && form.description.length > 0
                  ? ` / 20 min`
                  : " chars"
                }
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="form__group">
            <label className="form__label form__label--required" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="form__select"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form__divider-label">Optional Info</div>

          {/* Name & Email */}
          <div className="form__row">
            <div className="form__group">
              <label className="form__label" htmlFor="submitterName">
                Your Name
              </label>
              <input
                id="submitterName"
                name="submitterName"
                type="text"
                className="form__input"
                placeholder="John Doe"
                value={form.submitterName}
                onChange={handleChange}
              />
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="submitterEmail">
                Your Email
              </label>
              <input
                id="submitterEmail"
                name="submitterEmail"
                type="email"
                className={`form__input ${errors.submitterEmail ? "form__input--error" : ""}`}
                placeholder="john@example.com"
                value={form.submitterEmail}
                onChange={handleChange}
              />
              {errors.submitterEmail && (
                <span className="form__error">{errors.submitterEmail}</span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`form__submit ${loading ? "form__submit--loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
