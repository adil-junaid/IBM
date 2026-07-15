function Hero() {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center bg-slate-100 text-center px-6">

      <h1 className="text-6xl font-extrabold text-slate-800">

        AI Powered

        <span className="text-blue-600">

          {" "}Document Analyzer

        </span>

      </h1>

      <p className="mt-6 text-xl text-gray-600 max-w-3xl">

        Upload PDFs, Word files, or text documents and
        instantly receive summaries, key insights,
        translations, and AI-powered answers.

      </p>

      <button className="mt-10 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700">

        Get Started

      </button>

    </section>
  );
}

export default Hero;