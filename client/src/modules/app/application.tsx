import React, { useEffect, useState } from "react";

import "./application.css";

interface ProfileDto {
  username: string;
}

function ZoomToMeLink() {
  return <a href={"#"}>Zoom to me</a>;
}

export function Application() {
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

  return (
    <>
      <header>
        <h1>My map application</h1>
      </header>
      <nav>
        <ZoomToMeLink />
        <div style={{ flex: 1 }}></div>
        {profile && <div>{profile.username}</div>}
      </nav>
      <main>
        <div />
      </main>
    </>
  );
}
