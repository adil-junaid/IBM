import { Link } from "react-router-dom";
import { HiArrowRight, HiCloudUpload, HiSparkles } from "react-icons/hi";

import Container from "../common/Container";
import Section from "../common/Section";
import Button from "../common/Button";

const Hero = () => {
  return (
    <Section className="bg-slate-50">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <HiSparkles />
              AI-Powered Research Assistant
            </div>

            <h1 className="text-5xl font-bold leading-tight text-slate-900 lg:text-6xl">
              Chat with your
              <span className="block text-blue-600">
                Documents
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Upload PDFs, research papers, and notes. Ask questions in natural
              language and get accurate answers powered by Ollama and LangChain.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button>
                  <HiCloudUpload />
                  Upload Documents
                </Button>
              </Link>

              <Link to="/dashboard">
                <Button variant="secondary">
                  Open Dashboard
                  <HiArrowRight />
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
              <span>✓ 100% Local AI</span>
              <span>✓ Private</span>
              <span>✓ No API Costs</span>
            </div>
          </div>

          {/* Right */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-semibold text-slate-900">
                AI Research Preview
              </h3>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Online
              </span>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">You</p>

                <p className="mt-2 text-slate-800">
                  Summarize my uploaded research paper.
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-700">
                  AI Assistant
                </p>

                <p className="mt-2 text-slate-700">
                  The paper introduces a Retrieval-Augmented Generation pipeline
                  using LangChain and vector embeddings to improve document
                  question answering accuracy...
                </p>
              </div>

              <div className="h-2 w-32 animate-pulse rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;