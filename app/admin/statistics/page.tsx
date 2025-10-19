"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Users, FileText, CheckCircle2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const votingData = [
  {
    id: "1",
    title: "Báo cáo tổng kết nhiệm kỳ 2022-2024",
    status: "completed",
    totalVotes: 150,
    agree: 142,
    disagree: 3,
    abstain: 5,
    participation: 100,
  },
  {
    id: "2",
    title: "Phương hướng hoạt động nhiệm kỳ 2024-2026",
    status: "voting",
    totalVotes: 150,
    agree: 128,
    disagree: 8,
    abstain: 14,
    participation: 100,
  },
  {
    id: "3",
    title: "Điều lệ Hội sinh viên (sửa đổi)",
    status: "pending",
    totalVotes: 150,
    agree: 0,
    disagree: 0,
    abstain: 0,
    participation: 0,
  },
  {
    id: "4",
    title: "Quy chế hoạt động Ban chấp hành",
    status: "completed",
    totalVotes: 150,
    agree: 145,
    disagree: 2,
    abstain: 3,
    participation: 100,
  },
  {
    id: "5",
    title: "Kế hoạch tài chính nhiệm kỳ 2024-2026",
    status: "voting",
    totalVotes: 150,
    agree: 115,
    disagree: 12,
    abstain: 23,
    participation: 100,
  },
]

const delegationVoting = [
  { delegation: "Cơ khí", agree: 23, disagree: 1, abstain: 1, total: 25 },
  { delegation: "Điện - Điện tử", agree: 20, disagree: 1, abstain: 1, total: 22 },
  { delegation: "CNTT", agree: 26, disagree: 1, abstain: 1, total: 28 },
  { delegation: "Xây dựng", agree: 19, disagree: 0, abstain: 1, total: 20 },
  { delegation: "Hóa học", agree: 17, disagree: 0, abstain: 1, total: 18 },
  { delegation: "Kinh tế", agree: 14, disagree: 0, abstain: 1, total: 15 },
  { delegation: "Ngoại ngữ", agree: 11, disagree: 0, abstain: 1, total: 12 },
  { delegation: "Môi trường", agree: 9, disagree: 0, abstain: 1, total: 10 },
]

const COLORS = {
  agree: "hsl(var(--success))",
  disagree: "hsl(var(--destructive))",
  abstain: "hsl(var(--muted-foreground))",
}

