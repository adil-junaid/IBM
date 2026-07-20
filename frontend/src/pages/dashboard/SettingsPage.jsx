const SettingsPage = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800">
        Settings
      </h2>

      <p className="mt-2 text-slate-500">
        Configure your AI research assistant.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">
          AI Model
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Currently using Llama 3 with Ollama.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;