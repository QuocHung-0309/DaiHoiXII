"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown, Minus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface VotingInterfaceProps {
  documentId: string
  documentTitle: string
}

export function VotingInterface({ documentId, documentTitle }: VotingInterfaceProps) {
  const [selectedVote, setSelectedVote] = useState<"agree" | "disagree" | "abstain" | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const voteOptions = [
    {
      value: "agree" as const,
      label: "Tán thành",
      icon: ThumbsUp,
      color: "bg-success hover:bg-success/90",
      textColor: "text-success",
      description: "Đồng ý với nội dung văn kiện",
    },
    {
      value: "disagree" as const,
      label: "Không tán thành",
      icon: ThumbsDown,
      color: "bg-destructive hover:bg-destructive/90",
      textColor: "text-destructive",
      description: "Không đồng ý với nội dung văn kiện",
    },
    {
      value: "abstain" as const,
      label: "Không có ý kiến",
      icon: Minus,
      color: "bg-muted hover:bg-muted/90",
      textColor: "text-muted-foreground",
      description: "Không biểu quyết",
    },
  ]

  const handleVoteSelect = (vote: "agree" | "disagree" | "abstain") => {
    if (!hasVoted) {
      setSelectedVote(vote)
    }
  }

  const handleSubmitVote = async () => {
    if (!selectedVote || hasVoted) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setHasVoted(true)
    setIsSubmitting(false)

    toast({
      title: "Biểu quyết thành công",
      description: `Bạn đã biểu quyết "${voteOptions.find((v) => v.value === selectedVote)?.label}" cho văn kiện này.`,
    })
  }

  if (hasVoted) {
    return (
      <Card className="p-6 mb-6 bg-success/10 border-success">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-success" size={24} />
          <div>
            <h3 className="font-semibold text-success">Đã biểu quyết thành công</h3>
            <p className="text-sm text-muted-foreground">
              Bạn đã biểu quyết "{voteOptions.find((v) => v.value === selectedVote)?.label}" cho văn kiện này
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-card-foreground mb-2">Biểu quyết văn kiện</h2>
        <p className="text-muted-foreground text-sm">Vui lòng chọn ý kiến biểu quyết của bạn</p>
      </div>

      {/* Vote Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {voteOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedVote === option.value

          return (
            <button
              key={option.value}
              onClick={() => handleVoteSelect(option.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className={`p-3 rounded-full ${isSelected ? "bg-primary/10" : "bg-muted"} transition-colors`}>
                  <Icon className={isSelected ? "text-primary" : option.textColor} size={24} />
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                </div>
                {isSelected && (
                  <Badge variant="default" className="mt-2">
                    Đã chọn
                  </Badge>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={handleSubmitVote} disabled={!selectedVote || isSubmitting} size="lg" className="min-w-[200px]">
          {isSubmitting ? "Đang xử lý..." : "Xác nhận biểu quyết"}
        </Button>
      </div>

      {/* Info */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Lưu ý:</strong> Sau khi xác nhận biểu quyết, bạn không thể thay đổi ý kiến. Vui lòng cân nhắc kỹ trước
          khi biểu quyết.
        </p>
      </div>
    </Card>
  )
}
