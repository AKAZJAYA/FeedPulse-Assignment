"use client";

import { useState, useEffect, useCallback } from "react";
import "./admin.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const CATEGORIES = ["All", "Bug", "Feature Request", "Improvement", "Other"];
const STATUSES = ["All", "New", "In Review", "Resolved"];

export default function AdminDashboard() {
    const [token, setToken] = useState(null);
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [loginError, setLoginError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");

    // Check for saved token on mount
    useEffect(() => {
        const saved = localStorage.getItem("feedpulse_token");
        if (saved) setToken(saved);
    }, []);

    // ─── Login ──────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        setLoginLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginForm),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("feedpulse_token", data.data.token);
            setToken(data.data.token);
        } catch (err) {
            setLoginError(err.message);
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("feedpulse_token");
        setToken(null);
    };

    // ─── Fetch Feedbacks ────────────────────────────
    const fetchFeedbacks = useCallback(async () => {
        if (!token) return;
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/feedback`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    handleLogout();
                    return;
                }
                throw new Error(data.message);
            }

            setFeedbacks(data.data || []);
        } catch (err) {
            console.error("Failed to fetch feedbacks:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);

    // ─── Update Status ──────────────────────────────
    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/feedback/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Update failed");

            setFeedbacks((prev) =>
                prev.map((f) => (f._id === id ? { ...f, status: newStatus } : f))
            );
        } catch (err) {
            console.error("Status update error:", err);
            alert("Failed to update status");
        }
    };

    // ─── Filters ────────────────────────────────────
    const filtered = feedbacks.filter((f) => {
        if (filterCategory !== "All" && f.category !== filterCategory) return false;
        if (filterStatus !== "All" && f.status !== filterStatus) return false;
        return true;
    });

    // ─── Stats ──────────────────────────────────────
    const stats = {
        total: feedbacks.length,
        new: feedbacks.filter((f) => f.status === "New").length,
        inReview: feedbacks.filter((f) => f.status === "In Review").length,
        resolved: feedbacks.filter((f) => f.status === "Resolved").length,
    };

    // ─── Helpers ────────────────────────────────────
    const getStatusClass = (status) => {
        const map = { New: "new", "In Review": "in-review", Resolved: "resolved" };
        return map[status] || "new";
    };

    const getSentimentClass = (s) => {
        const map = { Positive: "positive", Neutral: "neutral", Negative: "negative" };
        return map[s] || "neutral";
    };

    const getPriorityInfo = (score) => {
        if (!score) return { cls: "low", percent: 0 };
        if (score <= 3) return { cls: "low", percent: score * 10 };
        if (score <= 6) return { cls: "medium", percent: score * 10 };
        return { cls: "high", percent: score * 10 };
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    // ─── Login Gate ─────────────────────────────────
    if (!token) {
        return (
            <div className="login-gate">
                <div className="login-card">
                    <h1 className="login-card__title">Admin Login</h1>
                    <p className="login-card__subtitle">Sign in to manage feedback</p>

                    {loginError && (
                        <div className="alert alert--error">
                            <span className="alert__icon">✕</span>
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form__group">
                            <label className="form__label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form__input"
                                placeholder="admin@feedpulse.com"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form__group">
                            <label className="form__label" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form__input"
                                placeholder="Enter password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`form__submit ${loginLoading ? "form__submit--loading" : ""}`}
                            disabled={loginLoading}
                        >
                            {loginLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ─── Dashboard ──────────────────────────────────
    return (
        <div className="dashboard">
            {/* Top Bar */}
            <div className="dashboard__topbar">
                <div className="dashboard__brand">
                    <span className="dashboard__logo">FeedPulse</span>
                    <span className="dashboard__role">Admin</span>
                </div>
                <button className="dashboard__logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Stats */}
            <div className="stats">
                <div className="stat-card">
                    <div className="stat-card__label">Total Feedback</div>
                    <div className="stat-card__value">{stats.total}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__label">New</div>
                    <div className="stat-card__value stat-card__value--accent">{stats.new}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__label">In Review</div>
                    <div className="stat-card__value stat-card__value--warning">{stats.inReview}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__label">Resolved</div>
                    <div className="stat-card__value stat-card__value--success">{stats.resolved}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters">
                <select
                    className="filters__select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {c === "All" ? "All Categories" : c}
                        </option>
                    ))}
                </select>

                <select
                    className="filters__select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s === "All" ? "All Statuses" : s}
                        </option>
                    ))}
                </select>

                <span className="filters__count">
                    Showing {filtered.length} of {feedbacks.length}
                </span>
            </div>

            {/* Table */}
            <div className="table-wrapper">
                {loading ? (
                    <div className="loading">
                        <div className="loading__spinner" />
                        Loading feedbacks...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">📭</div>
                        <div className="empty-state__text">No feedback found</div>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Sentiment</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((fb) => {
                                const priority = getPriorityInfo(fb.ai_priority);
                                return (
                                    <tr key={fb._id}>
                                        <td>
                                            <div className="table__title">{fb.title}</div>
                                        </td>
                                        <td>{fb.category || "—"}</td>
                                        <td>
                                            {fb.ai_sentiment ? (
                                                <span className={`badge badge--${getSentimentClass(fb.ai_sentiment)}`}>
                                                    {fb.ai_sentiment}
                                                </span>
                                            ) : (
                                                <span style={{ color: "var(--text-muted)" }}>—</span>
                                            )}
                                        </td>
                                        <td>
                                            {fb.ai_priority ? (
                                                <div className="priority">
                                                    <div className="priority__bar">
                                                        <div
                                                            className={`priority__fill priority__fill--${priority.cls}`}
                                                            style={{ width: `${priority.percent}%` }}
                                                        />
                                                    </div>
                                                    <span className="priority__text">{fb.ai_priority}</span>
                                                </div>
                                            ) : (
                                                <span style={{ color: "var(--text-muted)" }}>—</span>
                                            )}
                                        </td>
                                        <td>
                                            <select
                                                className={`status-select status-select--${getStatusClass(fb.status)}`}
                                                value={fb.status}
                                                onChange={(e) => updateStatus(fb._id, e.target.value)}
                                            >
                                                <option value="New">New</option>
                                                <option value="In Review">In Review</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span className="table__date">{formatDate(fb.createdAt)}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