export default function StatisticsPage() {
  const totalDocuments = votingData.length
  const completedVotes = votingData.filter((d) => d.status === "completed").length
  const activeVotes = votingData.filter((d) => d.status === "voting").length
  const totalDelegates = 150

  // Calculate overall statistics
  const overallStats = votingData.reduce(
    (acc, doc) => ({
      agree: acc.agree + doc.agree,
      disagree: acc.disagree + doc.disagree,
      abstain: acc.abstain + doc.abstain,
    }),
    { agree: 0, disagree: 0, abstain: 0 },
  )

  const pieData = [
    { name: "Tán thành", value: overallStats.agree, color: COLORS.agree },
    { name: "Không tán thành", value: overallStats.disagree, color: COLORS.disagree },
    { name: "Không ý kiến", value: overallStats.abstain, color: COLORS.abstain },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Thống kê biểu quyết</h1>
            <p className="text-muted-foreground">Tổng hợp kết quả biểu quyết các văn kiện</p>
          </div>
          <Button className="gap-2">
            <Download size={16} />
            Xuất báo cáo
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <FileText className="text-primary" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-card-foreground">{totalDocuments}</div>
                <div className="text-sm text-muted-foreground">Tổng văn kiện</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-success/10 p-3 rounded-lg">
                <CheckCircle2 className="text-success" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-card-foreground">{completedVotes}</div>
                <div className="text-sm text-muted-foreground">Đã hoàn thành</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <TrendingUp className="text-accent" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-card-foreground">{activeVotes}</div>
                <div className="text-sm text-muted-foreground">Đang biểu quyết</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-lg">
                <Users className="text-secondary-foreground" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-card-foreground">{totalDelegates}</div>
                <div className="text-sm text-muted-foreground">Đại biểu</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Overall Voting Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Phân bố biểu quyết tổng thể</h3>
            <ChartContainer
              config={{
                agree: { label: "Tán thành", color: COLORS.agree },
                disagree: { label: "Không tán thành", color: COLORS.disagree },
                abstain: { label: "Không ý kiến", color: COLORS.abstain },
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ChartContainer>
          </Card>

          {/* Voting by Delegation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Biểu quyết theo đoàn</h3>
            <ChartContainer
              config={{
                agree: { label: "Tán thành", color: COLORS.agree },
                disagree: { label: "Không tán thành", color: COLORS.disagree },
                abstain: { label: "Không ý kiến", color: COLORS.abstain },
              }}
              className="h-[300px]"
            >
              <BarChart data={delegationVoting}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="delegation" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="agree" fill={COLORS.agree} name="Tán thành" stackId="a" />
                <Bar dataKey="disagree" fill={COLORS.disagree} name="Không tán thành" stackId="a" />
                <Bar dataKey="abstain" fill={COLORS.abstain} name="Không ý kiến" stackId="a" />
              </BarChart>
            </ChartContainer>
          </Card>
        </div>

        {/* Detailed Voting Results */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Chi tiết kết quả biểu quyết</h3>
          <div className="space-y-4">
            {votingData.map((doc) => {
              const agreePercent = doc.totalVotes > 0 ? Math.round((doc.agree / doc.totalVotes) * 100) : 0
              const disagreePercent = doc.totalVotes > 0 ? Math.round((doc.disagree / doc.totalVotes) * 100) : 0
              const abstainPercent = doc.totalVotes > 0 ? Math.round((doc.abstain / doc.totalVotes) * 100) : 0

              return (
                <div key={doc.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground mb-1">{doc.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            doc.status === "completed" ? "outline" : doc.status === "voting" ? "default" : "secondary"
                          }
                        >
                          {doc.status === "completed"
                            ? "Đã hoàn thành"
                            : doc.status === "voting"
                              ? "Đang biểu quyết"
                              : "Chờ biểu quyết"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Tỷ lệ tham gia: {doc.participation}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Vote Breakdown */}
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">{doc.agree}</div>
                      <div className="text-sm text-muted-foreground">Tán thành ({agreePercent}%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-destructive">{doc.disagree}</div>
                      <div className="text-sm text-muted-foreground">Không tán thành ({disagreePercent}%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-muted-foreground">{doc.abstain}</div>
                      <div className="text-sm text-muted-foreground">Không ý kiến ({abstainPercent}%)</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-4 bg-muted rounded-full overflow-hidden flex">
                    <div
                      className="bg-success transition-all"
                      style={{ width: `${agreePercent}%` }}
                      title={`Tán thành: ${agreePercent}%`}
                    />
                    <div
                      className="bg-destructive transition-all"
                      style={{ width: `${disagreePercent}%` }}
                      title={`Không tán thành: ${disagreePercent}%`}
                    />
                    <div
                      className="bg-muted-foreground transition-all"
                      style={{ width: `${abstainPercent}%` }}
                      title={`Không ý kiến: ${abstainPercent}%`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Delegation Participation */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Tỷ lệ tham gia theo đoàn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {delegationVoting.map((delegation) => {
              const participationRate = Math.round((delegation.total / delegation.total) * 100)
              return (
                <div key={delegation.delegation} className="border border-border rounded-lg p-4">
                  <div className="font-semibold text-card-foreground mb-2">{delegation.delegation}</div>
                  <div className="text-3xl font-bold text-primary mb-1">{participationRate}%</div>
                  <div className="text-sm text-muted-foreground">
                    {delegation.total}/{delegation.total} đại biểu
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
