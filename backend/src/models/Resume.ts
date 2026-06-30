import mongoose, { Document, Schema } from "mongoose";

export interface IResume extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  extractedText: string;
}

const ResumeSchema = new Schema<IResume>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Resume =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;
