"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle } from "lucide-react"

interface VotingSectionProps {
  documentId: number
  documentTitle: string
}

export function VotingSection({ documentId, documentTitle }: VotingSectionProps) {
  const [selectedVote, setSelectedVote] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = (voteType: string) => {
    setSelectedVote(voteType)
  }

  const handleSubmit = () => {
    // TODO: Gửi biểu quyết lên server
    console.log("Biểu quyết:", {
      documentId,
      voteType: selectedVote,
      comment: selectedVote === "other" ? comment : null,
    })
    setHasVoted(true)
  }

  if (hasVoted) {
    return (
      <div className="bg-success/10 border border-success rounded-lg p-8 text-center">
        <CheckCircle size={48} className="text-success mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-success mb-2">Cảm ơn bạn đã biểu quyết!</h3>
        <p className="text-muted-foreground">
          Ý kiến của bạn đã được ghi nhận và sẽ được tổng hợp vào kết quả biểu quyết.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-card-foreground mb-2">Biểu quyết văn kiện</h2>
      <p className="text-muted-foreground mb-6">Vui lòng chọn ý kiến của bạn về văn kiện này</p>

      {/* Voting Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => handleVote("agree")}
          className={`p-6 border-2 rounded-lg transition-all ${
            selectedVote === "agree" ? "border-success bg-success/10" : "border-border hover:border-success/50"
          }`}
        >
          <ThumbsUp
            size={32}
            className={`mx-auto mb-3 ${selectedVote === "agree" ? "text-success" : "text-muted-foreground"}`}
          />
          <div className={`font-bold text-lg ${selectedVote === "agree" ? "text-success" : "text-card-foreground"}`}>
            Đồng ý
          </div>
          <div className="text-sm text-muted-foreground mt-1">Tán thành văn kiện</div>
        </button>

        <button
          onClick={() => handleVote("disagree")}
          className={`p-6 border-2 rounded-lg transition-all ${
            selectedVote === "disagree" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
          }`}
        >
          <ThumbsDown
            size={32}
            className={`mx-auto mb-3 ${selectedVote === "disagree" ? "text-primary" : "text-muted-foreground"}`}
          />
          <div className={`font-bold text-lg ${selectedVote === "disagree" ? "text-primary" : "text-card-foreground"}`}>
            Không đồng ý
          </div>
          <div className="text-sm text-muted-foreground mt-1">Không tán thành</div>
        </button>

        <button
          onClick={() => handleVote("other")}
          className={`p-6 border-2 rounded-lg transition-all ${
            selectedVote === "other" ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
          }`}
        >
          <MessageSquare
            size={32}
            className={`mx-auto mb-3 ${selectedVote === "other" ? "text-accent" : "text-muted-foreground"}`}
          />
          <div className={`font-bold text-lg ${selectedVote === "other" ? "text-accent" : "text-card-foreground"}`}>
            Ý kiến khác
          </div>
          <div className="text-sm text-muted-foreground mt-1">Góp ý, đề xuất</div>
        </button>
      </div>

      {/* Comment Box for "Other" option */}
      {selectedVote === "other" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-card-foreground mb-2">Ý kiến của bạn</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Vui lòng chia sẻ ý kiến, đề xuất của bạn về văn kiện..."
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            rows={4}
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedVote || (selectedVote === "other" && !comment.trim())}
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Gửi biểu quyết
      </button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Bạn chỉ có thể biểu quyết một lần cho mỗi văn kiện
      </p>
    </div>
  )
}
