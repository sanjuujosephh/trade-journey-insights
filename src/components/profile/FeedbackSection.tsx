
import { FeedbackForm } from "./FeedbackForm";

export function FeedbackSection() {
  return (
    <div className="rounded-lg bg-white p-6 border">
      <h2 className="text-xl font-semibold mb-6">Feedback & Support</h2>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          We value your feedback! Use the options below to request new features or report any issues you encounter.
        </p>
        
        <div className="flex flex-col gap-2">
          <FeedbackForm type="feature_request" buttonLabel="Request a Feature" />
          <FeedbackForm type="issue_report" buttonLabel="Report an Issue" />
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          Our team reviews all feedback and continuously works to improve your experience.
        </div>
      </div>
    </div>
  );
}
