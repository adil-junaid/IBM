import { FiFileText, FiMessageSquare, FiCpu } from "react-icons/fi";

const cards = [
  {
    title: "Documents",
    value: "0",
    icon: <FiFileText size={24} />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Chats",
    value: "0",
    icon: <FiMessageSquare size={24} />,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "AI Model",
    value: "Llama 3",
    icon: <FiCpu size={24} />,
    color: "bg-purple-100 text-purple-600",
  },
];

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Welcome back 👋
        </h2>

        <p className="mt-2 text-slate-500">
          Manage your research documents and chat with your AI assistant.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className={`inline-flex rounded-xl p-3 ${card.color}`}>
              {card.icon}
            </div>

            <h3 className="mt-5 text-lg font-semibold">{card.title}</h3>

            <p className="mt-2 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;