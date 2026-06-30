import mongoose, { Document, Schema } from "mongoose";

export interface IAnalysis extends Document {
  resume: mongoose.Types.ObjectId;
  atsScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
  summary: string;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    resume: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    atsScore: {
      type: Number,
      default: 0,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    strengths: [String],

    weaknesses: [String],

    missingSkills: [String],

    suggestions: [String],

    summary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Analysis =
  mongoose.models.Analysis ||
  mongoose.model<IAnalysis>("Analysis", AnalysisSchema);

export default Analysis;
