"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { getSession, setSession } from "@/lib/user-session";

/** TODO: Thay dãy MSSV thật vào đây */
/** TODO: Thay dãy MSSV thật vào đây */
const ALLOWED_IDS = new Set<string>([
  "2212345",
  "22110340",
  "21126197",
  "23139008",
  "22110013",
  "23161090",
  "22110065",
  "22116007",
  "23110066",
  "21110001",
  "23119017",
  "23110053",
  "24110139",
  "24147061",
  "22144332",
  "23144173",
  "23146053",
  "22104004",
  "24143185",
  "21146203",
  "22143195",
  "23144105",
  "23144247",
  "24134040",
  "23143198",
  "24146311",
  "22143036",
  "23142273",
  "24142345",
  "23119064",
  "22151196",
  "23151299",
  "23129059",
  "22142284",
  "21139075",
  "22151216",
  "23139006",
  "24142101",
  "22129013",
  "24161301",
  "23142387",
  "23145442",
  "23145254",
  "23145259",
  "21145530",
  "22145519",
  "23145355",
  "21145429",
  "22145480",
  "22132139",
  "23126153",
  "23126038",
  "22124240",
  "24132207",
  "23125031",
  "21124445",
  "22126053",
  "24126230",
  "24132145",
  "23125123",
  "23140047",
  "22160045",
  "23149141",
  "24127068",
  "22160046",
  "21149217",
  "22149287",
  "23155004",
  "24160007",
  "23149190",
  "23123006",
  "23159017",
  "24123028",
  "24123049",
  "24109103",
  "22159053",
  "22123067",
  "23110305",
  "23110325",
  "22110437",
  "21133004",
  "22110219",
  "24162019",
  "23110266",
  "24162076",
  "23162114",
  "23128143",
  "24128019",
  "24128108",
  "22128097",
  "22128166",
  "21128304",
  "23128199",
  "21150114",
  "22131095",
  "23950006",
  "23950010",
  "22131003",
  "23131068",
  "22130001",
  "24130004",
  "24130078",
  "21130086",
  "21156017",
  "23158109",
  "24158097",
  "23156062",
  "23156028",
  "23163019",
  "24163095",
  "23163034",
  "24164038",
  "22145376",
  "22161321",
  "22124014",
  "23136021",
  "24145207",
  "24154039",
  "22131127",
  "23128159",
  "22149322",
  "22104009",
  "21104091",
  "23133035",
  "22133026",
  "23128131",
  "23142336",
  "23131009",
  "23132114",
  "23145319",
  "23131093",
  "21140077",
  "23139009",
  "22149200",
  "21131004",
  "21146194",
  "24144084",
  "24126074",
  "22158026",
  "22125033",
  "24151097",
  "20116153",
  "24136006",
  "21116130",
  "22110248",
]);

/** Optional: map MSSV -> tên để chào mừng “Đ/c …” */
const NAME_MAP: Record<string, string> = {
  "2212345": "Nguyễn Văn A",
  "2267890": "Trần Thị B",
};

export function IdGateModal({
  autoOpenOnMount = true,
}: {
  autoOpenOnMount?: boolean;
}) {
  const { toast } = useToast();

  const [open, setOpen] = React.useState(false);
  const [mssv, setMssv] = React.useState("");
  const [guest, setGuest] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  // mở modal nếu chưa có session
  React.useEffect(() => {
    if (!autoOpenOnMount) return;
    const s = getSession();
    if (!s.delegateId && !s.isGuest) {
      setOpen(true);
    }
  }, [autoOpenOnMount]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (guest) {
      setSubmitting(true);
      setSession({
        isGuest: true,
        delegateId: undefined,
        displayName: undefined,
      });
      toast({
        title: "Xin chào 👋",
        description: "Bạn đang ở chế độ Khách (không thể biểu quyết).",
      });
      setOpen(false);
      setSubmitting(false);
      return;
    }

    const id = mssv.trim();
    if (!id) return setErr("Vui lòng nhập MSSV.");
    if (!ALLOWED_IDS.has(id))
      return setErr("MSSV không có trong danh sách đại biểu.");

    setSubmitting(true);
    const name = NAME_MAP[id] ?? id;
    setSession({ delegateId: id, displayName: NAME_MAP[id], isGuest: false });
    toast({
      title: "Chào mừng đại biểu ✨",
      description: `Xin chào Đ/c ${name}! Chúc bạn phiên làm việc hiệu quả.`,
    });
    setOpen(false);
    setSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md z-[1000]">
        <DialogHeader>
          <DialogTitle>Xác định đại biểu</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="mssv">MSSV (đại biểu)</Label>
            <Input
              id="mssv"
              placeholder="VD: 2212345"
              value={mssv}
              onChange={(e) => setMssv(e.target.value)}
              disabled={guest || submitting}
            />
            {err && <div className="text-sm text-rose-600">{err}</div>}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <Checkbox
              checked={guest}
              onCheckedChange={(v) => setGuest(Boolean(v))}
              disabled={submitting}
            />
            Tôi là khách (không biểu quyết)
          </label>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Để sau
            </Button>
            <Button type="submit" disabled={submitting}>
              {guest ? "Vào với tư cách Khách" : "Xác nhận"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
