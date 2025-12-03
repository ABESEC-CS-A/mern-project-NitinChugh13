// src/Pages/Settings.jsx
import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../Components/Sidebar";
import Nav from "../Components/Nav";
import axios from "axios";
import { authDataContext } from "../Context/AuthContext";

/**
 * Settings page
 *
 * Backend endpoints used (attempts, falls back if not found):
 * - Profile GET:  GET {serverUrl}/api/user/me  OR  {serverUrl}/api/auth/me
 * - Profile PATCH: PATCH {serverUrl}/api/user/update  OR  {serverUrl}/api/auth/update
 * - Password change: PATCH {serverUrl}/api/auth/update-password  OR  {serverUrl}/api/user/update-password
 * - Site settings GET:  GET {serverUrl}/api/settings  (optional)
 * - Site settings PATCH: PATCH {serverUrl}/api/settings  (optional)
 *
 * The UI will show user-friendly errors if endpoints are absent.
 */

export default function Settings() {
  const { serverUrl } = useContext(authDataContext);

  // sidebar control (same pattern)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarCollapsed(true);
  }, []);

  // profile
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileMsg, setProfileMsg] = useState("");

  // password
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdError, setPwdError] = useState("");

  // site settings (optional endpoint)
  const [settings, setSettings] = useState({ siteName: "", contactEmail: "", supportPhone: "" });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // generic UI state
  const [loadingAny, setLoadingAny] = useState(false);

  // Helper: try list of endpoints for GET profile
  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError("");
    try {
      const candidates = ["/api/user/me", "/api/auth/me", "/api/user/profile", "/api/auth/profile"];
      let data = null;
      for (const p of candidates) {
        try {
          const res = await axios.get(`${serverUrl}${p}`, { withCredentials: true });
          // try common payload layouts
          data = res.data?.user ?? res.data?.profile ?? res.data;
          if (data) break;
        } catch (e) {
          // ignore individual candidate error and try next
        }
      }
      if (!data) throw new Error("No profile endpoint responded successfully.");
      setProfile({
        name: data.name ?? data.fullName ?? data.username ?? "",
        email: data.email ?? "",
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
      setProfileError(
        err.response?.data?.message ||
          err.message ||
          "Unable to fetch profile. Check backend endpoints."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Helper: update profile
  const updateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    setLoadingAny(true);

    try {
      const candidates = ["/api/user/update", "/api/auth/update", "/api/user", "/api/auth/update-profile"];
      let ok = false;
      let lastErr = null;
      for (const p of candidates) {
        try {
          const res = await axios.patch(`${serverUrl}${p}`, profile, { withCredentials: true });
          // if success, use returned data if any
          const returned = res.data?.user ?? res.data?.profile ?? res.data;
          if (returned) setProfile({ name: returned.name ?? profile.name, email: returned.email ?? profile.email });
          ok = true;
          break;
        } catch (e) {
          lastErr = e;
        }
      }
      if (!ok) {
        throw lastErr || new Error("No update endpoint available.");
      }
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      setProfileError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoadingAny(false);
      setTimeout(() => setProfileMsg(""), 3000);
    }
  };

  // Change password
  const changePassword = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    setPwdError("");

    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError("Please fill all fields.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("New password and confirm password do not match.");
      return;
    }

    setPwdLoading(true);
    try {
      const candidates = ["/api/auth/update-password", "/api/user/update-password", "/api/auth/password", "/api/user/password"];
      let ok = false;
      let lastErr = null;
      for (const p of candidates) {
        try {
          const res = await axios.patch(`${serverUrl}${p}`, { currentPassword: currentPwd, newPassword: newPwd }, { withCredentials: true });
          ok = true;
          break;
        } catch (e) {
          lastErr = e;
        }
      }
      if (!ok) throw lastErr || new Error("No password endpoint available.");
      setPwdMsg("Password changed successfully.");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err) {
      console.error("Password change error:", err);
      setPwdError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPwdLoading(false);
      setTimeout(() => setPwdMsg(""), 4000);
    }
  };

  // Fetch site settings (optional)
  const fetchSettings = async () => {
    setSettingsLoading(true);
    setSettingsError("");
    try {
      const res = await axios.get(`${serverUrl}/api/settings`, { withCredentials: true });
      // expected res.data.settings or res.data
      const s = res.data?.settings ?? res.data;
      if (s) {
        setSettings({
          siteName: s.siteName ?? s.name ?? "",
          contactEmail: s.contactEmail ?? s.email ?? "",
          supportPhone: s.supportPhone ?? s.phone ?? "",
        });
      }
    } catch (err) {
      // it's OK if this endpoint doesn't exist; show a subtle message
      setSettingsError("Site settings not available on server.");
    } finally {
      setSettingsLoading(false);
    }
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    setSettingsMsg("");
    setSettingsError("");
    setLoadingAny(true);
    try {
      const res = await axios.patch(`${serverUrl}/api/settings`, settings, { withCredentials: true });
      setSettingsMsg("Site settings updated.");
    } catch (err) {
      console.error("Settings update:", err);
      setSettingsError(err.response?.data?.message || "Failed to update site settings.");
    } finally {
      setLoadingAny(false);
      setTimeout(() => setSettingsMsg(""), 3000);
    }
  };

  // Theme toggle (frontend UI only)
  const [theme, setTheme] = useState(() => localStorage.getItem("admin-theme") || "dark");
  useEffect(() => {
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  // Initial load
  useEffect(() => {
    if (serverUrl) {
      fetchProfile();
      fetchSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverUrl]);

  return (
    <div className="w-full min-h-screen bg-[white] text-black overflow-x-hidden relative flex">
      <Sidebar collapsedProp={sidebarCollapsed} onToggleProp={() => setSidebarCollapsed((s) => !s)} />

      <div className={`w-full transition-all duration-300 ease-in-out ${sidebarCollapsed ? "md:ml-16" : "md:ml-64"}`}>
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm border-b border-black/5">
          <Nav />
        </div>

        <main className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-amber-400">Settings</h1>
              <p className="text-sm text-black">Manage your profile and site-level settings.</p>
            </div>

            {/* <div className="flex items-center gap-3">
              <div className="text-sm text-black">Theme</div>
              <button
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                className="px-3 py-1 rounded bg-black/5 hover:bg-black/10"
              >
                {theme === "dark" ? "Dark" : "Light"}
              </button>
            </div> */}
          </div>

          {/* Profile */}
          <section className="bg-black/6 p-4 rounded-lg">
            <h2 className="font-semibold mb-3">Profile</h2>

            {profileLoading ? (
              <div className="text-black">Loading profile...</div>
            ) : profileError ? (
              <div className="text-red-400 bg-red-900/10 px-3 py-2 rounded">{profileError}</div>
            ) : (
              <form onSubmit={updateProfile} className="space-y-3">
                {profileMsg && <div className="text-green-300">{profileMsg}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-black">Name</label>
                    <input
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-black/10 rounded border border-black/10 outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-black">Email</label>
                    <input
                      value={profile.email}
                      onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-black/10 rounded border border-black/10 outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={loadingAny} className="px-4 py-2 bg-amber-500 rounded text-black font-semibold">
                    Save profile
                  </button>
                  <button
                    type="button"
                    onClick={fetchProfile}
                    className="px-4 py-2 border border-black/10 rounded text-sm"
                  >
                    Reload
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Change password */}
          <section className="bg-black/10 p-4 rounded-lg">
            <h2 className="font-semibold mb-3">Change password</h2>
            {pwdMsg && <div className="text-green-300">{pwdMsg}</div>}
            {pwdError && <div className="text-red-400">{pwdError}</div>}

            <form onSubmit={changePassword} className="space-y-3 max-w-xl">
              <div>
                <label className="text-xs text-black">Current password</label>
                <input
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-black/10 rounded border border-black/10 outline-none"
                  placeholder="Current password"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-black">New password</label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-black/10 rounded border border-black/10 outline-none"
                    placeholder="New password"
                  />
                </div>
                <div>
                  <label className="text-xs text-black">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-black/10 rounded border border-black/10 outline-none"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button disabled={pwdLoading} className="px-4 py-2 bg-amber-500 rounded text-black font-semibold">
                  Change password
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPwd("");
                    setNewPwd("");
                    setConfirmPwd("");
                    setPwdError("");
                    setPwdMsg("");
                  }}
                  className="px-4 py-2 border border-black/10 rounded text-sm"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>

          {/* Site settings (optional) */}
          <section className="bg-black/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold mb-3">Site settings</h2>
              <div className="text-sm text-black/40">Optional</div>
            </div>

            {settingsLoading ? (
              <div className="text-black/40">Loading settings...</div>
            ) : settingsError ? (
              <div className="text-black/40">{settingsError}</div>
            ) : (
              <form onSubmit={updateSettings} className="space-y-3">
                {settingsMsg && <div className="text-green-300">{settingsMsg}</div>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-black">Site name</label>
                    <input
                      value={settings.siteName}
                      onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-black/10 rounded border border-black/10 outline-none"
                      placeholder="UrbanCartX"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-black">Contact email</label>
                    <input
                      value={settings.contactEmail}
                      onChange={(e) => setSettings((s) => ({ ...s, contactEmail: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-black/10 rounded border border-black/10 outline-none"
                      placeholder="support@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-black">Support phone</label>
                    <input
                      value={settings.supportPhone}
                      onChange={(e) => setSettings((s) => ({ ...s, supportPhone: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-black/10 rounded border border-black/10 outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button disabled={loadingAny} className="px-4 py-2 bg-amber-500 rounded text-black font-semibold">
                    Save settings
                  </button>
                  <button
                    type="button"
                    onClick={fetchSettings}
                    className="px-4 py-2 border border-black/10 rounded text-sm"
                  >
                    Reload
                  </button>
                </div>
              </form>
            )}
          </section>

          <div className="text-xs text-black/40 mt-4">
            
          </div>
        </main>
      </div>
    </div>
  );
}

