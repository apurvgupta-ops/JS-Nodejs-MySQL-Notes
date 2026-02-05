import { auth } from "@/auth";
import React from "react";
import SignOut from "./Auth/SignOut";

export default async function Profile() {
  const session = await auth();
  const user = session?.user;
  const expires = session?.expires;

  if (!user) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-200">Not authenticated</p>
        </div>
      </div>
    );
  }

  // Parse expiry date
  const expiryDate = expires ? new Date(expires).toLocaleDateString() : "N/A";

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-linear-to-r from-blue-500 to-purple-600"></div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center -mt-16 mb-6">
            <div className="w-32 h-32 bg-linear-to-br from-blue-400 to-purple-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
              {/* {user.name?.charAt(0).toUpperCase() ||
                user.email?.charAt(0).toUpperCase()} */}
              <img src={user.image} className="rounded-[100] w-full" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
              {user.name || "User"}
            </h1>
          </div>

          {/* Info Grid */}
          <div className="space-y-4 mb-6">
            {/* Email */}
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Email
              </p>
              <p className="text-lg text-slate-900 dark:text-white break-all">
                {user.email || "Not provided"}
              </p>
            </div>

            {/* Session Expiry */}
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Session Expires
              </p>
              <p className="text-lg text-slate-900 dark:text-white">
                {expiryDate}
              </p>
            </div>

            {/* User ID (if available) */}
            {user.id && (
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  User ID
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 break-all font-mono">
                  {user.id}
                </p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="flex gap-3">
            <SignOut />
            <button className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition font-medium">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
