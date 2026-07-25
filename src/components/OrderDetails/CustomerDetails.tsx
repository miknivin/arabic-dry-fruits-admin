/* eslint-disable @next/next/no-img-element */
import { ShippingInfo } from "@/types/order";
import React from "react";

interface CustomerDetailsProps {
  customer: ShippingInfo;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer }) => {
  if (!customer) {
    return (
      <div className="flex w-full flex-col items-center justify-between bg-gray-50 px-4 py-6 dark:bg-gray-800 md:items-start md:p-6 xl:w-96 xl:p-8">
        <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-gray-100">Customer</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Customer details not available</p>
      </div>
    );
  }

  // Normalize fields — support both admin (shippingInfo) and storefront (shippingAddress) schemas
  const c = customer as any;
  const fullName   = c.fullName   || "";
  const email      = c.email      || "";
  const phoneNo    = c.phoneNo    || c.phone    || "";
  const address    = c.address    || "";
  const address2   = c.address2   || "";
  const city       = c.city       || "";
  const state      = c.state      || "";
  const zipCode    = c.zipCode    || c.pinCode  || "";
  const country    = c.country    || "India";

  return (
    <div className="flex w-full flex-col items-center justify-between bg-gray-50 px-4 py-6 dark:bg-gray-800 md:items-start md:p-6 xl:w-96 xl:p-8">
      <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-gray-100">
        Customer
      </h3>
      <div className="flex h-full w-full flex-col items-stretch justify-start md:flex-row md:space-x-6 lg:space-x-8 xl:flex-col xl:space-x-0">
        {/* Name & contact */}
        <div className="flex flex-shrink-0 flex-col items-start justify-start">
          <div className="flex w-full flex-col border-b border-gray-200 py-6 dark:border-gray-700 space-y-1">
            {fullName && (
              <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{fullName}</p>
            )}
            {email && (
              <p className="text-sm text-gray-500 dark:text-gray-300">{email}</p>
            )}
          </div>

          {phoneNo && (
            <div className="flex w-full items-center space-x-3 border-b border-gray-200 py-4 text-gray-800 dark:border-gray-700 dark:text-gray-300">
              <svg className="h-5 w-5 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z" />
              </svg>
              <p className="text-sm">{phoneNo}</p>
            </div>
          )}
        </div>

        {/* Address details */}
        <div className="mt-4 flex w-full flex-col space-y-3 xl:mt-6">
          {address && (
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Address</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {address}
                {address2 && <><br />{address2}</>}
              </p>
            </div>
          )}
          {(city || state) && (
            <div className="flex gap-6">
              {city && (
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">City</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{city}</p>
                </div>
              )}
              {state && (
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">State</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{state}</p>
                </div>
              )}
            </div>
          )}
          {zipCode && (
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Pin Code</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{zipCode}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Country</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{country}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default props
// CustomerDetails.defaultProps = {
//   customer: {
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     previousOrders: 0,
//     shippingAddress: '123 Main St, Springfield, IL',
//     billingAddress: '123 Main St, Springfield, IL',
//   },
// };

export default CustomerDetails;
