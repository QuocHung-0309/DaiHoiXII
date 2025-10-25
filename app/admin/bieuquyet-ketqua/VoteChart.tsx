"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

// Component này dùng để hiển thị biểu đồ nhỏ cho mỗi câu hỏi
export default function VoteChart({ data }: { data: ChartData[] }) {
  const total = data.reduce((acc, entry) => acc + entry.value, 0);

  // Nếu không có phiếu, hiển thị thông báo
  if (total === 0) {
    return (
      <div className="text-sm text-center text-slate-400 py-4">
        Chưa có phiếu
      </div>
    );
  }

  return (
    // Chiều cao cố định cho mỗi biểu đồ
    <div style={{ width: "100%", height: 50 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical" // Biểu đồ ngang
          margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
        >
          {/* Ẩn trục X và Y để làm biểu đồ mini */}
          <XAxis type="number" hide domain={[0, total]} />
          <YAxis type="category" dataKey="name" hide />

          {/* Tooltip khi hover */}
          <Tooltip
            formatter={(value, name) => [
              `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`,
              name,
            ]}
            cursor={{ fill: "rgba(241, 245, 249, 0.5)" }}
          />

          <Bar
            dataKey="value"
            stackId="a" // Xếp chồng các thanh
            radius={[5, 5, 5, 5]}
            barSize={20} // Độ dày của thanh
          >
            {/* Tô màu cho từng thanh */}
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
