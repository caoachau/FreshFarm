export default function ReturnPolicyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chính Sách Đổi Trả</h1>
      
      <div className="space-y-6">
        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Điều Kiện Đổi Trả</h2>
          <ul className="space-y-2 text-neutral-700">
            <li>• Sản phẩm còn nguyên vẹn, chưa sử dụng</li>
            <li>• Còn hạn sử dụng (đối với thực phẩm)</li>
            <li>• Còn đầy đủ bao bì, nhãn mác</li>
            <li>• Thời gian đổi trả: trong vòng 7 ngày kể từ ngày nhận hàng</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Quy Trình Đổi Trả</h2>
          <ol className="space-y-2 text-neutral-700 list-decimal list-inside">
            <li>Liên hệ hotline hoặc email để thông báo đổi trả</li>
            <li>Chụp ảnh sản phẩm và gửi cho chúng tôi</li>
            <li>Nhân viên sẽ xác nhận và hướng dẫn đổi trả</li>
            <li>Gửi sản phẩm về địa chỉ của chúng tôi</li>
            <li>Nhận lại sản phẩm mới hoặc hoàn tiền</li>
          </ol>
        </section>

        <section className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Lưu Ý</h2>
          <ul className="space-y-2 text-neutral-700">
            <li>• Không áp dụng đổi trả cho sản phẩm đã sử dụng hoặc hư hỏng do lỗi khách hàng</li>
            <li>• Phí vận chuyển đổi trả do khách hàng chịu (trừ trường hợp lỗi từ phía chúng tôi)</li>
            <li>• Thời gian xử lý đổi trả: 3-5 ngày làm việc</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

