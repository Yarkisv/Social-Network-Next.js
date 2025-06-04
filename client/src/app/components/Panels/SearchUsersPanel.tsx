import axios from "axios";
import React from "react";

type User = {
  fullname: string;
  username: string;
  email: string;
  phone: string;
};

async function SearchUsersPanel() {
  const username: string = "yarkisv";

  const API = process.env.NEXT_PUBLIC_API_URL;
  
  const res = await axios.get(`${API}/user/username/${username}`);

  const user: User = await res.data;

  return <div>{user.username}</div>;
}

export default SearchUsersPanel;
