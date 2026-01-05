export default function PrivacyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chính Sách Bảo Mật</h1>
      
      <div className="space-y-6">
        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Thu Thập Thông Tin</h2>
          <p className="text-neutral-700 mb-3">
            Chúng tôi thu thập thông tin cá nhân của bạn khi bạn:
          </p>
          <ul className="space-y-2 text-neutral-700">
            <li>• Đăng ký tài khoản trên website</li>
            <li>• Đặt hàng và thanh toán</li>
            <li>• Liên hệ với chúng tôi</li>
            <li>• Đăng ký nhận thông tin khuyến mãi</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Sử Dụng Thông Tin</h2>
          <p className="text-neutral-700 mb-3">
            Thông tin cá nhân của bạn được sử dụng để:
          </p>
          <ul className="space-y-2 text-neutral-700">
            <li>• Xử lý đơn hàng và giao hàng</li>
            <li>• Cải thiện dịch vụ và trải nghiệm khách hàng</li>
            <li>• Gửi thông tin khuyến mãi (nếu bạn đồng ý)</li>
            <li>• Liên hệ hỗ trợ khi cần thiết</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Bảo Mật Thông Tin</h2>
          <p className="text-neutral-700 mb-3">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn:
          </p>
          <ul className="space-y-2 text-neutral-700">
            <li>• Sử dụng công nghệ mã hóa SSL để bảo vệ dữ liệu</li>
            <li>• Không chia sẻ thông tin với bên thứ ba không liên quan</li>
            <li>• Chỉ nhân viên có thẩm quyền mới được truy cập thông tin</li>
            <li>• Tuân thủ các quy định về bảo vệ dữ liệu cá nhân</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
