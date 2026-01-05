export default function TermsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Điều Khoản Sử Dụng</h1>
      
      <div className="space-y-6">
        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">1. Chấp Nhận Điều Khoản</h2>
          <p className="text-neutral-700">
            Bằng việc truy cập và sử dụng website FreshFarm, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này.
          </p>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">2. Sử Dụng Website</h2>
          <ul className="space-y-2 text-neutral-700">
            <li>• Bạn phải đủ 18 tuổi hoặc có sự đồng ý của người giám hộ để sử dụng dịch vụ</li>
            <li>• Bạn chịu trách nhiệm về thông tin đăng ký tài khoản</li>
            <li>• Không được sử dụng website cho mục đích bất hợp pháp</li>
            <li>• Không được can thiệp, phá hoại hệ thống website</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">3. Đặt Hàng và Thanh Toán</h2>
          <ul className="space-y-2 text-neutral-700">
            <li>• Đơn hàng chỉ được xác nhận sau khi thanh toán thành công</li>
            <li>• Giá sản phẩm có thể thay đổi mà không cần thông báo trước</li>
            <li>• Chúng tôi có quyền từ chối đơn hàng nếu có dấu hiệu gian lận</li>
            <li>• Phương thức thanh toán: COD, VietQR, chuyển khoản</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">4. Quyền Sở Hữu Trí Tuệ</h2>
          <p className="text-neutral-700">
            Tất cả nội dung trên website bao gồm logo, hình ảnh, văn bản đều thuộc quyền sở hữu của FreshFarm. 
            Không được sao chép, sử dụng mà không có sự cho phép.
          </p>
        </section>
      </div>
    </div>
  )
}
