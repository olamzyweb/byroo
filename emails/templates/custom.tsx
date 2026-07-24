import * as React from "react";
import { BrandedLayout } from "../layouts/BrandedLayout";
import { EmailBody } from "../components/Primitives";

interface CustomEmailProps {
  bodyText: string;
  unsubscribeToken?: string;
}

export const CustomEmail: React.FC<CustomEmailProps> = ({
  bodyText = "",
  unsubscribeToken,
}) => {
  // Split the body text by double newline to format paragraphs cleanly,
  // falling back to single newlines with br tags for linebreaks.
  const paragraphs = bodyText.split("\n\n").map((para, i) => {
    const lines = para.split("\n").map((line, j) => (
      <React.Fragment key={j}>
        {line}
        {j < para.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
    return <EmailBody key={i}>{lines}</EmailBody>;
  });

  return (
    <BrandedLayout previewText="Update from the Byroo Team" unsubscribeToken={unsubscribeToken}>
      {paragraphs}
    </BrandedLayout>
  );
};
