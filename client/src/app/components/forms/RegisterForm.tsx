"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { redirect } from "next/navigation";
import { GrFormView, GrHide } from "react-icons/gr";

export default function RegisterForm() {
  interface IUser {
    fullname: string;
    username: string;
    email: string;
    phone: string;
    password: string;
  }

  const [user, setUser] = useState<IUser>({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");

  const API = process.env.NEXT_PUBLIC_API_URL;

  const isPassValid = () => {
    const symbols = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];

    const isLengthValid = user.password.length < 8;

    if (isLengthValid) {
      setPasswordError("Password must be more then 8 symbols");
    } else {
      const hasAnyChar = symbols.some((symbol) =>
        user.password.includes(symbol)
      );

      if (!hasAnyChar) {
        setPasswordError("Password must contains at least one letter");
      } else {
        setPasswordError("");
      }
    }
  };

  const isUsernameValid = () => {
    const forbiddenSymbols = [
      " ",
      "\t",
      "\n",

      "!",
      '"',
      "#",
      "$",
      "%",
      "&",
      "'",
      "(",
      ")",
      "*",
      "+",
      ",",
      "-",
      ".",
      "/",
      ":",
      ";",
      "<",
      "=",
      ">",
      "?",
      "@",

      "[",
      "\\",
      "]",
      "^",
      "_",
      "`",
      "{",
      "|",
      "}",
      "~",

      // кавычки и экзотика
      "«",
      "»",
      "“",
      "”",
      "‘",
      "’",
      // математика
      "±",
      "÷",
      "×",
    ];

    const isUsernameNotValid = forbiddenSymbols.some((symbol) =>
      user.username.includes(symbol)
    );

    if (isUsernameNotValid) {
      setUsernameError(
        "Username must not contain unique characters like (!, ], %, ^, &...)"
      );
    } else {
      setUsernameError("");
    }
  };

  const isPhoneValid = () => {
    const phoneRegions = [ 
      "+1", // USA, Canada
      "+7", // Russia, Kazakhstan
      "+20", // Egypt
      "+27", // South Africa
      "+30", // Greece
      "+31", // Netherlands
      "+32", // Belgium
      "+33", // France
      "+34", // Spain
      "+36", // Hungary
      "+39", // Italy
      "+40", // Romania
      "+41", // Switzerland
      "+43", // Austria
      "+44", // United Kingdom
      "+45", // Denmark
      "+46", // Sweden
      "+47", // Norway
      "+48", // Poland
      "+49", // Germany
      "+51", // Peru
      "+52", // Mexico
      "+53", // Cuba
      "+54", // Argentina
      "+55", // Brazil
      "+56", // Chile
      "+57", // Colombia
      "+58", // Venezuela
      "+60", // Malaysia
      "+61", // Australia
      "+62", // Indonesia
      "+63", // Philippines
      "+64", // New Zealand
      "+65", // Singapore
      "+66", // Thailand
      "+81", // Japan
      "+82", // South Korea
      "+84", // Vietnam
      "+86", // China
      "+90", // Turkey
      "+91", // India
      "+92", // Pakistan
      "+93", // Afghanistan
      "+94", // Sri Lanka
      "+95", // Myanmar
      "+98", // Iran
      "+211", // South Sudan
      "+212", // Morocco
      "+213", // Algeria
      "+216", // Tunisia
      "+218", // Libya
      "+220", // Gambia
      "+221", // Senegal
      "+222", // Mauritania
      "+223", // Mali
      "+224", // Guinea
      "+225", // Ivory Coast
      "+226", // Burkina Faso
      "+227", // Niger
      "+228", // Togo
      "+229", // Benin
      "+230", // Mauritius
      "+231", // Liberia
      "+232", // Sierra Leone
      "+233", // Ghana
      "+234", // Nigeria
      "+235", // Chad
      "+236", // Central African Republic
      "+237", // Cameroon
      "+238", // Cape Verde
      "+239", // São Tomé and Príncipe
      "+240", // Equatorial Guinea
      "+241", // Gabon
      "+242", // Congo
      "+243", // DR Congo
      "+244", // Angola
      "+245", // Guinea-Bissau
      "+246", // Diego Garcia
      "+248", // Seychelles
      "+249", // Sudan
      "+250", // Rwanda
      "+251", // Ethiopia
      "+252", // Somalia
      "+253", // Djibouti
      "+254", // Kenya
      "+255", // Tanzania
      "+256", // Uganda
      "+257", // Burundi
      "+258", // Mozambique
      "+260", // Zambia
      "+261", // Madagascar
      "+262", // Réunion
      "+263", // Zimbabwe
      "+264", // Namibia
      "+265", // Malawi
      "+266", // Lesotho
      "+267", // Botswana
      "+268", // Eswatini
      "+269", // Comoros
      "+370", // Lithuania
      "+371", // Latvia
      "+372", // Estonia
      "+373", // Moldova
      "+374", // Armenia
      "+375", // Belarus
      "+376", // Andorra
      "+377", // Monaco
      "+378", // San Marino
      "+380", // Ukraine 🇺🇦
      "+381", // Serbia
      "+382", // Montenegro
      "+383", // Kosovo
      "+385", // Croatia
      "+386", // Slovenia
      "+387", // Bosnia and Herzegovina
      "+389", // North Macedonia
      "+420", // Czech Republic
      "+421", // Slovakia
      "+423", // Liechtenstein
      "+852", // Hong Kong
      "+853", // Macau
      "+855", // Cambodia
      "+856", // Laos
      "+880", // Bangladesh
      "+886", // Taiwan
      "+961", // Lebanon
      "+962", // Jordan
      "+963", // Syria
      "+964", // Iraq
      "+965", // Kuwait
      "+966", // Saudi Arabia
      "+967", // Yemen
      "+968", // Oman
      "+970", // Palestine
      "+971", // UAE
      "+972", // Israel
      "+973", // Bahrain
      "+974", // Qatar
      "+975", // Bhutan
      "+976", // Mongolia
      "+977", // Nepal
      "+992", // Tajikistan
      "+993", // Turkmenistan
      "+994", // Azerbaijan
      "+995", // Georgia
      "+996", // Kyrgyzstan
      "+998", // Uzbekistan
    ];

    const isNumberValid = phoneRegions.some((region) =>
      user.phone.startsWith(region)
    );

    if (!isNumberValid) {
      setPhoneNumberError("Phone number region must be valid");
    } else {
      setPhoneNumberError("");
    }
  };

  useEffect(() => {
    isPassValid();
    isUsernameValid();
    isPhoneValid();
  }, [user.password, user.username, user.phone]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log(user);
    const response = await axios.post(`${API}/user/register`, user);
    if (response.status === 201) {
      setUser({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
      });
      redirect("/login");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#060606]/90 overflow-hidden">
      <div className="z-10 backdrop-blur-[15px] font-light bg-[#15121F]/60 px-[36px] py-[24px] rounded-md w-full max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-2xl font-light mb-[16px] text-center text-gray-200">
            Create your account
          </h2>

          <div>
            <input
              name="fullname"
              placeholder="Full name"
              value={user.fullname}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-sm text-gray-400 mt-1">Your legal full name</p>
          </div>

          <div>
            <input
              name="username"
              placeholder="Username"
              value={user.username}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-sm text-gray-400 mt-1">
              Unique username to log in
            </p>

            {user.username && (
              <div>
                {usernameError && (
                  <p className="text-center text-red-600 bg-red-100 border border-red-500 rounded-lg py-2 px-4">
                    {usernameError}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-sm text-gray-400 mt-1">
              We’ll never share your email
            </p>
          </div>

          <div>
            <input
              name="phone"
              placeholder="Phone number"
              value={user.phone}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-sm text-gray-400 mt-1">
              Include country code, e.g. +380
            </p>
            {user.phone && (
              <div>
                {phoneNumberError && (
                  <p className="text-center text-red-600 bg-red-100 border border-red-500 rounded-lg py-2 px-4">
                    {phoneNumberError}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="true"
              required
              className="w-full px-4 py-3 rounded-md border-none bg-[#0D0D0D]/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              className="absolute right-3 cursor-pointer top-3 text-white"
              onClick={(e) => {
                e.preventDefault();
                setIsPasswordVisible(!isPasswordVisible);
              }}
            >
              {!isPasswordVisible ? <GrFormView /> : <GrHide />}
            </button>
            <p className="text-sm text-gray-400 mt-1">
              Use at least 8 characters
            </p>

            {user.password ? (
              <div>
                {passwordError && (
                  <p className="text-center text-red-600 bg-red-100 border border-red-500 rounded-lg py-2 px-4">
                    {passwordError}
                  </p>
                )}
              </div>
            ) : (
              <div></div>
            )}

            {/* {passwordError && (
              <p className="text-center text-red-600 bg-red-100 border border-red-500 rounded-lg py-2 px-4">
                {passwordError}
              </p>
            )} */}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-[#3C1D70]/70 text-white py-2.5 rounded-md hover:bg-purple-900 transition duration-300"
          >
            Register
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/login" className="text-gray-300 hover:underline">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
