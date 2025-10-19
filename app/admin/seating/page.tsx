"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Printer, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const seatingData = {
  stage: { rows: 2, seatsPerRow: 10 },
  sections: [
    {
      id: "left",
      name: "Khu vực trái",
      rows: 8,
      seatsPerRow: 12,
      startRow: 1,
    },
    {
      id: "center",
      name: "Khu vực giữa",
      rows: 10,
      seatsPerRow: 15,
      startRow: 1,
    },
    {
      id: "right",
      name: "Khu vực phải",
      rows: 8,
      seatsPerRow: 12,
      startRow: 1,
    },
  ],
}

const delegateAssignments: Record<string, { name: string; delegation: string; code: string; color: string }> = {
  "L-1-1": { name: "Nguyễn Văn An", delegation: "Khoa Cơ khí", code: "ME", color: "bg-primary" },
  "L-1-2": { name: "Trần Thị Bình", delegation: "Khoa Cơ khí", code: "ME", color: "bg-primary" },
  "L-1-3": { name: "Lê Văn Cường", delegation: "Khoa Cơ khí", code: "ME", color: "bg-primary" },
  "C-1-1": { name: "Võ Thị Giang", delegation: "Khoa Điện - Điện tử", code: "EE", color: "bg-accent" },
  "C-1-2": { name: "Đặng Văn Hùng", delegation: "Khoa Điện - Điện tử", code: "EE", color: "bg-accent" },
  "C-2-1": { name: "Trương Văn Nam", delegation: "Khoa CNTT", code: "IT", color: "bg-secondary" },
  "C-2-2": { name: "Lý Thị Oanh", delegation: "Khoa CNTT", code: "IT", color: "bg-secondary" },
  "R-1-1": { name: "Cao Văn Tài", delegation: "Khoa Xây dựng", code: "CE", color: "bg-success" },
  "R-1-2": { name: "Hồ Thị Uyên", delegation: "Khoa Xây dựng", code: "CE", color: "bg-success" },
}

export default function SeatingChartPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)

  const getSeatId = (section: string, row: number, seat: number) => {
    return `${section}-${row}-${seat}`
  }

  const getSeatInfo = (seatId: string) => {
    return delegateAssignments[seatId]
  }

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(seatId)
  }

  const filteredSeats = Object.entries(delegateAssignments).filter(
    ([_, info]) =>
      info.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.delegation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Sơ đồ chỗ ngồi</h1>
              <p className="text-muted-foreground">Quản lý sắp xếp chỗ ngồi cho đại biểu</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Printer size={16} />
                In sơ đồ
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download size={16} />
                Xuất file
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Tìm kiếm đại biểu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-3 text-card-foreground">Kết quả tìm kiếm ({filteredSeats.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredSeats.map(([seatId, info]) => (
                <button
                  key={seatId}
                  onClick={() => handleSeatClick(seatId)}
                  className="flex items-center gap-2 p-2 rounded border border-border hover:bg-muted transition-colors text-left"
                >
                  <Badge className={`${info.color} text-white`}>{info.code}</Badge>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{info.name}</div>
                    <div className="text-xs text-muted-foreground">{seatId}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Seating Chart */}
        <Card className="p-8">
          {/* Stage */}
          <div className="mb-8">
            <div className="bg-muted border-2 border-border rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-foreground mb-2">SÂN KHẤU / BÀN CHỦ TỊCH</div>
              <div className="flex justify-center gap-2">
                {Array.from({ length: seatingData.stage.seatsPerRow }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-primary/20 border border-primary rounded flex items-center justify-center text-xs font-medium"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Seating Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {seatingData.sections.map((section) => (
              <div key={section.id}>
                <h3 className="text-center font-semibold mb-4 text-card-foreground">{section.name}</h3>
                <div className="space-y-2">
                  {Array.from({ length: section.rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1">
                      {/* Row number */}
                      <div className="w-6 flex items-center justify-center text-xs text-muted-foreground font-medium">
                        {section.startRow + rowIndex}
                      </div>

                      {/* Seats */}
                      {Array.from({ length: section.seatsPerRow }).map((_, seatIndex) => {
                        const seatId = getSeatId(
                          section.id.charAt(0).toUpperCase(),
                          section.startRow + rowIndex,
                          seatIndex + 1,
                        )
                        const seatInfo = getSeatInfo(seatId)
                        const isSelected = selectedSeat === seatId

                        return (
                          <button
                            key={seatIndex}
                            onClick={() => handleSeatClick(seatId)}
                            className={`w-7 h-7 rounded text-xs font-medium transition-all ${
                              seatInfo
                                ? `${seatInfo.color} text-white hover:opacity-80 ${
                                    isSelected ? "ring-2 ring-foreground scale-110" : ""
                                  }`
                                : "bg-muted border border-border hover:bg-muted/70"
                            }`}
                            title={seatInfo ? `${seatInfo.name} (${seatInfo.code})` : `Ghế trống: ${seatId}`}
                          >
                            {seatInfo ? seatInfo.code : ""}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-semibold mb-3 text-card-foreground">Chú thích</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded"></div>
                <span className="text-sm text-muted-foreground">Khoa Cơ khí (ME)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-accent rounded"></div>
                <span className="text-sm text-muted-foreground">Khoa Điện - Điện tử (EE)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-secondary rounded"></div>
                <span className="text-sm text-muted-foreground">Khoa CNTT (IT)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-success rounded"></div>
                <span className="text-sm text-muted-foreground">Khoa Xây dựng (CE)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-muted border border-border rounded"></div>
                <span className="text-sm text-muted-foreground">Ghế trống</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Selected Seat Info */}
        {selectedSeat && getSeatInfo(selectedSeat) && (
          <Card className="mt-6 p-6">
            <h3 className="font-semibold mb-4 text-card-foreground">Thông tin ghế đã chọn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Vị trí ghế</div>
                <div className="font-medium text-card-foreground">{selectedSeat}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Đại biểu</div>
                <div className="font-medium text-card-foreground">{getSeatInfo(selectedSeat)?.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Đoàn</div>
                <div className="font-medium text-card-foreground">{getSeatInfo(selectedSeat)?.delegation}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Mã đoàn</div>
                <Badge className={`${getSeatInfo(selectedSeat)?.color} text-white`}>
                  {getSeatInfo(selectedSeat)?.code}
                </Badge>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
