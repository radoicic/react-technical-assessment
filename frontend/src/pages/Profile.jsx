import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api.js";
import ErrorMessage from "../components/ErrorMessage.jsx";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const populateForm = (user) => {
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      street: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      zipCode: user.address?.zipCode || "",
      country: user.address?.country || "",
    });
  };

  const loadProfile = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await getProfile();
      const user = response.data.data;
      setProfile(user);
      populateForm(user);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to load profile. Please try again later.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
      };
      const response = await updateProfile(payload);
      setProfile(response.data.data);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to update profile. Please try again.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="page">
        <p className="status-text">Loading profile…</p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="page">
        <ErrorMessage
          message={error || "Profile not found."}
          onRetry={loadProfile}
        />
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>Your profile</h1>
        <p className="page-subtitle">
          Manage your personal details used across the marketplace.
        </p>
      </header>

      <div className="profile-layout">
        <div className="profile-summary">
          <h2 className="profile-name">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="profile-email">{profile.email}</p>
          {profile.role && (
            <p className="profile-role">
              Role: <span>{profile.role}</span>
            </p>
          )}
        </div>
        <form className="profile-form" onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} />}
          {success && <p className="status-text">{success}</p>}

          <div className="profile-grid">
            <label className="form-field">
              <span>First name</span>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
            </label>
            <label className="form-field">
              <span>Last name</span>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </label>
            <label className="form-field">
              <span>Phone</span>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
          </div>

          <h3 className="profile-section-heading">Address</h3>
          <div className="profile-grid">
            <label className="form-field form-field-full">
              <span>Street</span>
              <input
                name="street"
                value={form.street}
                onChange={handleChange}
              />
            </label>
            <label className="form-field">
              <span>City</span>
              <input name="city" value={form.city} onChange={handleChange} />
            </label>
            <label className="form-field">
              <span>State</span>
              <input name="state" value={form.state} onChange={handleChange} />
            </label>
            <label className="form-field">
              <span>ZIP code</span>
              <input
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
              />
            </label>
            <label className="form-field">
              <span>Country</span>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="profile-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Profile;
