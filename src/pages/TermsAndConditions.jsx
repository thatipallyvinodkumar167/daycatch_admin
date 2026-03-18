import React from "react";
import { getTerms } from "../api/contentApi";
import RichContentPage from "../components/RichContentPage";

const TERMS_KEYS = [
  "terms",
  "termsAndConditions",
  "termsContent",
  "content",
  "description",
  "html",
];

const TermsAndConditions = () => {
  return (
    <RichContentPage
      title="Terms & Conditions"
      description="Review the Terms & Conditions content currently served by the backend."
      fetchContent={getTerms}
      contentKeys={TERMS_KEYS}
      emptyMessage="Terms & Conditions content is not available yet."
    />
  );
};

export default TermsAndConditions;
