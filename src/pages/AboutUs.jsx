import React from "react";
import { getAboutUs } from "../api/contentApi";
import RichContentPage from "../components/RichContentPage";

const ABOUT_US_KEYS = [
  "aboutUs",
  "aboutUsContent",
  "content",
  "description",
  "html",
];

const AboutUs = () => {
  return (
    <RichContentPage
      title="About Us"
      description="Review the About Us content currently served by the backend."
      fetchContent={getAboutUs}
      contentKeys={ABOUT_US_KEYS}
      emptyMessage="About Us content is not available yet."
    />
  );
};

export default AboutUs;
