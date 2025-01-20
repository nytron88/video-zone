import React from "react";

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg p-5 flex items-center gap-4">
      <div className="text-purple-500 text-4xl">{icon}</div>
      <div>
        <h3 className="text-white text-xl font-medium">{label}</h3>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default StatCard;
