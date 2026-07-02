import { FileUpload } from "@/components/file-upload";
import { PageHeader } from "@/components/page-header";

export default function UploadPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resume Upload"
        title="Upload your resume"
        description="Upload a PDF resume and generate a detailed analysis with scores, strengths, weaknesses, and suggestions."
      />
      <FileUpload />
    </>
  );
}
