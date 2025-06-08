// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// export async function middleware(request: NextRequest) {
//   const API = process.env.NEXT_PUBLIC_API_URL;

//   const access_token = request.cookies.get("access_token")?.value;
//   const refresh_token = request.cookies.get("refresh_token")?.value;

//   try {
//     const res = await axios.get(`${API}/auth/profile`, {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     });

//     if (res.status === 401) {
//       try {
//         const res = await axios.get(`${API}/auth/refresh`, {
//           headers: {
//             Authorization: `Bearer ${refresh_token}`,
//           },
//         });
//       } catch (error) {
//         console.log("Error: ", error);
//       }
//     }
//   } catch (error) {
//     console.log("Error: ", error);
//   }
// }
