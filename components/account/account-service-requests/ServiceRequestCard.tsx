import {
  getServiceRequestStatusClass,
  type OngoingServiceRequest,
} from "@/components/account/account-service-requests/serviceRequestsData";

type ServiceRequestCardProps = {
  request: OngoingServiceRequest;
};

export default function ServiceRequestCard({ request }: ServiceRequestCardProps) {
  const statusClass = getServiceRequestStatusClass(request.status);

  return (
    <article className="account-service-requests__card">
      <header className="account-service-requests__card-header">
        <div className="account-service-requests__card-heading">
          <h6 className="account-service-requests__card-title fw-semibold mb-0">
            {request.typeLabel}
          </h6>
          <p className="account-service-requests__ticket cl-text-2 mb-0">
            Ticket ID:{" "}
            <span className="fw-medium">{request.ticketId}</span>
          </p>
        </div>
        <span
          className={`account-service-requests__status fw-medium ${statusClass}`}
        >
          {request.statusLabel}
        </span>
      </header>

      <section className="account-service-requests__card-body">
        <p className="account-service-requests__section-label fw-medium mb-0">
          Status &amp; Updates
        </p>
        <p className="account-service-requests__update cl-text-2 mb-0">
          {request.updateMessage}
        </p>
        <p className="account-service-requests__date cl-text-2 mb-0">
          {request.updatedAt}
        </p>
      </section>

      <footer className="account-service-requests__card-actions">
        <button type="button" className="tf-btn btn-stroke small">
          Reschedule
        </button>
        <button
          type="button"
          className="tf-btn btn-stroke small account-service-requests__cancel-btn"
        >
          Cancel Request
        </button>
      </footer>
    </article>
  );
}
