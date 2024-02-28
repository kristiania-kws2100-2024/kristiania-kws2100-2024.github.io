import React, { useEffect, useState } from "react";

interface ProfileDto {
  username: string;
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

  return <h1>Hello {profile?.username || "stranger"}</h1>;
}
