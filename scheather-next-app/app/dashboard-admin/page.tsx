"use client";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import React, { useState, useEffect, useRef } from "react";
import LogAnalytics from "../components/LogAnalytics";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

export default function AdminPage() {
  return (
    <div className="bg-white min-h-screen">
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-QMVC5BR2W3"
      ></Script>
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || [];
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag("js", new Date());

          gtag("config", "G-QMVC5BR2W3");`}
      </Script>

      {/* Fixed Header */}
      <header
        className="w-full h-20 bg-white shadow-[0px_1.5px_15px_0px_rgba(0,0,0,0.20)] fixed top-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-20"
        style={{
          fontFamily: "Poppins",
        }}
      >
        {/* Brand Logo */}
        <div
          className="text-black text-xl sm:text-2xl font-medium"
          style={{
            fontFamily: '"Cedarville Cursive", cursive',
          }}
        >
          Scheather
        </div>

        {/* Desktop Navigation - right aligned */}
        <div className="hidden lg:flex items-center gap-4 ml-auto">
          <Link href="/auth/login" passHref>
            <h1 className="text-black text-sm xl:text-base hover:cursor-pointer after:block after:h-[2px] after:bg-[#e68c3a] after:absolute after:bottom-0 after:left-0 after:w-0 after:transition-all after:duration-300 hover:after:w-full">
              Log Out
            </h1>
          </Link>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="pt-20 min-h-screen">
        {/* Header Section */}
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-center mt-4">
            Welcome to the admin dashboard. Here you can manage users, view
            analytics, and more.
          </p>
        </div>

        {/* Analytics Content */}
        <div className="space-y-8 px-4 pb-8">
          {/* <LogAnalytics /> */}
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
}
