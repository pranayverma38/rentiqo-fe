"use client";

import {
  SERVICE_REQUEST_TYPES,
  type ServiceRequestTypeId,
} from "@/components/account/account-service-requests/serviceRequestsData";

type ServiceRequestTypeGridProps = {
  onSelectType?: (typeId: ServiceRequestTypeId) => void;
};

export default function ServiceRequestTypeGrid({
  onSelectType,
}: ServiceRequestTypeGridProps) {
  return (
    <ul className="account-service-requests__type-grid">
      {SERVICE_REQUEST_TYPES.map((type) => (
        <li key={type.id}>
          <button
            type="button"
            className="account-service-requests__type-tile"
            onClick={() => onSelectType?.(type.id)}
          >
            <span
              className="account-service-requests__type-icon"
              aria-hidden
            >
              <i className={`icon ${type.icon}`} />
            </span>
            <span className="account-service-requests__type-label fw-medium">
              {type.label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
