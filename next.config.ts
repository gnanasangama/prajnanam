import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...your existing config
}

module.exports = withPWA(nextConfig)