export function Footer() {
  return (
    <footer className="bg-muted mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground">Đại hội Hội sinh viên</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Trường Đại học Sư phạm Kỹ thuật
              <br />
              Thành phố Hồ Chí Minh
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground">Liên hệ</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Địa chỉ: 1 Võ Văn Ngân, Thủ Đức, TP.HCM
              <br />
              Email: hoiSinhvien@hcmute.edu.vn
              <br />
              Điện thoại: (028) 3897 2092
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground">Thông tin</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Hệ thống quản lý Đại hội
              <br />
              Phiên bản 1.0
              <br />© 2025 HCMUTE
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-muted-foreground text-sm">
          Được xây dựng bởi <><a href="https://github.com/QuocHung-0309">Quốc Hưng</a></>
        </div>
      </div>
    </footer>
  )
}
