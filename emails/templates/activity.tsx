import * as React from "react";
import { BrandedLayout } from "../layouts/BrandedLayout";
import {
  EmailH1,
  EmailBody,
  EmailCTA,
  EmailDivider,
  EmailCard,
  EmailCallout,
} from "../components/Primitives";

// 1. New Inquiry Notification
interface NewInquiryProps {
  businessName: string;
  customerName: string;
  customerEmail: string;
  itemName?: string; // Product or service name
  message: string;
  actionUrl: string;
  unsubscribeToken?: string;
}
export const NewInquiry: React.FC<NewInquiryProps> = ({
  businessName = "My Shop",
  customerName = "Jane Doe",
  customerEmail = "jane@example.com",
  itemName = "Custom Web Design",
  message = "Hello! I would love to get a quote for my website project. Let me know when you are available.",
  actionUrl = "https://byroo.digital/dashboard/inquiries",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText={`New inquiry from ${customerName} for ${itemName}`}
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>New Inquiry Received! 📩</EmailH1>
    <EmailBody>
      Hello from Byroo! A customer has sent an inquiry regarding your listed item: <strong>{itemName}</strong> on {businessName}.
    </EmailBody>
    <EmailCard className="bg-indigo-50/20 border-indigo-100">
      <EmailBody className="m-0 mb-2">
        <strong>From:</strong> {customerName} ({customerEmail})
      </EmailBody>
      <EmailDivider className="my-2 border-indigo-100/50" />
      <EmailBody className="m-0 italic text-gray-700">
        "{message}"
      </EmailBody>
    </EmailCard>
    <EmailBody>
      Log in to your Byroo dashboard to view more details, reply to this customer, or mark this inquiry as resolved.
    </EmailBody>
    <EmailCTA
      title="Reply to Customer"
      description="Respond promptly to close this lead."
      buttonText="View Inquiries"
      href={actionUrl}
    />
  </BrandedLayout>
);

// 2. New Review Notification
interface NewReviewProps {
  businessName: string;
  customerName: string;
  rating: number;
  reviewText: string;
  actionUrl: string;
  unsubscribeToken?: string;
}
export const NewReview: React.FC<NewReviewProps> = ({
  businessName = "My Shop",
  customerName = "Anonymous",
  rating = 5,
  reviewText = "Amazing work! Highly recommended vendor.",
  actionUrl = "https://byroo.digital/dashboard/testimonials",
  unsubscribeToken,
}) => {
  const stars = "⭐".repeat(rating);
  return (
    <BrandedLayout
      previewText={`New ${rating}-star review from ${customerName}`}
      unsubscribeToken={unsubscribeToken}
    >
      <EmailH1>New Customer Review! ⭐</EmailH1>
      <EmailBody>
        Congratulations! You have received a new customer review on your Byroo profile:
      </EmailBody>
      <EmailCard className="bg-amber-50/10 border-amber-200">
        <EmailBody className="m-0 mb-1 font-bold text-gray-900">
          {customerName}
        </EmailBody>
        <EmailBody className="m-0 mb-2 text-sm">
          Rating: {stars} ({rating}/5)
        </EmailBody>
        <EmailDivider className="my-2 border-amber-200/50" />
        <EmailBody className="m-0 italic text-gray-700">
          "{reviewText}"
        </EmailBody>
      </EmailCard>
      <EmailBody>
        Positive reviews are the best social proof! You can showcase or feature this review directly on your homepage.
      </EmailBody>
      <EmailCTA
        title="Manage Your Reviews"
        description="Feature or edit this review in your settings."
        buttonText="Manage Reviews"
        href={actionUrl}
      />
    </BrandedLayout>
  );
};

// 3. New Contact Message
interface NewContactMessageProps {
  businessName: string;
  senderName: string;
  senderEmail: string;
  message: string;
  actionUrl: string;
  unsubscribeToken?: string;
}
export const NewContactMessage: React.FC<NewContactMessageProps> = ({
  businessName = "My Shop",
  senderName = "Alex Smith",
  senderEmail = "alex@example.com",
  message = "Hi, I have a general question about your services. Do you support delivery?",
  actionUrl = "https://byroo.digital/dashboard/inquiries",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText={`New message from ${senderName} on ${businessName}`}
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>New Message Received! 💬</EmailH1>
    <EmailBody>
      A visitor has left a message via the general contact form on your Byroo business space:
    </EmailBody>
    <EmailCard className="bg-gray-50 border-gray-200">
      <EmailBody className="m-0 mb-2">
        <strong>Sender:</strong> {senderName} (<a href={`mailto:${senderEmail}`} className="text-indigo-600">{senderEmail}</a>)
      </EmailBody>
      <EmailDivider className="my-2" />
      <EmailBody className="m-0 text-gray-700">
        "{message}"
      </EmailBody>
    </EmailCard>
    <EmailCTA
      title="Contact Panel"
      description="Access your messages inside your portal."
      buttonText="View Messages"
      href={actionUrl}
    />
  </BrandedLayout>
);

// 4. New Booking
interface NewBookingProps {
  businessName: string;
  customerName: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  actionUrl: string;
  unsubscribeToken?: string;
}
export const NewBooking: React.FC<NewBookingProps> = ({
  businessName = "My Spa",
  customerName = "Lisa Kudrow",
  serviceName = "Premium Therapy",
  bookingDate = "2026-08-01",
  bookingTime = "14:00",
  notes = "No special notes.",
  actionUrl = "https://byroo.digital/dashboard/bookings",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText={`New booking request: ${serviceName}`}
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>New Booking Scheduled! 📅</EmailH1>
    <EmailBody>
      You have a new booking request for your service: <strong>{serviceName}</strong>.
    </EmailBody>
    <EmailCard className="bg-emerald-50/10 border-emerald-200">
      <EmailBody className="m-0 mb-1">
        <strong>Customer:</strong> {customerName}
      </EmailBody>
      <EmailBody className="m-0 mb-1">
        <strong>Date:</strong> {bookingDate}
      </EmailBody>
      <EmailBody className="m-0 mb-1">
        <strong>Time:</strong> {bookingTime}
      </EmailBody>
      {notes && (
        <>
          <EmailDivider className="my-2 border-emerald-200/50" />
          <EmailBody className="m-0 text-sm text-gray-600 italic">
            <strong>Notes:</strong> "{notes}"
          </EmailBody>
        </>
      )}
    </EmailCard>
    <EmailCTA
      title="Manage Bookings"
      description="Approve, reschedule, or decline this booking."
      buttonText="View Bookings"
      href={actionUrl}
    />
  </BrandedLayout>
);

// 5. New Order
interface NewOrderProps {
  businessName: string;
  orderId: string;
  customerName: string;
  itemsSummary: string; // e.g. "Product A x 1, Product B x 2"
  totalPrice: string;
  actionUrl: string;
  unsubscribeToken?: string;
}
export const NewOrder: React.FC<NewOrderProps> = ({
  businessName = "My Shop",
  orderId = "BYR-10023",
  customerName = "Michael Scott",
  itemsSummary = "Classic Leather Bag x 1",
  totalPrice = "₦45,000",
  actionUrl = "https://byroo.digital/dashboard/orders",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText={`New order ${orderId} on Byroo`}
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>New Order Received! 🛍️</EmailH1>
    <EmailBody>
      You have received a new purchase order via your online storefront!
    </EmailBody>
    <EmailCard className="bg-gray-50 border-gray-200">
      <EmailBody className="m-0 mb-1">
        <strong>Order ID:</strong> #{orderId}
      </EmailBody>
      <EmailBody className="m-0 mb-1">
        <strong>Customer:</strong> {customerName}
      </EmailBody>
      <EmailBody className="m-0 mb-1">
        <strong>Items:</strong> {itemsSummary}
      </EmailBody>
      <EmailBody className="m-0 mb-1 font-bold text-indigo-600">
        <strong>Total Price:</strong> {totalPrice}
      </EmailBody>
    </EmailCard>
    <EmailCTA
      title="Process Order"
      description="Check shipping details and dispatch products."
      buttonText="View Order"
      href={actionUrl}
    />
  </BrandedLayout>
);
