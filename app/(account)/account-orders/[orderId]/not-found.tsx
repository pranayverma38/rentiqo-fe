import Link from "next/link";

export default function AccountOrderNotFound() {
  return (
    <div className="account-order-detail w-full min-w-0">
      <p className="cl-text-2 mb-20">This order could not be found.</p>
      <Link href="/account-orders" className="tf-btn btn-stroke small">
        Back to orders
      </Link>
    </div>
  );
}
