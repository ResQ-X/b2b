"use client";
import Head from "next/head";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>Login - ResqX Admin</title>
        <meta name="description" content="Login to ResqX Admin Dashboard" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#2563eb" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full space-y-8">{children}</div>
      </div>
    </>
  );
}
