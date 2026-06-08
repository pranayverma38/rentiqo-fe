"use client";

import ServiceRequestCard from "@/components/account/account-service-requests/ServiceRequestCard";
import ServiceRequestTypeGrid from "@/components/account/account-service-requests/ServiceRequestTypeGrid";
import { MOCK_ONGOING_SERVICE_REQUESTS } from "@/components/account/account-service-requests/serviceRequestsData";

export default function AccountServiceRequests() {
  return (
    <div className="account-service-requests w-full min-w-0">
      <p className="cl-text-2 mb-20">
        Raise a new service request or track updates on your ongoing tickets.
        Our team will keep you informed at every step.
      </p>

      <section className="account-service-requests__section mb-24">
        <h6 className="account-service-requests__section-title fw-medium mb-16">
          Raise a service request
        </h6>
        <ServiceRequestTypeGrid />
      </section>

      <section className="account-service-requests__section">
        <h6 className="account-service-requests__section-title fw-medium mb-16">
          Ongoing service requests
        </h6>
        {MOCK_ONGOING_SERVICE_REQUESTS.length > 0 ? (
          <ul className="account-service-requests__card-list">
            {MOCK_ONGOING_SERVICE_REQUESTS.map((request) => (
              <li key={request.id}>
                <ServiceRequestCard request={request} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="cl-text-2 mb-0">No ongoing service requests.</p>
        )}
      </section>
    </div>
  );
}