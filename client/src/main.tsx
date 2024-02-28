import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

interface ProfileDto {
  username: string;
}

function Application() {
  async function fetchProfile() {
    const res = await fetch("/api/profile");
    if (!res.ok) {
      throw Error(res.statusText);
    }
    setProfile(await res.json());
  }

  const [profile, setProfile] = useState<ProfileDto>();
  useEffect(() => {
    fetchProfile();
  }, []);

  return <h1>Hello {profile?.username || "stranger"}</h1>;
}

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<Application />);
