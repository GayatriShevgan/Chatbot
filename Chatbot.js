import { useState } from "react";

export default function ChatbotUI() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [responses, setResponses] = useState([]);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    setHistory([...history, query]);
    setResponses([...responses, { user: query, bot: "Fetching response..." }]);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponses([...responses, { user: query, bot: data.response }]);
    } catch (error) {
      setResponses([...responses, { user: query, bot: "Error fetching response." }]);
    }

    setQuery("");
  };

  return (
    <div className="flex flex-col max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Chatbot</h1>
      <div className="h-64 overflow-y-auto border p-3 rounded-lg mb-4">
        {responses.map((res, index) => (
          <div key={index} className="mb-2">
            <p className="text-blue-600 font-semibold">You: {res.user}</p>
            <p className="text-gray-700">Bot: {res.bot}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-grow border rounded-lg p-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <h2 className="font-semibold">Recent Queries:</h2>
        <ul>
          {history.slice(-5).map((q, i) => (
            <li key={i}>• {q}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

