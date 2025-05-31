"use client";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl-regular text-primary-600">
        Coffee Shop Management
      </h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg-semibold text-primary-800">Espresso</h2>
          <p className="text-sm-regular text-secondary-400">
            Rich and bold coffee.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg-semibold text-primary-800">Latte</h2>
          <p className="text-sm-regular text-secondary-400">
            Creamy and smooth.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg-semibold text-primary-800">Cappuccino</h2>
          <p className="text-sm-regular text-secondary-400">
            Frothy and delightful.
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs-regular">Text XS Regular (12px)</p>
        <p className="text-xs-semibold">Text XS Semibold (12px)</p>
        <p className="text-sm-regular">Text SM Regular (14px)</p>
        <p className="text-sm-semibold">Text SM Semibold (14px)</p>
        <p className="text-base-regular">Text Base Regular (16px)</p>
        <p className="text-base-semibold">Text Base Semibold (16px)</p>
        <p className="text-lg-regular">Text LG Regular (18px)</p>
        <p className="text-lg-semibold">Text LG Semibold (18px)</p>
        <p className="text-lg-2-regular">Text LG-2 Regular (20px)</p>
        <p className="text-lg-2-semibold">Text LG-2 Semibold (20px)</p>
        <p className="text-xl-regular">Text XL Regular (24px)</p>
        <p className="text-xl-semibold">Text XL Semibold (24px)</p>
        <p className="text-xl-2-regular">Text XL-2 Regular (32px)</p>
        <p className="text-xl-2-semibold">Text XL-2 Semibold (32px)</p>
        <p className="text-2xl-regular">Text 2XL Regular (36px)</p>
        <p className="text-2xl-semibold">Text 2XL Semibold (36px)</p>
        <p className="text-2xl-2-regular">Text 2XL-2 Regular (40px)</p>
        <p className="text-2xl-2-semibold">Text 2XL-2 Semibold (40px)</p>
        <p className="text-3xl-regular">Text 3XL Regular (48px)</p>
        <p className="text-3xl-semibold">Text 3XL Semibold (48px)</p>
      </div>
    </div>
  );
}
